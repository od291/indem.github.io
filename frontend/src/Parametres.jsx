import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './Modal.css';

function Parametres() {
  const [responsables, setResponsables] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const [formData, setFormData] = useState({
    nom_resp: '',
    nom_user: '',
    email_resp: '',
    tel_resp: '',
    image: null
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [modifyId, setModifyId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/parametres')
      .then(response => response.json())
      .then(data => {
        setResponsables(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleModifyClick = (id) => {
    const responsableToModify = responsables.find(resp => resp.id_resp === id);
    if (responsableToModify) {
      setFormData({ ...responsableToModify });
      setModifyId(id);
      setShowModal(true);
    }
  };

  const handlePasswordClick = () => {
    setPasswordModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      nom_resp: '',
      nom_user: '',
      email_resp: '',
      tel_resp: '',
      image: null
    });
    setModifyId(null);
    setErrors({});
  };

  const handleClosePasswordModal = () => {
    setPasswordModal(false);
    setPasswordData({
      oldPassword: '',
      newPassword: ''
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
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

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Ce champ est obligatoire';
    }
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'Ce champ est obligatoire';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length === 0) {
      const url = modifyId ? `http://localhost:3000/responsables/${modifyId}` : 'http://localhost:3000/responsables';
      const method = modifyId ? 'PUT' : 'POST';

      const formDataToSend = new FormData();
      formDataToSend.append('nom_resp', formData.nom_resp);
      formDataToSend.append('nom_user', formData.nom_user);
      formDataToSend.append('email_resp', formData.email_resp);
      formDataToSend.append('tel_resp', formData.tel_resp);
      formDataToSend.append('image', formData.image);

      fetch(url, {
        method: method,
        body: formDataToSend
      })
        .then(response => response.json())
        .then(data => {
          if (modifyId) {
            const updatedResponsables = responsables.map(resp => {
              if (resp.id_resp === modifyId) {
                return data;
              }
              return resp;
            });
            setResponsables(updatedResponsables);
            window.location.reload();

          } else {
            setResponsables([...responsables, data]);
            window.location.reload();

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

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const newErrors = validatePasswordForm();
    if (Object.keys(newErrors).length === 0) {
      const url = 'http://localhost:3000/password'; // Endpoint à définir dans votre backend
      const passwordPayload = {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      };

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordPayload)
      })
        .then(response => response.json())
        .then(data => {
          alert(data.message); // Affichez un message de succès ou d'erreur selon la réponse
          handleClosePasswordModal();
        })
        .catch(error => {
          console.error('Error:', error);
        });
    } else {
      setErrors(newErrors);
    }
  };

  
  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Paramètres</h3>
      </div>

      <div className='section-title'>
        <h4>Informations Générales</h4>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Nom d'utilisateur</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {responsables.map(resp => (
            <tr key={resp.id_resp}>
              <td>{resp.id_resp}</td>
              <td>{resp.nom_resp}</td>
              <td>{resp.nom_user}</td>
              <td>{resp.email_resp}</td>
              <td>{resp.tel_resp}</td>
              <td>
                <button onClick={() => handleModifyClick(resp.id_resp)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className='section-title'>
        <h4>Informations sur le Mot de Passe</h4>
      </div>

      <div className='password-section'>
        <span>********</span>
        <button onClick={handlePasswordClick}>Modifier</button>
      </div>


      <Modal show={showModal} onClose={handleCloseModal}>
  <h2>{modifyId ? 'Modifier Responsable' : 'Ajouter un Responsable'}</h2>
  <form className="modal-form" onSubmit={handleSubmit}>
    <div className="form-group">
      <label>Nom:</label>
      <input type='text' name='nom_resp' value={formData.nom_resp} onChange={handleChange} />
      {errors.nom_resp && <span className="error">{errors.nom_resp}</span>}
    </div>
    <div className="form-group">
      <label>Nom d'utilisateur:</label>
      <input type='text' name='nom_user' value={formData.nom_user} onChange={handleChange} />
      {errors.nom_user && <span className="error">{errors.nom_user}</span>}
    </div>
    <div className="form-group">
      <label>Email:</label>
      <input type='email' name='email_resp' value={formData.email_resp} onChange={handleChange} />
      {errors.email_resp && <span className="error">{errors.email_resp}</span>}
    </div>
    <div className="form-group">
      <label>Téléphone:</label>
      <input type='text' name='tel_resp' value={formData.tel_resp} onChange={handleChange} />
      {errors.tel_resp && <span className="error">{errors.tel_resp}</span>}
    </div>
    <div className="form-group">
  <label>Image:</label>
  <input type='file' name='image' onChange={handleChange} />
  {formData.image ? (
    <span className="no-file-selected">{formData.image.name}</span>
  ) : (
    <span  className="no-file-selected">Aucun fichier sélectionné</span>
  )}
  {errors.image && <span className="error">{errors.image}</span>}
</div>

    <button type="submit">{modifyId ? 'Modifier' : 'Ajouter'}</button>
  </form>
</Modal>


      <Modal show={passwordModal} onClose={handleClosePasswordModal}>
        <h2>Modifier le Mot de Passe</h2>
        <form className="modal-form" onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>Ancien Mot de Passe:</label>
            <input type='password' name='oldPassword' value={passwordData.oldPassword} onChange={handlePasswordChange} />
            {errors.oldPassword && <span className="error">{errors.oldPassword}</span>}
          </div>
          <div className="form-group">
            <label>Nouveau Mot de Passe:</label>
            <input type='password' name='newPassword' value={passwordData.newPassword} onChange={handlePasswordChange} />
            {errors.newPassword && <span className="error">{errors.newPassword}</span>}
          </div>
          <button type="submit">Modifier le Mot de Passe</button>
        </form>
      </Modal>
    </main>
  );
}

export default Parametres;
