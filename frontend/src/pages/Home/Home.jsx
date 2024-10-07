import React, { useRef } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { GrNext, GrPrevious } from "react-icons/gr";

import  './style.scss'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
import Title from '../../component/Title';
import { FaRupeeSign } from 'react-icons/fa';





const Home = () => {

  return (
    <div className='w-full home primary-bg h-full flex flex-1 flex-col border-t'>
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