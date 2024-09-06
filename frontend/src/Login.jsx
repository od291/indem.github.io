import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; 

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email_resp: '',
    mdp: '',
  });

  const [errors, setErrors] = useState({}); 
  const [loginError, setLoginError] = useState(''); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let errors = {};
    let formIsValid = true;

    if (!formData.email_resp) {
      formIsValid = false;
      errors.email_resp = 'L\'email est requis';
    }

    // Email format validation (optional)
    if (formData.email_resp) {
      let pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(formData.email_resp)) {
        formIsValid = false;
        errors.email_resp = 'Format d\'email invalide';
      }
    }

    if (!formData.mdp) {
      formIsValid = false;
      errors.mdp = 'Le mot de passe est requis';
    }

    setErrors(errors);
    return formIsValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('http://localhost:3000/login', formData);
        if (response.data.message === 'Authentification réussie') {
          onLoginSuccess();
        } else {
          setLoginError('Erreur lors de l\'authentification');
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            
          } else {
            console.error('Erreur lors de la connexion', error);
            setLoginError('Mot de passe ou email incorrect');
          }
        } else {
          console.error('Erreur lors de la connexion', error);
          setLoginError('Erreur réseau');
        }
      }
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h1>Connexion</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email_resp"
            value={formData.email_resp}
            onChange={handleChange}
            placeholder="Email"
          />
          {errors.email_resp && <p className="error">{errors.email_resp}</p>}
          <input
            type="password"
            name="mdp"
            value={formData.mdp}
            onChange={handleChange}
            placeholder="Mot de passe"
          />
          {errors.mdp && <p className="error">{errors.mdp}</p>}
          {loginError && <p className="error">{loginError}</p>}
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
