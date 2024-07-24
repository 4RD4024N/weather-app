import '../Navbar.css';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faSearch } from '@fortawesome/free-solid-svg-icons';
import { toggleNightMode } from '../themeSlice';
import { useSelector, useDispatch } from 'react-redux';
import ShareButtons from './ShareButtons';
import CityInput from './CityInput';

const Navbar = () => {
    const { isNightMode } = useSelector((state) => state.theme);
    const dispatch = useDispatch();
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
                    />
                </div>
               
                <div className="share-buttons">
                    <ShareButtons />
                </div>
            </div>
        </>
    );
};

export default Navbar;
