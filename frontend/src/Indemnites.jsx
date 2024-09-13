import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Modal.css';

function Indemnites() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    id_pers: '',
    id_resp: '',
    type: '',
    montant: '',
    date_attr: '',
    cause: ''
  });
  const [errors, setErrors] = useState({});
  const [indemnitesData, setIndemnitesData] = useState([]);
  const [personnelOptions, setPersonnelOptions] = useState([]);
  const [responsableOptions, setResponsableOptions] = useState([]);
  const [modifyId, setModifyId] = useState(null);
  const [searchType, setSearchType] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/indemnites')
      .then(response => response.json())
      .then(data => {
        setIndemnitesData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    fetch('http://localhost:3000/personnels')
      .then(response => response.json())
      .then(data => {
        setPersonnelOptions(data);
      })
      .catch(error => {
        console.error('Error fetching personnel data:', error);
      });

    fetch('http://localhost:3000/responsables')
      .then(response => response.json())
      .then(data => {
        setResponsableOptions(data);
      })
      .catch(error => {
        console.error('Error fetching responsable data:', error);
      });
  }, []);

  const handleAddClick = () => {
    setShowModal(true);
  };

  const handleModifyClick = (id) => {
    const indemnitesToModify = indemnitesData.find(indemnity => indemnity.id_ind === id);
    if (indemnitesToModify) {
      setFormData({ ...indemnitesToModify });
      setModifyId(id);
      setShowModal(true);
    }
  };

  const handleDeleteClick = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette indemnité ?')) {
      fetch(`http://localhost:3000/indemnites/${id}`, {
        method: 'DELETE'
      })
        .then(response => response.json())
        .then(() => {
          const updatedIndemnites = indemnitesData.filter(indemnity => indemnity.id_ind !== id);
          setIndemnitesData(updatedIndemnites);
        })
        .catch(error => {
          console.error('Error deleting indemnité:', error);
        });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      id_pers: '',
      id_resp: '',
      type: '',
      montant: '',
      date_attr: '',
      cause: ''
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
      const url = modifyId ? `http://localhost:3000/indemnites/${modifyId}` : 'http://localhost:3000/indemnites';
      const method = modifyId ? 'PUT' : 'POST';

      // Extract the fields that belong to indemnite
      const { id_pers, id_resp, type, montant, date_attr, cause } = formData;
      const bodyData = { id_pers, id_resp, type, montant, date_attr, cause };

      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      })
        .then(response => response.json())
        .then(data => {
          if (modifyId) {
            const updatedIndemnites = indemnitesData.map(indemnity => {
              if (indemnity.id_ind === modifyId) {
                return data;
              }
              return indemnity;
            });
            setIndemnitesData(updatedIndemnites);
          } else {
            setIndemnitesData([...indemnitesData, data]);
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
    setSearchType(e.target.value);
    fetchIndemnitesByType(e.target.value);
  };

  const fetchIndemnitesByType = (type) => {
    fetch(`http://localhost:3000/indemnites/type/${type}`)
      .then(response => response.json())
      .then(data => {
        setIndemnitesData(data);
      })
      .catch(error => {
        console.error('Error fetching indemnities by type:', error);
      });
  };

  const filteredIndemnites = indemnitesData.filter(indemnity =>
    indemnity.type.toLowerCase().includes(searchType.toLowerCase())
  );

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Indemnités</h3>
      </div>

      <div className='bottom-button'>
        <input
          type="search"
          id="recher"
          placeholder="Rechercher par type"
          value={searchType}
          onChange={handleSearchChange}
        />
        <button onClick={handleAddClick}>Ajouter</button>
      </div>
      
      <Modal show={showModal} onClose={handleCloseModal}>
        <h2>{modifyId ? 'Modifier Indemnité' : 'Ajouter une Indemnité'}</h2>
        <form className="modal-form" onSubmit={handleSubmit}>
        <div className="form-group">
            <label>ID du Personnel:</label>
            <select name='id_pers' value={formData.id_pers} onChange={handleChange}>
              <option value=''>Sélectionner</option>
              {personnelOptions.map(option => (
                <option key={option.id_pers} value={option.id_pers}>
                  {option.id_pers}
                </option>
              ))}
            </select>
            {errors.id_pers && <p className="error">{errors.id_pers}</p>}
          </div>
          <div className="form-group">
            <label>ID du Responsable:</label>
            <select name='id_resp' value={formData.id_resp} onChange={handleChange}>
              <option value=''>Sélectionner</option>
              {responsableOptions.map(option => (
                <option key={option.id_resp} value={option.id_resp}>
                  {option.id_resp}
                </option>
              ))}
            </select>
            {errors.id_resp && <p className="error">{errors.id_resp}</p>}
          </div>
          <div className="form-group">
            <label>Type:</label>
            <select name='type' value={formData.type} onChange={handleChange}>
              <option value=''>Sélectionner</option>
              <option value='licenciement'>Licenciement</option>
              <option value='logement'>Logement</option>
              <option value='déplacement'>Déplacement</option>
              <option value='ancienneté'>Ancienneté</option>
            </select>
            {errors.type && <p className="error">{errors.type}</p>}
          </div>
          <div className="form-group">
            <label>Montant:</label>
            <input type='number' name='montant' value={formData.montant} onChange={handleChange} />
            {errors.montant && <p className="error">{errors.montant}</p>}
          </div>
          <div className="form-group">
            <label>Date d'Attribution:</label>
            <input type='date' name='date_attr' value={formData.date_attr} onChange={handleChange} />
            {errors.date_attr && <p className="error">{errors.date_attr}</p>}
          </div>
          <div className="form-group">
            <label>Cause:</label>
            <select name='cause' value={formData.cause} onChange={handleChange}>
              <option value=''>Sélectionner</option>
              <option value='mission'>Mission</option>
              <option value='date embauche plus de 5ans'>Date d'embauche plus de 5 ans</option>
              <option value='licencement avant fin de contrat'>Licencement avant fin de contrat</option>
            </select>
            {errors.cause && <p className="error">{errors.cause}</p>}
          </div>
          <div className="form-actions">
            <button type='submit'>{modifyId ? 'Modifier' : 'Ajouter'}</button>
            <button type='button' onClick={handleCloseModal}>Annuler</button>
          </div>
        </form>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>ID Indemnité</th>
            <th>ID Personnel</th>
            <th>Type</th>
            <th>Montant</th>
            <th>Date d'Attribution</th>
            <th>Cause</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredIndemnites.map(indemnity => (
            <tr key={indemnity.id_ind}>
              <td>{indemnity.id_ind}</td>
              <td>{indemnity.id_pers}</td>
              <td>{indemnity.type}</td>
              <td>{indemnity.montant}</td>
              <td>{indemnity.date_attr}</td>
              <td>{indemnity.cause}</td>
              <td className='bottom-button1'>
                <button onClick={() => handleModifyClick(indemnity.id_ind)}>Modifier</button>
                <button onClick={() => handleDeleteClick(indemnity.id_ind)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

export default Indemnites;
