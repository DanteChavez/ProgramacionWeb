'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirigir a otras páginas
import Link from 'next/link';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validar si los campos no están vacíos
    if (!nombre || !contrasena) {
      setError('Por favor, ingrese todos los campos.');
      return;
    }

    try {
      // Realizar la solicitud a la API de login
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, contr: contrasena }),
      });

      // Obtener los datos de la respuesta
      const data = await response.json();

      if (response.ok) {
        // Si el login es exitoso, redirige a /materia
        router.push('/materia');
      } else {
        // Si hay un error, muestra el mensaje
        setError(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error en el login:', error);
      setError('Error al procesar la solicitud');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>Logo</div>
        <nav className={styles.nav}>
          <Link href="#">Products</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Community</Link>
          <Link href="#">Resources</Link>
          <Link href="#">Pricing</Link>
          <Link href="/login" className={styles.button}>Iniciar sesión</Link>
          <Link href="/signup" className={styles.buttonBlack}>Crear cuenta</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>Iniciar sesión</h1>
        <form className={styles.form} onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Nombre / correo"
            className={styles.input}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)} // Gestionar el estado de nombre
          />
          <input
            type="password"
            placeholder="Contraseña"
            className={styles.input}
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)} // Gestionar el estado de contraseña
          />
          <button type="submit" className={styles.submitButton}>Iniciar sesión</button>
        </form>
        <Link href="#" className={styles.forgotPassword}>¿Olvidaste la contraseña?</Link>

        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Mostrar el error si hay uno */}
      </main>
      <footer className={styles.footer}>
        <div className={styles.icon}>📁</div>
        <div>
          <h2>100</h2>
          <p>Disponemos de un total de x archivos disponibles</p>
        </div>
      </footer>
    </div>
  );
}
