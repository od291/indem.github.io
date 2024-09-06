// Modal.jsx
import React from 'react';
import './Modal.css'; // Assurez-vous de créer un fichier CSS pour styliser votre modal

function Modal({ show, onClose, children }) {
  if (!show) {
    return null;
  }

  return (
    <div className='modal-overlay'>
      <div className='modal'>
        <button className='modal-close' onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
