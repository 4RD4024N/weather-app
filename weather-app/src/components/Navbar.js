import '../Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { toggleNightMode } from '../themeSlice';
import { useSelector, useDispatch } from 'react-redux';

const Navbar=()=>{
    const { isNightMode } = useSelector((state) => state.theme);
    const dispatch=useDispatch();
    return(
        <>
        <div classname='navbar'>
        <FontAwesomeIcon
          icon={isNightMode ? faSun : faMoon}
          className={`toggle-icon ${isNightMode ? 'night-mode' : ''}`}
          onClick={() => dispatch(toggleNightMode())}
          size="3x"
        />
        </div>

        </>
    )
};
export default Navbar;