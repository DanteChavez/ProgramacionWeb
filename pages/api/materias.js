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
        try {
            const database = await connectToDatabase();
            const collection = database.collection("material");

            const materias = await collection.aggregate([
                { $group: { _id: "$nombremateria" } },
                { $project: { "nombremateria": "$_id", _id: 0 } }
            ]).toArray();

            res.status(200).json(materias);
        } catch (error) {
            console.error("Error al obtener las materias:", error);
            res.status(500).json({ error: "Error al obtener las materias" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
