"use client";

import Link from 'next/link';
import styles from '../styles/Signup.module.css';

export default function Signup() {
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
          <Link href="#">Contact</Link>
          <Link href="/login" className={styles.button}>Iniciar sesión</Link>
          <Link href="/signup" className={styles.buttonBlack}>Crear cuenta</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>Crear cuenta</h1>
        <form className={styles.form}>
          <input type="text" placeholder="Nombre" className={styles.input} />
          <input type="email" placeholder="Correo" className={styles.input} />
          <input type="password" placeholder="Contraseña" className={styles.input} />
          <button type="submit" className={styles.submitButton}>Crear cuenta</button>
        </form>
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