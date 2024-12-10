'use client';


import Link from 'next/link';
import Image from 'next/image';

import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
      <Image
        src="/logo.png" // Asegúrate de que la imagen esté en la carpeta public
        alt="Descripción de la imagen"
        width={100} // Ancho en píxeles
        height={50} // Alto en píxeles
      />
        <div className={styles.logo}>Plataforma de Recursos Intercambiables</div>
        <nav className={styles.nav}>
          <Link href="#">Materiales</Link>
          <Link href="#">Cursos</Link>
          <Link href="#">Materias</Link>
          <Link href="#">Sobre nosotros</Link>
          <Link href="#">Contactanos</Link>
          <Link href="#">Cuenta</Link>
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