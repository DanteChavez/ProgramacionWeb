const { mostrarMaterialTodo , mostrarMateriaTodo, mostrarCursoTodo, login} = require('./conexion.js');
const localStorage = require('./storage');
async function main() {
    //const resultados = await mostrarMaterialTodo("programacion", "base de datos");

    //const resultados = await mostrarCursoTodo("matematicas");

    //console.log(resultados);

    nombre = "quinto";
    contrasena = "1234";

    const isAuthenticated = await login(nombre, contrasena);

    if (isAuthenticated) {
        console.log("Login exitoso");
    } else {
        console.log("Correo/nombre de usuario o contraseña incorrectos");
    }
    //const token = localStorage.getItem('token');
    //console.log('Token recuperado:', token); // Debería mostrar 'miTokenPersistente'
}

async function login() {
    //const resultados = await mostrarMaterialTodo("programacion", "base de datos");

    //const resultados = await mostrarCursoTodo("matematicas");

    //console.log(resultados);

    nombre = "quinto";
    contrasena = "1234";

    const isAuthenticated = await login(nombre, contrasena);
    
    if (isAuthenticated) {
        console.log("Login exitoso");
    } else {
        console.log("Correo/nombre de usuario o contraseña incorrectos");
    }
    //const token = localStorage.getItem('token');
    //console.log('Token recuperado:', token); // Debería mostrar 'miTokenPersistente'
}

main().catch(console.error);
