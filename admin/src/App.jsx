import React from 'react'
import Navbar from './components/Navbar/Navbar' 
import Sidebar from './components/Sidebar/Siderbar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  
  const url = import.meta.env.VITE_API_URL;


  const toastConfig = {
        position:"top-right",
        autoClose:5000,
        hideProgressBar:false,
        newestOnTop:false,
        closeOnClick:true,
        rtl:false,
        pauseOnFocusLoss:true,
        draggable:true,
        pauseOnHover:true,
        theme:"light"
  };


  return (
    <div>
      <ToastContainer {...toastConfig}/>
      <Navbar/>
      <hr/>
      <div className="app-content">
      <Sidebar/>
      <Routes>       
        <Route path="/add" element={<Add url = {url} />}/>
        <Route path="/list" element={<List url = {url}/>}/>
        <Route path="/orders" element={<Orders url = {url} />}/>
      </Routes>
      </div>
    </div>
  )
}

export default App
