import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Modal.css';

function Personnel() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nom_pers: '',
    pren_pers: '',
    IM_pers: '',
    poste_pers: '',
    indice_pers: '',
    email_pers: '',
    tel_pers: '',
    date_embauche: ''
  });
  const [errors, setErrors] = useState({});
  const [personnelData, setPersonnelData] = useState([]);
  const [modifyId, setModifyId] = useState(null); // State to hold the ID of personnel to modify
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(data => {
        setPersonnelData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleModifyClick = (id) => {
    const personnelToModify = personnelData.find(person => person.id_pers === id);
    if (personnelToModify) {
      setFormData({ ...personnelToModify });
      setModifyId(id);
      setShowModal(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce personnel ?')) {
      fetch(`http://localhost:3000/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(() => {
          const updatedPersonnel = personnelData.filter(person => person.id_pers !== id);
          setPersonnelData(updatedPersonnel);
        })
        .catch(error => {
          console.error('Error deleting personnel:', error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nom_pers: '',
      pren_pers: '',
      IM_pers: '',
      poste_pers: '',
      indice_pers: '',
      email_pers: '',
      tel_pers: '',
      date_embauche: ''
    });
    setModifyId(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (!formData[key]) {
        newErrors[key] = 'Ce champ est obligatoire';
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const url = modifyId ? `http://localhost:3000/${modifyId}` : 'http://localhost:3000/';
      const method = modifyId ? 'PUT' : 'POST';

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => response.json())
        .then(data => {
          if (modifyId) {
            const updatedPersonnel = personnelData.map(person => {
              if (person.id_pers === modifyId) {
                return data; // Update the modified personnel
              }
              return person;
            });
            setPersonnelData(updatedPersonnel);
          } else {
            setPersonnelData([...personnelData, data]);
          }
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setErrors(newErrors);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPersonnel = personnelData.filter(person =>
    person.nom_pers.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Personnels</h3>
      </div>
      <div className='bottom-button'>
        <input
          type="search"
          id="recher"
          placeholder="Rechercher par nom"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleAddClick}>Ajouter</button>
      </div>
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>{modifyId ? 'Modifier Personnel' : 'Ajouter un Personnel'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom:</label>
            <input type='text' name='nom_pers' value={formData.nom_pers} onChange={handleChange} />
            {errors.nom_pers && <p className="error">{errors.nom_pers}</p>}
          </div>
          <div className="form-group">
            <label>Prénom(s):</label>
            <input type='text' name='pren_pers' value={formData.pren_pers} onChange={handleChange} />
            {errors.pren_pers && <p className="error">{errors.pren_pers}</p>}
          </div>
          <div className="form-group">
            <label>IM:</label>
            <input type='text' name='IM_pers' value={formData.IM_pers} onChange={handleChange} />
            {errors.IM_pers && <p className="error">{errors.IM_pers}</p>}
          </div>
          <div className="form-group">
            <label>Poste:</label>
            <input type='text' name='poste_pers' value={formData.poste_pers} onChange={handleChange} />
            {errors.poste_pers && <p className="error">{errors.poste_pers}</p>}
          </div>
          <div className="form-group">
            <label>Salaire:</label>
            <input type='number' name='indice_pers' value={formData.indice_pers} onChange={handleChange} />
            {errors.indice_pers && <p className="error">{errors.indice_pers}</p>}
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type='email' name='email_pers' value={formData.email_pers} onChange={handleChange} />
            {errors.email_pers && <p className="error">{errors.email_pers}</p>}
          </div>
          <div className="form-group">
            <label>Téléphone:</label>
            <input type='text' name='tel_pers' value={formData.tel_pers} onChange={handleChange} />
            {errors.tel_pers && <p className="error">{errors.tel_pers}</p>}
          </div>
          <div className="form-group">
            <label>Date d'embauche:</label>
            <input type='date' name='date_embauche' value={formData.date_embauche} onChange={handleChange} />
            {errors.date_embauche && <p className="error">{errors.date_embauche}</p>}
          </div>
          <div className="form-actions">
            <button type='submit'>{modifyId ? 'Modifier' : 'Enregistrer'}</button>
            <button type='button' onClick={handleCloseModal}>Annuler</button>
          </div>
        </form>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom(s)</th>
            <th>IM</th>
            <th>Poste</th>
            <th>Indice</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Date d'embauche</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPersonnel.map(person => (
            <tr key={person.id_pers}>
              <td>{person.id_pers}</td>
              <td>{person.nom_pers}</td>
              <td>{person.pren_pers}</td>
              <td>{person.IM_pers}</td>
              <td>{person.poste_pers}</td>
              <td>{person.indice_pers}</td>
              <td>{person.email_pers}</td>
              <td>{person.tel_pers}</td>
              <td>{person.date_embauche}</td>
              <td className='bottom-button1'>
                <button onClick={() => handleModifyClick(person.id_pers)}>Modifier</button>
                <button onClick={() => handleDeleteClick(person.id_pers)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Personnel;
