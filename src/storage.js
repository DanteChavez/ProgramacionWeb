// storage.js
const { LocalStorage } = require('node-localstorage');

// Crear y exportar una única instancia
const localStorage = new LocalStorage('./token');
module.exports = localStorage;
