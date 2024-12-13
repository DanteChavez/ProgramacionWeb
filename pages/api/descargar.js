import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Ruta para la clave de la cuenta de servicio
const keyPath = path.join(process.cwd(), './pages/api/service_account.json');
const scopes = ['https://www.googleapis.com/auth/drive.readonly'];

const auth = new google.auth.GoogleAuth({
  keyFile: keyPath,
  scopes: scopes,
});

const drive = google.drive({ version: 'v3', auth });

export default async function handler(req, res) {
  const { materialId } = req.query; // Obtener el materialId (ID del archivo) desde la URL de la API

  try {
    // Realiza una solicitud a la API de Google Drive para obtener el archivo
    const file = await drive.files.get({
      fileId: materialId, // El ID del archivo en Google Drive
      alt: 'media', // Obtener los datos binarios del archivo
    }, { responseType: 'stream' });

    // Crear un enlace de descarga temporal
    console.log("materialIdÑ \t",materialId);
    const downloadUrl = `https://drive.google.com/uc?export=download&id=${materialId}`;
    
    // Devolver la URL de descarga en la respuesta
    res.status(200).json({
      success: true,
      downloadUrl, // URL pública de descarga
    });
    
  } catch (error) {
    console.error('Error al obtener el archivo:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener el archivo desde Google Drive.',
    });
  }
}
