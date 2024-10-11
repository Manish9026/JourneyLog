import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { GrNext, GrPrevious } from "react-icons/gr";

import  './style.scss'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import Title from '../../component/Title';
import { FaChevronDown, FaRupeeSign,FaPlus } from 'react-icons/fa';
import {useSelector} from "react-redux"
import { useEffect } from 'react';




const Home = () => {
const [selectValue,setSelectValue]=useState("")
const {userInfo}=useSelector(state=>state.auth);
const [isSelected,setIsSelected]=useState(false);
useEffect(()=>{
  if(!selectValue)
    setSelectValue(userInfo?.recentCompany)

},[userInfo?.recentCompany])
  return (
    <div className='w-full home primary-bg primary-p h-full flex flex-1 flex-col border-t'>
<span className='flex flex-col'>
                        <label  onClick={()=>setIsSelected(prev=>!prev)}  htmlFor='search' className='flex items-center  p-1 bg-sky-200/80 w-full min-h-[40px] overflow-hidden rounded-[5px]'>
                            <input type='text' id='search' value={selectValue} onChange={(e) => ""} className="cursor-pointer flex outline-none min-w-[100px] bg-transparent px-2 h-full  flex-1 w-full" />
                            <span onClick={""} className='text-[15px] min-w-[40px] text-sky-400 center  h-full'>
                                <FaChevronDown className={` ${isSelected?"rotate-180":"rotate-0"} transition-all duration-700 text-blue-950 `} />
                            </span>
                        </label>
                        <span className={`w-full secondary-bg  relative z-[1]  ${isSelected ? "max-h-[250px] opacity-100  px-2 py-1  " : "p-[0] max-h-[0px]  opacity-0 hidden "} transition-height duration-700 overflow-auto  flex flex-col gap-1   list-none`}>
                            {

                                userInfo && Array.isArray(userInfo?.company) && userInfo?.company.length != 0 ?
                                    userInfo?.company.map((data, id) => {
                                        return (
                                            <li key={data?._id} className='border px-1 rounded-md center capitalize  secondary-font cursor-pointer' onClick={(e) => {e.stopPropagation(); setIsSelected(false); setSelectValue(data?.cmpName); }}>{data?.cmpName}</li>
                                        )
                                    }) :
                                    <span className="capitalize w-full py-2 min-h-[100px] center flex-col">
                                        <p className='tertiary-font center text-center'> company dosen't exist in own record</p>
                                        <p className='center secondary-font text-center'> please add company details after that fill entry</p>
                                        <button onClick={() => navigate("/detail")} className='flex w-full gap-2 capitalize  cursor-pointer center max-w-[150px] mt-2 primary-font bg-sky-400 flex-1 max-h-[40px] rounded-md'><FaPlus /> <p>add</p></button>
                                    </span>
                            }</span>
                    </span>

      <ul className='w-full flex gap-2 w-full justify-center p-2'>
      <li className='flex box-1 flex-col  flex-1 max-w-[150px] capitalize rounded-md center '>
        <h3>today</h3>
        <span className='flex items-center'> <FaRupeeSign/> 500</span>
      </li>
      <li className='flex box-1 flex-col flex-1 max-w-[150px] capitalize rounded-md center '>
        <h3>total</h3>
        <span className='flex items-center'> <FaRupeeSign/> 500</span>
      </li>
      </ul>

    </div>
  )
}


export default Home