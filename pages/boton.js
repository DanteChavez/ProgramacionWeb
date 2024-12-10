'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const Material = () => {
  const [materiales, setMateriales] = useState([]);
  const [filteredMateriales, setFilteredMateriales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [dates, setDates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    fecha: '',
    tipo: '',
    descripcion: '',
    categoria: '',
    archivo: null,
  });

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
        const materialesAprobados = data.filter(item => item.material.aprovado === true);

        setMateriales(materialesAprobados);
        setFilteredMateriales(materialesAprobados);

        const uniqueCategories = [...new Set(materialesAprobados.map(item => item.material.categoria))];
        const uniqueDates = [...new Set(materialesAprobados.map(item => item.material.fecha))].sort();

        setCategories(uniqueCategories);
        setDates(uniqueDates);
      } catch (error) {
        console.error("Error fetching materiales:", error);
      }
    };

    fetchMateriales();
  }, [nombremateria, nombrecurso]);

  const applyFilters = () => {
    let filtered = [...materiales];

    if (selectedCategory) {
      filtered = filtered.filter(item => item.material.categoria === selectedCategory);
    }

    if (selectedDate) {
      filtered = filtered.filter(item => item.material.fecha === selectedDate);
    }

    setFilteredMateriales(filtered);
  };

  const handleMaterialClick = (ruta, nombrematerial) => {
    const link = document.createElement('a');
    link.href = ruta;
    link.download = nombrematerial;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async () => {
    if (!formData.archivo) {
      alert('Debe seleccionar un archivo para subir.');
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataObj.append(key, value);
    });

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
      });

      if (response.ok) {
        alert('Archivo subido exitosamente.');
        setShowModal(false);
        setFormData({
          nombre: '',
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
        {/* Código del header */}
      </header>
      <main style={styles.main}>
        <h2 style={styles.title}>Materiales del curso {nombrecurso} en {nombremateria}</h2>
        <button style={styles.uploadButton} onClick={() => setShowModal(true)}>
          Subir Archivo
        </button>
        <section style={styles.section}>
          {/* Código de filtros */}
        </section>

        {showModal && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h3>Subir archivos a este curso</h3>
              <p style={{ color: 'red' }}>Debe estar logeado para subir archivos</p>
              <form style={styles.form}>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del archivo"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="tipo"
                  placeholder="Tipo"
                  value={formData.tipo}
                  onChange={handleInputChange}
                />
                <textarea
                  name="descripcion"
                  placeholder="Descripción"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                />
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleInputChange}
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="certamen">Certamen</option>
                  <option value="control">Control</option>
                  <option value="apunte">Apunte</option>
                </select>
                <input
                  type="file"
                  name="archivo"
                  onChange={handleInputChange}
                />
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
  uploadButton: {
    position: 'absolute',
    right: '20px',
    top: '20px',
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
