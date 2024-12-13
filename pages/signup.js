"use client";

import Link from 'next/link';
import styles from '../styles/Signup.module.css';
import Image from 'next/image';
import { useState } from 'react';

export default function Signup() {
  const [formData, setFormData] = useState({ nombre: '', correo: '', contrasena: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que se recargue la página
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Recuperar token desde el almacenamiento local si existe
      const token = localStorage.getItem('token');

      const response = await fetch('/api/registrarse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, token }), // Añadir el token al formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrarse');
      }

      const data = await response.json();
      setSuccessMessage('Cuenta creada exitosamente.');
      setFormData({ nombre: '', correo: '', contrasena: '' }); // Reinicia el formulario
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <a href="/">
          <Image
            src="/logo.png"
            alt="Descripción de la imagen"
            width={100}
            height={50}
          />
        </a>
        <nav className={styles.nav}>
          <Link href="#">Products</Link>
          <Link href="#">Solutions</Link>
          <Link href="#">Community</Link>
          <Link href="#">Resources</Link>
          <Link href="#">Pricing</Link>
          <Link href="#">Contact</Link>
          <Link href="/login" className={styles.button}>Iniciar sesión</Link>
          <Link href="/signup" className={styles.buttonBlack}>Crear cuenta</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>Crear cuenta</h1>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            className={styles.input}
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo"
            className={styles.input}
            value={formData.correo}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="contrasena"
            placeholder="Contraseña"
            className={styles.input}
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
          <button type="submit" className={styles.submitButton}>Crear cuenta</button>
        </form>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}
      </main>
      <footer className={styles.footer}>
        <div className={styles.icon}>📁</div>
        <div>
          <h2>100</h2>
          <p>Disponemos de un total de x archivos disponibles</p>
        </div>
        <div className={styles.footerLinks}>
          <div className={styles.footerColumn}>
            <h4>Use cases</h4>
            <ul>
              <li>UI design</li>
              <li>UX design</li>
              <li>Wireframing</li>
              <li>Diagramming</li>
              <li>Brainstorming</li>
              <li>Online whiteboard</li>
              <li>Team collaboration</li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Explore</h4>
            <ul>
              <li>Design</li>
              <li>Prototyping</li>
              <li>Development features</li>
              <li>Design systems</li>
              <li>Collaboration features</li>
              <li>Design process</li>
              <li>FigJam</li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <h4>Resources</h4>
            <ul>
              <li>Blog</li>
              <li>Best practices</li>
              <li>Colors</li>
              <li>Color wheel</li>
              <li>Support</li>
              <li>Developers</li>
              <li>Resource library</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
