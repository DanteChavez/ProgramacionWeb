import jwt from 'jsonwebtoken';

const SECRET_KEY = '*****'; // a

export default async function handler(req, res) {
    const { nombremateria, nombrecurso } = req.query;
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token del header Authorization
    
    if (!token) {
        return res.redirect(307, `/materialadmin?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        //return res.status(401).json({ error: 'Token no proporcionado' });
    }
    
    try {
        // Decodificar el token
        const decoded = jwt.verify(token, SECRET_KEY);
        const permisos = decoded.permisos;

        // Redirigir según los permisos
        if (permisos === 1) {
            return res.redirect(307, `/materialadmin?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        } else if (permisos === 0) {
            return res.redirect(307, `/material?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        } else {
            return res.redirect(307, `/material?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        }
    } catch (err) {
        return res.redirect(307, `/material?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        console.error('Error al verificar el token:', err);
        return res.status(403).json({ error: 'Token inválido o expirado' });
    }
}
