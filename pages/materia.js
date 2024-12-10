// pages/materias.js

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

const Materias = () => {
  const [materias, setMaterias] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await fetch('/api/materias', {
          method: 'GET'
        });
        const data = await response.json();
        setMaterias(data);
      } catch (error) {
        console.error("Error fetching materias:", error);
      }
    };

    fetchMaterias();
  }, []);

  const handleButtonClick = (name) => {
    router.push(`/cursos?nombremateria=${name}`);
  };

  return (
    <div style={styles.container}>
      <header className={styles.header}>
        <a href="/">
          <Image
            src="/logo.png"
            alt="Descripción de la imagen"
            width={100}
            height={50}
          />
        </a>
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
      <main style={styles.main}>
        <h2 style={styles.title}>Materias</h2>
        <section style={styles.section}>
          <h3 style={styles.subtitle}>Materias disponibles</h3>
          <div style={styles.grid}>
            {materias.map(materia => (
              <div key={materia.nombremateria} style={styles.card}>
                <div style={styles.imagePlaceholder}></div>
                <p style={styles.cardText}>{materia.nombremateria}</p>
                <button style={styles.button} onClick={() => handleButtonClick(materia.nombremateria)}>
                  Go to {materia.nombremateria}
                </button>
              </div>
            ))}
          </div>
        </section>
        <footer style={styles.footer}>
          <p>← Previous</p>
          <p style={styles.pageNumber}>1</p>
          <p>2</p>
          <p>3</p>
          <p>...</p>
          <p>67</p>
          <p>68</p>
          <p>Next →</p>
        </footer>
      </main>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    backgroundColor: '#fff',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  logo: {
    fontSize: '18px',
    color: '#333'
  },
  nav: {
    display: 'flex',
    alignItems: 'center'
  },
  navLink: {
    margin: '0 10px',
    textDecoration: 'none',
    color: '#333'
  },
  button: {
    marginTop: '10px',
    padding: '5px 10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  main: {
    padding: '20px',
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: '36px',
    textAlign: 'center',
    margin: '20px 0'
  },
  section: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  subtitle: {
    fontSize: '20px',
    marginBottom: '20px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  imagePlaceholder: {
    width: '100%',
    paddingBottom: '75%',
    backgroundColor: '#e0e0e0',
    borderRadius: '8px'
  },
  cardText: {
    marginTop: '10px'
  },
  footer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '20px',
    gap: '10px',
    fontSize: '16px'
  },
  pageNumber: {
    fontWeight: 'bold'
  }
};

export default Materias;