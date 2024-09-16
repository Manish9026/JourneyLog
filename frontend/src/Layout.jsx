import React from 'react'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import { Outlet } from 'react-router-dom'
import { Login, Register } from './component/auth/Auth'
import {useSelector,useDispatch} from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export const Layout = () => {
  const {status,formStatus}=useSelector(state=>state.auth)
  const style={
    width:"100vw",
    maxHeight:"100vh"
  }
  return (
    <div className='flex flex-col items-center w-screen min-h-screen h-full '>
      <ToastContainer/>
        <Navbar/>
        <div className="flex relative w-full h-full justify-center relative min-h-[80%] ">
          {
            !status &&
            formStatus?.login ?<Login/>:formStatus?.register ?<Register/>:""
          }

        <Outlet/>
        </div>
        <Footer/>
    </div>
  )
}

