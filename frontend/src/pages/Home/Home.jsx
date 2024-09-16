import React, { useRef } from 'react'
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { GrNext, GrPrevious } from "react-icons/gr";
import movieData from '../../data/moviData2.json'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import { Link } from 'react-router-dom';
const sliderImage = ["https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg", 'https://assets-in.bmscdn.com/promotions/cms/creatives/1725952931195_columbia100webnew.jpg', 'https://assets-in.bmscdn.com/promotions/cms/creatives/1726036566435_playcardnewweb.jpg',]
const Home = () => {
  const swiper = useSwiper();

console.log(import.meta.env.VITE_SERVER_URL);

  return (
    <div className='w-full'>

      {/* hero section */}
    <HeroSection/>
    <MovieContainer title={"new Release"} data={movieData}/>
    <MovieContainer title={"new Release"} data={movieData}/>

    </div>
  )
}

const HeroSection=()=>{
  return(
    <span className="w-full  relative flex h-[250px] bg-gray-500">

    <Swiper
      pagination={{
        dynamicMainBullets:true,
        clickable:true,
      }}
     loop={true}
      autoplay={{
        delay: 2000,
        pauseOnMouseEnter: true,
        disableOnInteraction: false
       }}
      navigation={
        {

          prevEl: ".prev",
          nextEl:".next"

        }
      }
      loop:true
  
      modules={[Pagination, Navigation]}
      // navigation:true

      className="mySwiper"
    >
    <span className=" top-[125px] absolute next  bg-gray-300 size-10 flex items-center justify-center cursor-pointer  rounded-tr-md rounded-br-md z-[4] " >

<GrNext />
</span>
      {
        sliderImage.map((image, id) => {
          return (
            <SwiperSlide className=' relative' key={id}>

              <img src={image} alt="" className='w-full h-full' />


            </SwiperSlide>
          )
        })


      }
      <span className=" prev top-[125px] absolute bg-gray-300 size-10 flex items-center justify-center right-0  rounded-tl-md rounded-bl-md  z-[4] cursor-pointer" >

        <GrPrevious />
      </span>

    </Swiper>

  </span>
  )
}

export const  MovieContainer=({title,data})=>{

  
  return(
    <div className=" bg-gray-200 w-full flex p-3 justify-start items-center ">
      <div className="flex flex-col gap-2 w-full px-10 sm:px-1">
        {/* heading */}
        <span className="text-gray-600 capitalize px-2 text-xl">
          {title}

        </span>
        {/* card container */}

        <div className="w-full flex bg-red items-center p-1 overflow-x-auto gap-2">

          {
            data.map((movie,id)=>{
              return(
<Link to={`/movies/${movie.film_id}/${movie.imdb_title_id}`} key={movie?.imdb_title_id} className=" aspect-auto max-w-[200px] min-w-[200px] cursor-pointer max-h-[300px] h-full bg-gray-800 flex flex-col flex-1 text-white rounded-md overflow-hidden hover:bg-blue-500 hover:scale-105 transition ease delay-150 
        ">
          <div className="img">
            <img className='max-h-[200px] w-full' src={movie?.images?.poster?.pic?.medium?.film_image} alt="" />

          </div>
          <div className="content px-2">
            <h4 className='text-md'>{movie.film_name}</h4>
            <h6 className='text-xs'>{(movie.release_dates[0].release_date)}</h6>
          </div>


        </Link>
              )
            })
          }
        
        </div>
       
      </div>
    </div>
  )
}

export default Home