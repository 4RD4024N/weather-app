import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import './share.css';
import './Navbar.css';
import './CityInput.css';
import AppRoutes from './AppRoutes';

const App = () => {
  const { isNightMode } = useSelector((state) => state.theme);

  return (
    <div className={`App ${isNightMode ? 'night-mode' : ''}`}>
      <Navbar />
      <AppRoutes />
    </div>
  );
};

export default App;
