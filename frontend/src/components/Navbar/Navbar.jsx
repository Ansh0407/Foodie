import React, { useContext, useState, useEffect } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios'; // Import axios
import LoginPopup from '../LoginPopup/LoginPopup';

const Navbar = () => {  
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount } = useContext(StoreContext);
  const [userName, setUserName] = useState(""); // State to store user's name
  const [showLogin, setShowLogin] = useState(false);

  // Fetch the user's name when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:5000/auth/user', { withCredentials: true });
        setUserName(response.data.name); // Set the user name
      } catch (error) {
        console.log('User not logged in');
      }
    };
    fetchUser();
  }, [showLogin]); // Empty dependency array ensures this runs only once on mount

  const handleSuccessfulAuth = () => {
    setShowLogin(false);
    navigate('/');
  };

  return (
    <div className='navbar'>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} onSuccess={handleSuccessfulAuth} />}
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>contact us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {userName ? (
          <>
            <span>Hi, {userName}!!</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => setShowLogin(true)}>Login</button>
        )}
      </div>
    </div>
  );
};

// Logout function
const handleLogout = async () => {
  try {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    window.location.reload(); 
  } catch (error) {
    console.error('Logout failed');
  }
};

export default Navbar;
