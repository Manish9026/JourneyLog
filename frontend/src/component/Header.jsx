import React, { useRef, useState } from 'react'
import { PiHandWavingFill } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import { Button } from './UI component/Button';
import { Link } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { MdPostAdd } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useSelector } from 'react-redux';
import { logout, setFormStatus } from '../slices/authSlice';
import logo from '../../public/logo.png'
import useReactHooks from '../custom-hooks/useReactHooks';





const Header = () => {
    const [isNavActive,setIsNavActive]=useState(false)
    const {userInfo}=useSelector(state=>state.auth)
    const {dispatch}=useReactHooks();
  return (
    <header className='w-full primary-px  transition ease-in' >
   <div className="w-full h-[70px] items-center flex justify-between  primary-font">

 {userInfo && Object.keys(userInfo).length!=0?<span className="flex flex-col ">
      <h4 className='flex capitalize items-center'>Hi,<p>{userInfo?.userName} 

</p><PiHandWavingFill className='ml-2 text-yellow-400' /></h4>
      <h6 className='text-xl'>Welcome back!</h6>
    </span>: 
    <div className='uppercase flex items-center '>
        <span className='flex gap-2 items-center'><img src={logo} className='size-[40px]' alt="" />journeyLog</span>
       <PiHandWavingFill className='ml-2 text-yellow-400' /> 
        </div>}

<span className='flex items-center gap-2'>
{!(userInfo && Object.keys(userInfo).length!=0) && <Button className='tertiary px-2 py-1 capitalize rounded-md' btnName={"signin"} onClick={()=>dispatch(setFormStatus({login:true}))}/>}
    <span onClick={()=>{setIsNavActive(!isNavActive)}} className="size-[40px] cursor-pointer light-bg center rounded-full text-xl">

<LuMenu />
    </span>
</span>
   </div>
   <div className={`${isNavActive? "max-h-40 opacity-100" : "max-h-0 opacity-0"} transition-all duration-500 overflow-hidden flex flex-col list-none secondary-font capitalize`}>
   {
    [["home","/",<AiFillHome />],["add","/add-routes",<MdPostAdd />],["statements","/statement",<HiDocumentMagnifyingGlass />]].map((title,id)=>{
        return (
            <Link to={title[1]} key={id}>
            <li className='flex items-center gap-2 '>{title[2]}{title[0]}</li>
            </Link>
        )

    })
   }
   <li className='flex items-center gap-2 cursor-pointer' onClick={()=>dispatch(logout())}> <IoMdLogOut /> logout</li>
   </div>
   </header>
  )
}

export default Header