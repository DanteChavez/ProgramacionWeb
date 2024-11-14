import { MongoClient } from 'mongodb';

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db;

async function connectToDatabase() {
    if (!db) {
        await client.connect();
        console.log("Conectado a MongoDB");
        db = client.db("admin");
    }
    return db;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nombre, contr } = req.body;
        /////console.log("Nombre: ", nombre, " Contrasena: ", contr);
        try {
            const database = await connectToDatabase();
            const collection = database.collection("usuario");

            const user = await collection.findOne({
                $or: [{ correo: nombre }, { nombre: nombre }],
                contrasena: contr
            });
            
            if (user) {
                res.status(200).json({ success: true, isAdmin: user.permisos === "1" });
            } else {
                res.status(401).json({ success: false, error: "Credenciales incorrectas" });
            }
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ success: false, error: "Error en el login" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
