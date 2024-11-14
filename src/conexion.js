const { MongoClient } = require('mongodb');
//const localStorage = require('./storage');
// URL de conexión y cliente de MongoDB
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let db; // Variable para almacenar la conexión a la base de datos

async function connectToDatabase() {
    if (!db) { // Solo se conecta una vez
        await client.connect();
        console.log("Conectado a MongoDB");
        db = client.db("admin"); // Configura la base de datos que usarás
    }
    return db;
}

// Función para ejecutar la consulta de materiales en programación, curso base de datos
async function mostrarMaterialTodo(nombremateria, nombrecurso ) {
    try {
        const database = await connectToDatabase();
        const collection = database.collection("material");

        // Ejecutar la consulta de agregación para obtener los materiales específicos
        const resultados = await collection.aggregate([
            { $match: { "nombremateria": nombremateria} },
            { $unwind: "$cursos" },
            { $match: { "cursos.nombrecurso": nombrecurso} },
            { $unwind: "$cursos.materiales" },
            {
                $project: {
                    "material": "$cursos.materiales",
                    "_id": 0
                }
            }
        ]).toArray();

        return resultados;
    } catch (error) {
        console.error("Error en la consulta de materiales:", error);
    }
}

async function mostrarMateriaTodo() {
  try {
      const database = await connectToDatabase();
      const collection = database.collection("material");

      // Obtener las materias únicas
      const materias = await collection.aggregate([
          { $group: { _id: "$nombremateria" } },
          { $project: { "nombremateria": "$_id", _id: 0 } }
      ]).toArray();

      return materias;
  } catch (error) {
      console.error("Error al obtener las materias:", error);
  }
}

// Función para obtener los cursos de una materia específica
async function mostrarCursoTodo(curso) {
  try {
      const database = await connectToDatabase();
      const collection = database.collection("material");

      // Obtener los cursos de la materia específica
      const cursos = await collection.aggregate([
          { $match: { nombremateria: curso } },
          { $unwind: "$cursos" },
          { $group: { _id: "$cursos.nombrecurso" } },
          { $project: { "nombrecurso": "$_id", _id: 0 } }
      ]).toArray();

      return cursos;
  } catch (error) {
      console.error("Error al obtener los cursos:", error);
  }
}

// Función de login que verifica si el usuario existe y la contraseña es correcta
async function login(nombre, contr) {
  try {
      const database = await connectToDatabase();
      const collection = database.collection("usuario");

      // Buscar al usuario por correo o nombre de usuario y contraseña en texto plano
      const user = await collection.findOne({
          $or: [{ correo: nombre }, { nombre: nombre }],
          contrasena: contr
      });
      if(user.permisos == "1"){
        console.log("tiene permisos de admin")
        //localStorage.setItem('token', true);
      }
      // Si el usuario se encuentra y la contraseña es correcta, devuelve true

      if(user)

      return !!user;
  } catch (error) {
      console.error("Error en el login:", error);
      return false;
  }
}

module.exports = { mostrarMaterialTodo , mostrarMateriaTodo, mostrarCursoTodo, login};
