import React, { useState } from 'react';
import axios from 'axios';

function Email() {
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const sendEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/send-email', {
        toEmail,
        subject,
        text: message
      });

      console.log(response.data); // Affiche le message de réussite ou d'échec
      alert('Email envoyé avec succès !');
    } catch (error) {
      console.error('Échec de l\'envoi de l\'email. Erreur : ', error);
      alert('Échec de l\'envoi de l\'email. Veuillez réessayer.');
    }
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>E-mail</h3>
      </div>
      <form onSubmit={sendEmail}>
        <input
          type='email'
          placeholder='Email du destinataire'
          value={toEmail}
          onChange={(e) => setToEmail(e.target.value)}
          required
          className='input-field'
        />
        <input
          type='text'
          placeholder='Objet'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className='input-field'
        />
        <textarea
          placeholder='Message'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className='textarea-field'
        />
        <button type='submit' className='submit-button'>Envoyer</button>
      </form>
    </main>
  );
}

export default Email;
