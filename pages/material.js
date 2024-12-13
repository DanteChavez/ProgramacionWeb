'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';

const Material = () => {
  const [materiales, setMateriales] = useState([]);
  const [filteredMateriales, setFilteredMateriales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  /*
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    tipo: '',
    descripcion: '',
    categoria: '',
    archivo: null,
  });*/

  const searchParams = useSearchParams();
  const nombremateria = searchParams.get('nombremateria');
  const nombrecurso = searchParams.get('nombrecurso');

  const [formData, setFormData] = useState({
    nombrematerial: '',
    fecha: '',
    descripcion: '',
    tipo: 'pdf',
    categoria: '',
    archivo: null,
    nombremateria: '', // Se inicializa vacío
    nombrecurso: '',   // Se inicializa vacío
});


  useEffect(() => {
    // para que se actualize constantemente
    const nombremateria = searchParams.get('nombremateria') || ''; // Recupera el valor o usa vacío
    const nombrecurso = searchParams.get('nombrecurso') || ''; // Recupera el valor o usa vacío

    setFormData(prev => ({
      ...prev,
      nombremateria,
      nombrecurso,
  }));

    const fetchMateriales = async () => {
      if (!nombremateria || !nombrecurso) return;

      try {
        const response = await fetch(`/api/materiales?nombremateria=${nombremateria}&nombrecurso=${nombrecurso}`, {
          method: 'GET',
        });
        const data = await response.json();
        const materialesAprobados = data.filter((item) => item.material.aprovado === true);

        setMateriales(materialesAprobados);
        setFilteredMateriales(materialesAprobados);

        const uniqueCategories = [...new Set(materialesAprobados.map((item) => item.material.categoria))];
        const uniqueDates = [...new Set(materialesAprobados.map((item) => item.material.fecha))].sort();

        setCategories(uniqueCategories);
        setDates(uniqueDates);
      } catch (error) {
        console.error('Error fetching materiales:', error);
      }
    };

    fetchMateriales();
  }, [nombremateria, nombrecurso], searchParams);

  const applyFilters = () => {
    let filtered = [...materiales];

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.material.categoria === selectedCategory);
    }

    if (selectedDate) {
      filtered = filtered.filter((item) => item.material.fecha === selectedDate);
    }

    setFilteredMateriales(filtered);
  };

  const handleMaterialClick = async (materialId, nombrematerial) => {
    console.log("materialId: \n", materialId);
  
    try {
      // Hacer una solicitud al backend para obtener la URL de descarga
      const response = await fetch(`/api/descargar?materialId=${materialId}`);
      const data = await response.json();
  
      if (data.success) {
        const downloadUrl = data.downloadUrl; // URL proporcionada por la API
  
        // Crear un enlace y simular el clic para iniciar la descarga
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = nombrematerial; // El nombre del archivo que se descargará
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('No se pudo obtener la URL de descarga.');
      }
    } catch (error) {
      console.error('Error al obtener la URL de descarga:', error);
    }
  };
  
  
  /*
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };*/
  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
        ...prevData,
        [name]: files ? files[0] : value, // Si el campo es de tipo archivo, usa `files[0]`
    }));
};

  const handleSubmit = async () => {
    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
  });

  


    if (!formData.archivo ) {
      alert('Debe seleccionar un archivo para subir.');
      return;
    } else if (localStorage.getItem('token') == null) {
      alert('Debe estar logeado para subir archivos');
      return;
    }

    formDataObj.append('token',  localStorage.getItem('token'));
    try {

      const response = await fetch('/api/agregar', {
        method: 'POST',
        body: formDataObj,
    });
      

      if (response.ok) {
        alert('Archivo subido exitosamente.');
        setShowModal(false);
        setFormData({
          nombrematerial: '',
          fecha: '',
          tipo: '',
          descripcion: '',
          categoria: '',
          archivo: null,
        });
      } else {
        alert('Error al subir el archivo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir el archivo.');
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
        
        <section style={styles.section}>
          <h3 style={styles.subtitle}>Filtrar materiales</h3>
          <div style={styles.filters}>
  <div style={styles.filterGroup}>
    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
      <option value="">Todas las categorías</option>
      {categories.map((category, index) => (
        <option key={index} value={category}>
          {category}
        </option>
      ))}
    </select>
    <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
      <option value="">Todas las fechas</option>
      {dates.map((date, index) => (
        <option key={index} value={date}>
          {date}
        </option>
      ))}
    </select>
    <button style={styles.button} onClick={applyFilters}>
      Aplicar filtros
    </button>
  </div>
  <button style={styles.uploadButton} onClick={() => setShowModal(true)}>
    Subir Archivo
  </button>
</div>

          <div style={styles.grid}>
            {filteredMateriales.map((item, index) => (
              <div key={index} style={styles.card}>
                <div style={styles.imagePlaceholder}></div>
                <p style={styles.cardText}>Nombre: {item.material.nombrematerial}</p>
                <p style={styles.cardText}>Fecha: {item.material.fecha}</p>
                <p style={styles.cardText}>Categoría: {item.material.categoria}</p>
                <p style={styles.cardText}>Descripción: {item.material.descripcion}</p>
                <button
                  style={styles.button}
                  onClick={() => handleMaterialClick(item.material.ruta, item.material.nombrematerial)}
                >
                  Descargar {item.material.nombrematerial}
                </button>
              </div>
            ))}
          </div>
        </section>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Subir archivo</h3>
              <text>DEBE INICIAR SESION PARA SUBIR ARCHIVOS</text>
              <h1></h1>
              <form style={styles.form}>
                <input type="text" name="nombrematerial" placeholder="Nombre" value={formData.nombrematerial} onChange={handleInputChange} />
                
                <select 
                  name="fecha" 
                  value={formData.fecha} 
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona un año</option>
                  {Array.from({ length: 16 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleInputChange} />
                <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                  <option value="">Selecciona una categoría</option>
                  <option value="certamen">certamen</option>
                  <option value="control">control</option>
                  <option value="apunte">apuntes</option>
                </select>
                <input type="file" name="archivo" onChange={handleInputChange} />
                <button type="button" onClick={handleSubmit}>
                  Subir
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Material;

const styles = {
  // Otros estilos...
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

