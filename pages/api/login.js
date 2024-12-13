import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
    user: 'postgres', // por defecto casi todo
    host: '127.0.0.1',
    database: 'web',
    password: '12345', // que seguridad mas grande
    port: 5432,
});
// La clave es tan secreta que hasta el editor no la puede mostrar
const SECRET_KEY = '*****'; 

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { nombre, contr } = req.body;

        try {
            const query = `
                SELECT idusuario, permisos 
                FROM usuarios 
                WHERE (correo = $1 OR nombre = $1) AND contrasena = $2
            `;
            const values = [nombre, contr];
            
            const result = await pool.query(query, values);
            console.log(result)
            if (result.rows.length > 0) {
                const user = result.rows[0];

                // Genera un token JWT con los datos del usuario
                const token = jwt.sign(
                    { id: user.idusuario, permisos: user.permisos },
                    SECRET_KEY,
                    { expiresIn: '1h' } // El token expira en 1 hora
                );
                //console.log(token.user);

                res.status(200).json({ success: true, token });
            } else {
                res.status(401).json({ success: false, error: "Credenciales incorrectas" });
            }
        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).json({ success: false, error: "Error en el login" });
        }
    } else {
        res.status(405).json({ error: 'Método no permitido' });
    }
}
