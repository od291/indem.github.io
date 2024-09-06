import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Sidebar from './Sidebar';
import Home from './Home';
import Personnel from './Personnel';
import Indemnites from './Indemnites';
import Rapports from './Rapports';
import Email from './Email';
import Parametres from './Parametres';
import Register from './Register';
import Login from './Login';
import axios from 'axios';

function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [activePage, setActivePage] = useState('home');
  const [isRegistered, setIsRegistered] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkIfRegistered = async () => {
      try {
        const response = await axios.get('http://localhost:3000/check-responsable');
        setIsRegistered(response.data.isRegistered);
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'enregistrement', error);
      }
    };

    checkIfRegistered();
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      if (authStatus) {
        setIsAuthenticated(true);
      }
    };

    checkAuthStatus();
  }, []);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated'); // Supprime l'état d'authentification
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    localStorage.setItem('isAuthenticated', 'true'); // Enregistre l'état d'authentification
    setIsAuthenticated(true);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home />;
      case 'personnel':
        return <Personnel />;
      case 'indemnites':
        return <Indemnites />;
      case 'Rapports':
        return <Rapports />;
      case 'Email':
        return <Email />;
      case 'Parametres':
        return <Parametres />;
      default:
        return <Home />;
    }
  };

  if (isRegistered === null) {
    return <div>Chargement...</div>;
  }

  if (!isRegistered) {
    return <Register onRegisterSuccess={() => setIsRegistered(true)} />;
  }

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar} onLogout={handleLogout} />
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} setActivePage={setActivePage} onLogout={handleLogout} />
      {renderPage()}
    </div>
  );
}

export default App;
