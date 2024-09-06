import React, { useState } from 'react';
import axios from 'axios';
import './Register.css';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    nom_resp: '',
    nom_user: '',
    email_resp: '',
    tel_resp: '',
    mdp: '',
    image: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error message when user starts typing again
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
    setErrors({ ...errors, image: '' }); // Clear file input error when a file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    const { nom_resp, nom_user, email_resp, tel_resp, mdp, image } = formData;
    const newErrors = {};

    if (!nom_resp.trim()) {
      newErrors.nom_resp = 'Le nom complet est requis.';
    }
    if (!nom_user.trim()) {
      newErrors.nom_user = 'Le nom d\'utilisateur est requis.';
    }
    if (!email_resp.trim()) {
      newErrors.email_resp = 'L\'email est requis.';
    } else if (!/\S+@\S+\.\S+/.test(email_resp)) {
      newErrors.email_resp = 'L\'email est invalide.';
    }
    if (!tel_resp.trim()) {
      newErrors.tel_resp = 'Le numéro de téléphone est requis.';
    } else if (!/^\d{10}$/.test(tel_resp)) {
      newErrors.tel_resp = 'Le numéro de téléphone doit être composé de 10 chiffres.';
    }
    if (!mdp.trim()) {
      newErrors.mdp = 'Le mot de passe est requis.';
    }
    if (!image) {
      newErrors.image = 'Veuillez sélectionner une image.';
    }

    // If there are errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    try {
      await axios.post('http://localhost:3000/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onRegisterSuccess();
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement', error);
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Inscription</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom_resp"
            value={formData.nom_resp}
            onChange={handleChange}
            placeholder='Nom complet'
          />
          {errors.nom_resp && <span className="error">{errors.nom_resp}</span>}
          <input
            type="text"
            name="nom_user"
            value={formData.nom_user}
            onChange={handleChange}
            placeholder="Nom d'utilisateur"
          />
          {errors.nom_user && <span className="error">{errors.nom_user}</span>}
          <input
            type="email"
            name="email_resp"
            value={formData.email_resp}
            onChange={handleChange}
            placeholder='Email'
          />
          {errors.email_resp && <span className="error">{errors.email_resp}</span>}
          <input
            type="tel"
            name="tel_resp"
            value={formData.tel_resp}
            onChange={handleChange}
            placeholder='Téléphone'
          />
          {errors.tel_resp && <span className="error">{errors.tel_resp}</span>}
          <input
            type="password"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            placeholder='Mot de passe'
          />
          {errors.mdp && <span className="error">{errors.mdp}</span>}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
          />
          {errors.image && <span className="error">{errors.image}</span>}
          <button type="submit">S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
