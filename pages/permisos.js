// /pages/check-permissions.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const CheckPermissions = () => {
    const router = useRouter();

    useEffect(() => {
        // Obtener los parámetros de la URL
        const { nombremateria, nombrecurso } = router.query;

        // Verificar que los parámetros existan
        if (!nombremateria || !nombrecurso) {
            console.error('Faltan parámetros en la URL');
            router.push('/error'); // Redirige a una página de error si faltan datos
            return;
        }

        // Obtener el token del usuario
        const token = localStorage.getItem('token');
        /*
        if (!token) {
            // Redirigir al login si no hay token
            router.push('/login');
            return;
        }*/

        // Decodificar el token (asumiendo formato JWT)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const permisos = payload.permisos;

        // Redirigir según los permisos
        if (permisos == 1) {
            router.push(`/materialadmin?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        } else if (permisos == 0) {
            router.push(`/material?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
        } else {
            router.push('/acceso-denegado'); // Redirigir si no tiene permisos válidos
        }
    }, [router]);

    return (
        <div>
            <h1>Verificando permisos...</h1>
            <p>Por favor espera mientras te redirigimos.</p>
        </div>
    );
};

export default CheckPermissions;
