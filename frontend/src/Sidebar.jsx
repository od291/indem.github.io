import React, { useEffect, useState } from 'react';
import { BsCashStack, BsGrid1X2, BsPeople, BsEnvelope, BsFileEarmarkText, BsGear, BsBoxArrowRight } from 'react-icons/bs';
import axios from 'axios';

function Sidebar({ openSidebarToggle, OpenSidebar, setActivePage, onLogout }) {
  const [admin, setAdmin] = useState({});

  useEffect(() => {
    // Fetch admin data
    axios.get('http://localhost:3000/admin')
      .then(response => {
        setAdmin(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données de l\'admin:', error);
      });
  }, []);

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          {admin.image && (
            <img src={`http://localhost:3000/uploads/${admin.image}`} alt="photo_admin" className='icon_header' />
          )}
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item' onClick={() => setActivePage('home')}>
          <a href="#">
            <BsGrid1X2 className='icon' /> Tableau de bord
          </a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActivePage('personnel')}>
          <a href="#">
            <BsPeople className='icon' /> Personnels
          </a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActivePage('indemnites')}>
          <a href="#">
            <BsCashStack className='icon' /> Indemnités
          </a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActivePage('Rapports')}>
          <a href="#">
            <BsFileEarmarkText className='icon' /> Rapports
          </a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActivePage('Email')}>
          <a href="#">
            <BsEnvelope className='icon' /> E-mail
          </a>
        </li>
        <li className='sidebar-list-item' onClick={() => setActivePage('Parametres')}>
          <a href="#">
            <BsGear className='icon' /> Paramètres
          </a>
        </li>
        <li className='sidebar-list-item logout' onClick={onLogout}>
          <a href="#">
            <BsBoxArrowRight className='icon' /> Se déconnecter
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
