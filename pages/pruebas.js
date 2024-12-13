'use client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function MiComponente() {
    const searchParams = useSearchParams();

    // Estado inicial para el formulario
    const [formData, setFormData] = useState({
        nombre: '',
        fecha: '',
        descripcion: '',
        categoria: '',
        archivo: null,
        nombremateria: '', // Se inicializa vacío
        nombrecurso: '',   // Se inicializa vacío
    });

    // Actualiza `formData` cuando cambien los parámetros en la URL
    useEffect(() => {
        const nombremateria = searchParams.get('nombremateria') || ''; // Recupera el valor o usa vacío
        const nombrecurso = searchParams.get('nombrecurso') || ''; // Recupera el valor o usa vacío

        setFormData(prev => ({
            ...prev,
            nombremateria,
            nombrecurso,
        }));
    }, [searchParams]);

    console.log('Nombremateria:', formData.nombremateria);
    console.log('Nombrecurso:', formData.nombrecurso);

    return (
        <div>
            <form>
                <p>Nombremateria: {formData.nombremateria}</p>
                <p>Nombrecurso: {formData.nombrecurso}</p>
                {/* Resto del formulario */}
            </form>
        </div>
    );
}
