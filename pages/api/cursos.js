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
    if (req.method === 'GET') {
        const { curso } = req.query;

        try {
            const database = await connectToDatabase();
            const collection = database.collection("material");

            const cursos = await collection.aggregate([
                { $match: { nombremateria: curso } },
                { $unwind: "$cursos" },
                { $group: { _id: "$cursos.nombrecurso" } },
                { $project: { "nombrecurso": "$_id", _id: 0 } }
            ]).toArray();

            res.status(200).json(cursos);
        } catch (error) {
            console.error("Error al obtener los cursos:", error);
            res.status(500).json({ error: "Error al obtener los cursos" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
