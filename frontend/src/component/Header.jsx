import React, { useRef, useState } from 'react'
import { PiHandWavingFill } from "react-icons/pi";
import { LuMenu } from "react-icons/lu";
import { Button } from './UI component/Button';
import { Link, NavLink } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { HiDocumentMagnifyingGlass } from "react-icons/hi2";
import { MdPostAdd } from "react-icons/md";
import { IoMdLogOut } from "react-icons/io";
import { useSelector } from 'react-redux';
import { logout, setFormStatus } from '../slices/authSlice';
import logo from '../../public/logo.png'
import useReactHooks from '../custom-hooks/useReactHooks';

import { BiSolidUserDetail } from "react-icons/bi";
import { MdPayments } from "react-icons/md";


import { TiHome } from "react-icons/ti";
import useSticky from '../custom-hooks/useSticky';
import { useEffect } from 'react';

import { TiTick } from "react-icons/ti";



const Header = () => {
    const [isNavActive,setIsNavActive]=useState(true)
    const {userInfo}=useSelector(state=>state.auth)
    const {dispatch}=useReactHooks();

    const headerActive=useSticky(90,20);

    useEffect(() => {
      setIsNavActive(0)
    }, [headerActive])
    
  return (
    <header className='w-full primary-px sticky top-0 z-50 primary-bg transition ease-in' >
   <div className="w-full h-[70px] items-center flex justify-between  primary-font">

 {userInfo && Object.keys(userInfo).length!=0?<span className="flex flex-col ">
      <h4 className='flex capitalize items-center'>Hi,<p>{userInfo?.userName} 

</p><PiHandWavingFill className='ml-2 text-yellow-400 smRotate-animate' /></h4>
      <h6 className='text-xl'>Welcome back!</h6>
    </span>: 
    <div className='uppercase flex items-center '>
        <span className='flex gap-2 items-center'><img src={logo} className='size-[50px]' alt="" />journeyLog</span>
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
    [["home","/",<AiFillHome />],["add","/add-routes",<MdPostAdd />],["statements","/statement",<HiDocumentMagnifyingGlass />],["detail","/detail",<BiSolidUserDetail />],["payment",'/payment',<MdPayments />]].map((title,id)=>{
        return (
            <NavLink to={title[1]} key={id} className={isActive=>isActive?.isActive?"NavActive":"NavDeActive"} end>

            <li className='flex items-center gap-2 '>{title[2]}{title[0]} <TiTick className={` tick text-green-500`}/></li>
            </NavLink>
        )

    })
   }
   <li className='flex items-center gap-2 cursor-pointer' onClick={()=>dispatch(logout())}> <IoMdLogOut /> logout</li>
   </div>
   {/* <div className={`${isNavActive?"translate-x-[0%]":""} w-screen h-screen  absolute left-0  translate-x-[-100%] transition-all ease duration-500 z-[100]`}>
   
   <span className=' flex h-full max-w-[250px] bg-[#18283b]'>

    <div className="flex w-full flex-col primary-p">

      <span className='w-full pb-2 px-2 flex text-xl primary-font border-b  max-h-[50px]'>journeylog</span> 
      <ul className='w-full  p-2 flex text-xl primary-font border-b  max-h-[50px]'>
        <li className='flex text-slate-400 cursor-pointer items-center p-1 gap-2 bg-red- flex-1'>
          <span><TiHome /></span> <h3>Overview</h3>
          </li>
      </ul>
      {/* <span className='w-full flex  max-h-[50px]'><img src={userInfo?.profileImage} alt="" className='size-[50px] rounded-full ' /></span> <span></span> 

    </div>

   </span>
   </div> */}
   </header>
  )
}

export default Header