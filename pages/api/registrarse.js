import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    user: 'postgres', // Usuario de la base de datos
    host: '127.0.0.1', // Dirección del host
    database: 'web', // Nombre de la base de datos
    password: '12345', // Contraseña del usuario
    port: 5432, // Puerto de conexión
});

const SECRET_KEY = '*****'; // Clave secreta para validar tokens

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nombre, correo, contrasena, token } = req.body;

        if (!nombre || !correo || !contrasena) {
            res.status(400).json({ success: false, message: 'Faltan campos requeridos.' });
            return;
        }

        let permisos = 0; // Permisos por defecto

        // Validar el token si está presente
        if (token) {
            
            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                permisos = decoded.permisos === 1 ? 1 : 0;
            } catch (error) {
                // Token inválido o expirado
                permisos = 0;
            }
        }

        try {
            // Verificar si el correo ya está registrado
            const checkQuery = 'SELECT idusuario FROM usuarios WHERE correo = $1';
            const checkResult = await pool.query(checkQuery, [correo]);

            if (checkResult.rows.length > 0) {
                res.status(409).json({ success: false, message: 'El correo ya está registrado.' });
                return;
            }

            // Obtener el siguiente ID
            const idQuery = 'SELECT COUNT(idusuario) as total FROM usuarios';
            const idResult = await pool.query(idQuery);
            const nextId = (idResult.rows[0].total || 0) + 1;

            // Insertar el nuevo usuario con los permisos correspondientes
            const insertQuery = `
                INSERT INTO usuarios (idusuario, nombre, correo, contrasena, permisos) 
                VALUES ($1, $2, $3, $4, $5) RETURNING idusuario`;
            const values = [nextId, nombre, correo, contrasena, permisos];
            const result = await pool.query(insertQuery, values);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente.',
                userId: result.rows[0].id,
            });
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            res.status(500).json({ success: false, message: 'Error interno del servidor.' });
        }
    } else {
        res.status(405).json({ success: false, message: 'Método no permitido.' });
    }
}
