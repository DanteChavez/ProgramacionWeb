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
        const { nombremateria, nombrecurso } = req.query;

        try {
            const database = await connectToDatabase();
            const collection = database.collection("material");

            const resultados = await collection.aggregate([
                { $match: { "nombremateria": nombremateria } },
                { $unwind: "$cursos" },
                { $match: { "cursos.nombrecurso": nombrecurso } },
                { $unwind: "$cursos.materiales" },
                { $project: { "material": "$cursos.materiales", "_id": 0 } }
            ]).toArray();

            res.status(200).json(resultados);
        } catch (error) {
            console.error("Error en la consulta de materiales:", error);
            res.status(500).json({ error: "Error en la consulta de materiales" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
