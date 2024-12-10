import formidable from 'formidable';
import path from 'path';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
const SECRET_KEY = '*****'; 
export const config = {
    api: {
        bodyParser: false, // Deshabilitar el parser por defecto
    },
};

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let db;
const tempDir = path.join(process.cwd(), 'tmp');

// Crear el directorio si no existe
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configurar autenticación para Google Drive
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), './pages/api/service_account.json'), // clave privada no tan privada
    scopes: ['https://www.googleapis.com/auth/drive'],
});
const drive = google.drive({ version: 'v3', auth });

async function connectToDatabase() {
    if (!db) {
        await client.connect();
        console.log("Conectado a MongoDB");
        db = client.db("admin");
    }
    return db;
}

async function uploadToGoogleDrive(filePath, fileName) {
    
    const fileMetadata = {
        name: fileName, // Nombre del archivo en Google Drive
        parents: '1EkEzfVMnl1lDWBGKxBB192BjEbckse9R', // ni idea a que carpeta lo estoy subiendo en el drive, no modificar. respaldo: 1EkEzfVMnl1lDWBGKxBB192BjEbckse9R
    };
    const media = {
        mimeType: 'application/pdf', // Cambia según el tipo de archivo
        body: fs.createReadStream(filePath),
    };
    console.log("filePath: \t", filePath);
    console.log("fileMetadata.parents: \t", fileMetadata.parents);
    const file = await drive.files.create({
        resource: fileMetadata,
        media,
        fields: 'id, webViewLink',
    });
    
console.log("Archivo subido exitosamente:");
console.log("ID del archivo:", file.data.id);
console.log("Nombre del archivo:", file.data.name);
console.log("Enlace para ver el archivo:", file.data.webViewLink);
console.log("Enlace para descargar el archivo:", file.data.webContentLink);
await drive.permissions.create({
    fileId: file.data.id,
    requestBody: {
        role: 'reader',
        type: 'anyone', // Permite que cualquiera con el enlace lo vea
    },
});

    // Devuelve el enlace público al archivo
    return file.data.id;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const form = formidable({
            uploadDir: tempDir, // Directorio temporal
            keepExtensions: true, // Mantener extensiones
        });
        
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.error("Error al procesar el archivo:", err);
                return res.status(500).json({ success: false, error: "Error al procesar el archivo" });
            }

            try {
                const { nombremateria, nombrecurso, nombrematerial, tipo, descripcion, fecha, categoria ,token} = fields;
                if(token[0] == null){
                    console.log("no esta logeado")
                    return res.status(400).json({ success: false, error: "Debe logearse para subir archivos" });
                } else {
                //console.log("AASDASDDS");
                const decoded = jwt.verify(token[0], SECRET_KEY);
                //console.log(decoded.permisos);
                // no se programar
                if(decoded.permisos == 0) {
                    console.log("permisos = 0");
                } else if(decoded.permisos == 1){
                    console.log("permisos = 1");
                } else {
                    console.log("no");
                    return res.status(400).json({ success: false, error: "Debe logearse para subir archivos" });
                }
                //console.log("exito");
                console.log("exito");
                if (!nombremateria || !nombrecurso || !nombrematerial || !tipo || !descripcion || !fecha || !categoria || !files.archivo) {
                    return res.status(400).json({ success: false, error: "Todos los campos son obligatorios" });
                }
                console.log("exito22");
                const archivoSubido = files.archivo[0];
                const filePath = archivoSubido.filepath; // Ruta del archivo temporal
                const randomFileName = `${Date.now()}-${archivoSubido.originalFilename}`;
                
                // Subir archivo a Google Drive
                
                
                // Conectar a la base de datos
                const database = await connectToDatabase();
                const materiasCollection = database.collection("material");

                // Validar materia y curso
                const materia = await materiasCollection.findOne({ nombremateria: nombremateria[0] });
                if (!materia) {
                    console.log("Materia no encontrado");
                    return res.status(404).json({ success: false, error: "Materia no encontrada" });
                }

                const curso = await materiasCollection.findOne({
                    "nombremateria": nombremateria[0],
                    "cursos.nombrecurso": nombrecurso[0],
                });

                if (!curso) {
                    console.log("Curso no encontrado");
                    return res.status(404).json({ success: false, error: "Curso no encontrado" });
                }

                // Obtener conteo actual de materiales
                const conteo = await materiasCollection.aggregate([
                    { $match: { "nombremateria": nombremateria[0] } },
                    { $unwind: "$cursos" },
                    { $match: { "cursos.nombrecurso": nombrecurso[0] } },
                    { $unwind: "$cursos.materiales" },
                    { $count: "total_materiales" },
                ]).toArray();
                const totalnumero = conteo.length > 0 ? conteo[0].total_materiales : 0;

                const googleDriveLink = await uploadToGoogleDrive(filePath, randomFileName);
                // Crear el nuevo material
                const nuevoMaterial = {
                    idmaterial: totalnumero + 1,
                    nombrematerial: nombrematerial[0],
                    tipo: tipo[0],
                    descripcion: descripcion[0],
                    fecha: fecha[0],
                    aprovado: false,
                    idmateria: materia.idmateria,
                    ruta: googleDriveLink, // Enlace generado por Google Drive
                    categoria: categoria[0],
                };

                // Añadir el material a la base de datos
                const anadir = await materiasCollection.updateOne(
                    { "nombremateria": nombremateria[0], "cursos.nombrecurso": nombrecurso[0] },
                    { $push: { "cursos.$.materiales": nuevoMaterial } }
                );
                //console.log("################################\n\n\n\n\n");


                //console.log("SOLICITUD");

                //console.log("################################\n\n\n\n\n");
                if (anadir.modifiedCount > 0) {
                    res.status(201).json({
                        success: true,
                        message: "Material agregado exitosamente",
                        material: {
                            nombrematerial,
                            tipo,
                            descripcion,
                            fecha,
                            categoria,
                            ruta: googleDriveLink,
                        },
                    });
                } else {

                    return res.status(500).json({ success: false, error: "Error al añadir material" });
                }
            }
            } catch (error) {
                console.error("Error al agregar material:", error);
                res.status(500).json({ success: false, error: "Error interno del servidor" });
            }
        });
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
