// api.js
const { login } = require('./conexion.js');
//const localStorage = require('./storage');

async function main(tipo, dato1, dato2) {
    console.log("request :" , tipo, "\ndato1: ", dato1, "\ndato2: ", dato2);
    /*
  const accion = localStorage.getItem('accion');
  if (accion === 'accederLogin') {
    const nombre = localStorage.getItem('nombre');
    const contrasena = localStorage.getItem('contrasena');

    const isAuthenticated = await login(nombre, contrasena);
    if (isAuthenticated) {
      console.log("Login exitoso");
      return true;
    } else {
      console.log("Correo/nombre de usuario o contraseña incorrectos");
      return false;
    }
  } else {
    console.log("Acción no válida");
    return false;
  }
    */
}

module.exports = { main };
