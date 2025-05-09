import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
const Navbar = ({setShowLogin}) => {

const [menu, setMenu] = useState("home");

const {getTotalCartAmmount} =useContext(StoreContext)

  return (
    <div className='navbar'>
      <Link to='/'><img src={assets.logo} alt="company-logo" className="logo" /></Link>

     <ul className="navbar-menu">
        <Link to='/'onClick={()=>setMenu("home")} className={menu==="home"?"active":""} data-testid = "home">home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""} data-testid = "menu">menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""} data-testid = "mobile-app">mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""} data-testid = "contact-us">contact us</a>
        </ul>
        
      <div className="navbar-right">
        <img src={assets.search_icon} alt="search-icon" />

        <div className="navbar-search-icon">
           <Link to='/cart'><img src={assets.basket_icon} alt="basket-icon" /></Link>
            <div className={getTotalCartAmmount()===0?"":"dot"}></div>
 
        </div>
        <button onClick={()=>setShowLogin(true)} data-testid = "sign-in">sign in</button>
        </div>  
    </div>
  )
}

export default Navbar
 