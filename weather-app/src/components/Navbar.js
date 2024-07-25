import '../Navbar.css';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSearch, faUser,faHome } from '@fortawesome/free-solid-svg-icons';
import { toggleNightMode } from '../themeSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import ShareButtons from './ShareButtons';
import CityInput from './CityInput';

const Navbar = () => {
  const { isNightMode } = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    setShowSearchModal(true);
  };

  const handleClose = () => {
    setShowSearchModal(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  const handleHomeClick=()=>{
    navigate('/');
  }

  return (
    <>
      <div className={`navbar ${isNightMode ? 'night-mode' : ''}`}>
        <div className="icon-group">
          <FontAwesomeIcon
            icon={isNightMode ? faSun : faMoon}
            className={`toggle-icon ${isNightMode ? 'night-mode' : ''}`}
            onClick={() => dispatch(toggleNightMode())}
            size="3x"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="search-icon"
            size="3x"
            onClick={handleSearchClick}
          />
          <FontAwesomeIcon
            icon={faUser}
            className='profile-icon'
            size='3x'
            onClick={handleProfileClick}
          />
          <FontAwesomeIcon
          icon={faHome}
          className='home-icon'
          size='3x'
          onClick={handleHomeClick}
          />
        </div>
        <div className="share-buttons">
          <ShareButtons />
        </div>
      </div>

      <Modal className={`modal ${isNightMode ? 'night-mode' : ''}`} show={showSearchModal} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton className={isNightMode ? 'night-mode' : ''}>
          <Modal.Title>Search</Modal.Title>
        </Modal.Header>
        <Modal.Body className={isNightMode ? 'night-mode' : ''}>
          <CityInput />
        </Modal.Body>
        <Modal.Footer className={isNightMode ? 'night-mode' : ''}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
