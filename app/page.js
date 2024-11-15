'use client';


import Link from 'next/link';
import styles from '../styles/Home.module.css';
import Image from 'next/image'; // Importa el componente Image de Next.js

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Image src="/inicio.png" alt="Logo" width={50} height={50} />
        <div className={styles.logo}>Plataforma de recursos intercambiables</div>
        <nav className={styles.nav}>
          <Link href="/materia">Materias</Link>
          <Link href="#">Foros</Link>
          <Link href="#">Cursos disponibles</Link>
          <Link href="#">Materiales</Link>
          <Link href="#">Sobre Nosotros</Link>
          <Link href="#">Contactanos</Link>
          <Link href="/login" className={styles.button}>Iniciar sesión</Link>
          <Link href="/signup" className={styles.buttonBlack}>Crear cuenta</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <h1>Para continuar inicia sesión</h1>
        <div className={styles.buttons}>
          <Link href="/login" className={styles.button}>Iniciar sesión</Link>
          <Link href="/signup" className={styles.buttonBlack}>Crear cuenta</Link>
        </div>
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