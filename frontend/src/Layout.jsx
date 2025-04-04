import React from 'react'

import { Outlet } from 'react-router-dom'
import { Login, Register } from './component/auth/Auth'
import {useSelector,useDispatch} from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Header from './component/Header';
const Header = React.lazy(() => import('./component/Header.jsx')) 
// import Popup from './component/popup/Popup';
// import DelAlert from './component/DelAlert';
// import PopupChildren from './component/popup/PopupChildren';
const PopupChildren = React.lazy(() => import('./component/popup/PopupChildren.jsx'))
// import { isVerified } from './slices/authSlice.js'
const Layout = () => {
  const {status,formStatus}=useSelector(state=>state.auth)

  return (
    <div className='flex relative primary-bg flex-col items-center w-screen min-h-screen h-full '>

      {/* <ToastContainer /> */}

      <ToastContainer
position="bottom-center"
// containerId="mobile"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
limit={1}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
// theme="light"
/>

  
{
            !status &&
            formStatus?.login ?<Login/>:formStatus?.register ?<Register/>:""
          }

      <Header/>

<div className="relative w-full h-full primary-bg ">
 {/* <DelAlert/> */}
 <PopupChildren/>
        <Outlet/>
</div>
   
    </div>
  )
}

export default Layout

