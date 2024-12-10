'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Material = () => {
  const [materiales, setMateriales] = useState([]);
  const [materialesPorAprobar, setMaterialesPorAprobar] = useState([]);
  const [filteredMateriales, setFilteredMateriales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const searchParams = useSearchParams();
  const nombremateria = searchParams.get('nombremateria');
  const nombrecurso = searchParams.get('nombrecurso');

  const fetchMateriales = async () => {
    if (!nombremateria || !nombrecurso) return;
    try {
      const response = await fetch(`/api/materiales?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`);
      const data = await response.json();
      const aprobados = data.filter((item) => item.material.aprovado === true);
      const porAprobar = data.filter((item) => item.material.aprovado === false);

      setMateriales(aprobados);
      setMaterialesPorAprobar(porAprobar);
      setFilteredMateriales(aprobados);

      const uniqueCategories = [...new Set(data.map((item) => item.material.categoria))];
      const uniqueDates = [...new Set(data.map((item) => item.material.fecha))].sort();

      setCategories(uniqueCategories);
      setDates(uniqueDates);
    } catch (error) {
      console.error('Error fetching materiales:', error);
    }
  };

  useEffect(() => {
    fetchMateriales();
  }, [nombremateria, nombrecurso]);

  const handleAprobar = async (ruta) => {
    try {
      const response = await fetch(`/api/aprobar`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruta }),
      });
      if (response.ok) {
        alert('Material aprobado con éxito.');
        fetchMateriales();
      } else {
        alert('Error al aprobar material.');
      }
    } catch (error) {
      console.error('Error al aprobar material:', error);
    }
  };

  const handleBorrar = async (ruta) => {
    try {
      const response = await fetch(`/api/borrar`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruta }),
      });
      if (response.ok) {
        alert('Material eliminado con éxito.');
        fetchMateriales();
      } else {
        alert('Error al borrar material.');
      }
    } catch (error) {
      console.error('Error al borrar material:', error);
    }
  };

  const handleDescargar = async (ruta, nombrematerial) => {
    try {
      const response = await fetch(`/api/descargar?materialId=${ruta}`);
      const data = await response.json();
      if (data.success) {
        const link = document.createElement('a');
        link.href = data.downloadUrl;
        link.download = nombrematerial;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Error al descargar material.');
      }
    } catch (error) {
      console.error('Error al descargar material:', error);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
      <a href="/">
        <Image
          src="/logo.png"
          alt="Descripción de la imagen"
          width={100}
          height={50}
        />
      </a>
        <nav style={styles.nav}>
          <Link href="#">Materiales</Link>
          <Link href="#">Cursos</Link>
          <Link href="#">Materias</Link>
          <Link href="#">Sobre nosotros</Link>
          <Link href="#">Contactanos</Link>
          <Link href="#">Cuenta</Link>
          <Link href="/login" style={styles.button}>
            Iniciar sesión
          </Link>
          <Link href="/signup" style={styles.buttonBlack}>
            Crear cuenta
          </Link>
        </nav>
      </header>
      <main style={styles.main}>
        <h2 style={styles.title}>
          Materiales del curso {nombrecurso} en {nombremateria}
        </h2>
        <h3>Materiales por Aprobar</h3>
        <div style={styles.grid}>
          {materialesPorAprobar.map((item, index) => (
            <div key={index} style={styles.card}>
              <p>Nombre: {item.material.nombrematerial}</p>
              <p>Descripción: {item.material.descripcion}</p>
              <button onClick={() => handleDescargar(item.material.ruta, item.material.nombrematerial)}>
                Descargar
              </button>
              <button onClick={() => handleAprobar(item.material.ruta)}>
                Aprobar
              </button>
              <button onClick={() => handleBorrar(item.material.ruta)}>
                Borrar
              </button>
            </div>
          ))}
        </div>
        <h3>Materiales Aprobados</h3>
        <div style={styles.grid}>
          {filteredMateriales.map((item, index) => (
            <div key={index} style={styles.card}>
              <p>Nombre: {item.material.nombrematerial}</p>
              <p>Descripción: {item.material.descripcion}</p>
              <button onClick={() => handleDescargar(item.material.ruta, item.material.nombrematerial)}>
                Descargar
              </button>
            </div>
          ))}
        </div>
        <div>
          
        </div>
      </main>
    </div>
  );
};

export default Material;





const styles = {

  filters: {
    display: 'flex',
    justifyContent: 'space-between', // Espaciado entre las dos secciones
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
  },
  filterGroup: {
    display: 'flex',
    gap: '10px', // Espacio entre los select y el botón "Aplicar filtros"
  },
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
  },
  uploadButton: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    width: '400px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
};

