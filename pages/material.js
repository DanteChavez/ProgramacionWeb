'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const Material = () => {
  const [materiales, setMateriales] = useState([]);
  const searchParams = useSearchParams();
  const nombremateria = searchParams.get('nombremateria');
  const nombrecurso = searchParams.get('nombrecurso');

  useEffect(() => {
    const fetchMateriales = async () => {
      if (!nombremateria || !nombrecurso) return;

      try {
        const response = await fetch(`/api/materiales?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`, {
          method: 'GET'
        });
        const data = await response.json();

        // Filtrar materiales aprobados
        const materialesAprobados = data.filter(item => item.material.aprovado === true);
        setMateriales(materialesAprobados);
      } catch (error) {
        console.error("Error fetching materiales:", error);
      }
    };

    fetchMateriales();
  }, [nombremateria, nombrecurso]);

  const handleMaterialClick = (nombrematerial) => {
    alert(`Descargando material: ${nombrematerial}`);
    // Aquí podrías implementar la lógica de descarga
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Logo</h1>
        <nav style={styles.nav}>
          {['Products', 'Solutions', 'Community', 'Resources', 'Pricing', 'Contact'].map(item => (
            <a key={item} href="#" style={styles.navLink}>{item}</a>
          ))}
          <button style={styles.button}>Sign in</button>
          <button style={styles.button}>Register</button>
        </nav>
      </header>
      <main style={styles.main}>
        <h2 style={styles.title}>Materiales del curso {nombrecurso} en {nombremateria}</h2>
        <section style={styles.section}>
          <h3 style={styles.subtitle}>Materiales disponibles</h3>
          <div style={styles.grid}>
            {materiales.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.imagePlaceholder}></div>
                <p style={styles.cardText}>Nombre: {item.material.nombrematerial}</p>
                <p style={styles.cardText}>Fecha: {item.material.fecha}</p>
                <p style={styles.cardText}>Descripción: {item.material.descripcion}</p>
                <button style={styles.button} onClick={() => handleMaterialClick(item.material.nombrematerial)}>
                  Descargar {item.material.nombrematerial}
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

export default Material;



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
