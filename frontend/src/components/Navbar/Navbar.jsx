import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import LoginPopup from '../LoginPopup/LoginPopup';
import './Navbar.css';

const Navbar = () => {  
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmount } = useContext(StoreContext);
  const [userName, setUserName] = useState(""); 
  const [showLogin, setShowLogin] = useState(false);


  useEffect(() => {
    const fetchUser = async () => {
        try {
            const response = await axios.get('https://ansh-foodie-backend.vercel.app/api/auth/user', { withCredentials: true });
            setUserName(response.data.name);
        } catch (error) {
            console.log('Error fetching user:', error.response ? error.response.data : error.message);
        }
    };
    fetchUser();
}, [showLogin]);

    const handleSuccessfulAuth = async () => {
      setShowLogin(false);
      try {
          const response = await axios.get('https://ansh-foodie-backend.vercel.app/api/auth/user', { withCredentials: true });
          setUserName(response.data.name);
      } catch (error) {
          console.log('Error fetching user:', error.response ? error.response.data : error.message);
      }
      navigate('/');
  };

  return (
    <div className='navbar'>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} onSuccess={handleSuccessfulAuth} />}
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>Mobile app</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact us</a>
        <Link to="/my-orders" onClick={() => setMenu("my-orders")} className={`${menu === "my-orders" ? "active" : ""}`}>My Orders</Link>

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

const handleLogout = async () => {
  try {
    await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true });
    window.location.reload(); 
  } catch (error) {
    console.error('Logout failed');
  }
};

export default Navbar;
