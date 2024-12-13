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
    if (req.method === 'DELETE') {
        const { ruta } = req.body;

        if (!ruta) {
            return res.status(400).json({ error: 'La ruta del material es obligatoria' });
        }

        try {
            const database = await connectToDatabase();
            const collection = database.collection("material");

            // Eliminar el material buscando por su ruta
            const resultado = await collection.updateOne(
                { "cursos.materiales.ruta": ruta },
                {
                    $pull: { "cursos.$[].materiales": { ruta: ruta } }
                }
            );

            if (resultado.modifiedCount === 0) {
                return res.status(404).json({ error: 'Material no encontrado' });
            }

            res.status(200).json({ mensaje: 'Material eliminado con éxito' });
        } catch (error) {
            console.error("Error al eliminar el material:", error);
            res.status(500).json({ error: "Error al eliminar el material" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
