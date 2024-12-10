'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [filteredCursos, setFilteredCursos] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCareer, setSelectedCareer] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const nombremateria = searchParams.get('nombremateria'); // Obtener "nombremateria" desde la URL
  
  useEffect(() => {
    const fetchCursos = async () => {
      if (!nombremateria) return; // Si no hay "nombremateria", no hacer la solicitud

      try {
        const response = await fetch(`/api/cursos?curso=${nombremateria}`, {
          method: 'GET'
        });
        const data = await response.json();

        setCursos(data);
        setFilteredCursos(data); // Inicializar los cursos filtrados con todos
      } catch (error) {
        console.error("Error fetching cursos:", error);
      }
      
    };

    fetchCursos();
  }, [nombremateria]);

  const handleCursoClick = (nombrecurso) => {

    //router.push(`/permisos?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
    checkPermissions(nombremateria,nombrecurso);
  };

  const handleApplyFilters = () => {
    const filtered = cursos.filter((curso) => {
      // No se porque pero selectedYear esta en string y curso.anio en int, selectedYear no se puede cambiar por ser constante, por lo tanto se cambia el otro
      curso.anio = String(curso.anio);
      const matchesYear = selectedYear ? curso.anio === selectedYear : true;
      const matchesCareer = selectedCareer ? curso.carrera === selectedCareer : true;

      //console.log("selectedYear:", selectedYear);
      //console.log("curso.anio:", curso.anio);

      //console.log("\nmatchesCareer:", selectedCareer);
      //console.log("curso.carrera:", curso.carrera);

      return matchesYear && matchesCareer;
    });
    setFilteredCursos(filtered);
  };
  const checkPermissions = async (nombremateria, nombrecurso) => {
    //const router = useRouter();
    const token = localStorage.getItem('token'); // Supongamos que el token está en localStorage

    try {
        const response = await fetch(`/api/redireccion?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.redirected) {
            // Redirige al usuario si el backend lo solicita
            window.location.href = response.url;
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }
    } catch (err) {
        console.error('Error al verificar permisos:', err);
    }
};
  // Obtener valores únicos para los filtros
  
  const years = [...new Set(cursos.map((curso) => curso.anio))].sort();
  const careers = [...new Set(cursos.map((curso) => curso.carrera))];

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

      <div style={styles.content}>
        {/* Barra lateral */}
        <aside style={styles.sidebar}>
          <h3>Filtros</h3>
          <div>
            <label htmlFor="yearFilter">Año</label>
            <select
              id="yearFilter"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Todos</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="careerFilter">Carrera</label>
            <select
              id="careerFilter"
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
            >
              <option value="">Todas</option>
              {careers.map((career) => (
                <option key={career} value={career}>
                  {career}
                </option>
              ))}
            </select>
          </div>
          <button style={styles.filterButton} onClick={handleApplyFilters}>
            Aplicar Filtros
          </button>
        </aside>

        {/* Contenido principal */}
        <main style={styles.main}>
          <h2 style={styles.title}>Cursos de {nombremateria}</h2>
          <section style={styles.section}>
            <h3 style={styles.subtitle}>Cursos disponibles en {nombremateria}</h3>
            <div style={styles.grid}>
              {filteredCursos.map((curso) => (
                <div key={curso.nombrecurso} style={styles.card}>
                  <div style={styles.imagePlaceholder}></div>
                  <p style={styles.cardText}>{curso.nombrecurso}</p>
                  <p style={styles.cardText}>{curso.anio}</p>
                  <p style={styles.cardText}>{curso.carrera}</p>
                  <button
                    style={styles.button}
                    onClick={() => handleCursoClick(curso.nombrecurso)}
                  >
                    Ir a {curso.nombrecurso}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Cursos;

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif'
  },
  content: {
    display: 'flex'
  },
  sidebar: {
    width: '250px',
    padding: '20px',
    background: '#f0f0f0',
    borderRight: '1px solid #ddd'
  },
  filterButton: {
    marginTop: '10px',
    padding: '10px',
    background: '#0070f3',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  main: {
    flex: 1,
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
  }
};
