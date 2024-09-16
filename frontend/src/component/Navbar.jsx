import React from 'react'
import { LuMenu } from "react-icons/lu";
import { MdSearch } from "react-icons/md";
import  logo from '../assets/logo.png';
import { MdLocationOn } from "react-icons/md";
import { Link } from 'react-router-dom';
import {useDispatch,useSelector} from 'react-redux'
import { setFormStatus } from '../slices/authSlice';
const navTitle=["movies","stream","event",'plays',"sports","activities","listyourShow",'corporates','offers','gift cards']

const Profile=({profile})=>{  
  return(
    <span className="hidden sm:flex items-center bg-gray-400 hover:bg-slate-800 hover:text-white text-sky-900 cursor-pointer p-1 rounded-lg  gap-2 ">
      <img src={profile?.profileImage} className='size-[40px] rounded-full' alt="" />
      <p className='capitalize '>hey,{profile?.userName.split(" ")[0]}</p>
      
    </span>
  )
}
const Navbar = () => {

  const {userInfo}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  // console.log(userInfo);
  
  return (

 <div className="w-full relative z-[1000]">
  <div className='w-full h-[70px] bg-gray-500 flex justify-between px-3' >

<div className="items-center min-w-[250px]  h-full border-sky-500 max-w-xl flex flex-1 gap-2.5">
  <Link to={'/'} className="">
    <img src={logo} alt="" className='mix-blend-multiply max-w-[100px]' width={'100px'}/>
  </Link>
  <span className=" px-2 py-1 flex w-full bg-white items-center rounded-sm gap-x-2" >

<MdSearch />
    <input type="text" placeholder='search your movies ' className='bg-transparent flex outline-none w-full' />
  </span>
</div>

<div className="h-full border-sky-500 max-w-xl flex gap-2.5 justify-end items-center" >
<span className="nav-titles flex items-center">

<span className='sm:flex hidden items-center gap-1'>choose<MdLocationOn className='mt-1 text-gray-100'/></span>

</span>
{userInfo && Object.keys(userInfo)==0?<div onClick={()=>{dispatch(setFormStatus({login:true}))}} className="btn cursor-pointer w-20 bg-pink-500 flex justify-center items-center  rounded-[5px] text-white ">
  sign
</div>:<Profile profile={userInfo}/>}
<span className="icon ">

<LuMenu className='text-2xl' />
</span>
</div>
</div>



{/* sub-nav */}
<div className=" sm:flex hidden   px-4 w-full h-[30px] bg-gray-400  items-center justify-between gap-2">
<span className="title1 flex text-sm items-center gap-2 capitalize">
{
navTitle.map((value,id)=>{
  if(id<=4)
  return <input type='button' className='cursor-pointer capitalize' key={id} value={value}/>
})
}
</span>
<span className="title1  flex  text-sm  items-center gap-2 capitalize">
{
navTitle.map((value,id)=>{
  if(id>4)
  return <input type='button' className='cursor-pointer capitalize' key={id} value={value}/>
})
}
</span>

</div>
    </div>
  
  )
}

export default Navbar