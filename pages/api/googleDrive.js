const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

// Configura la autenticación
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(process.cwd(), 'service_account.json'), // Asegúrate de colocar este archivo en tu proyecto
  scopes: ['https://www.googleapis.com/auth/drive'],
});

// Inicializa el cliente de Google Drive
const drive = google.drive({ version: 'v3', auth });

module.exports = { drive };
