import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../../component/loader/Loader';
import 'swiper/css';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Mousewheel, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { getshowTime } from '../../slices/singleMoviPageSlice';
import { Link, useLoaderData } from 'react-router-dom';
import data from '../../data/moviData.json'
import showTime from '../../data/showTime.json'
import { MdLocationOn } from "react-icons/md";
import { bookTicket, setActive, setTicket } from '../../slices/buyticketSlice';
import { GrPrevious } from "react-icons/gr";
import SeatContainer from '../../component/seat UI/SeatContainer';


const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

const timeConvert = (time) => {
    const [hour, min] = time.split(':')
    if (hour > 12) {
        return (hour - 12) + ':' + min + "PM"
    } if (hour == 12) {
        return "00" + ':' + min + "PM"
    } else {
        return hour + ':' + min + "AM"

    }


}
const dateFormat = (unFormatDate) => {
    console.log(unFormatDate, "date");

    const newDate = new Date(unFormatDate);
    const day = days.map((day, indx) => { if (newDate.getDay() == indx) return day })
    const month = months.map((month, indx) => { if (newDate.getMonth() == indx) return month })
    const date = newDate.getDate()

    return `${day},${date} ${month}`


}


const DateContainer = ({ date }) => {
    const newDate = new Date(date);
    return (
        <span className="flex flex-col py-2 bg-slate-600 size-[60px]  text-sm rounded-lg  justify-center items-center leading-normal">
            <li className='text-xs text-white'>{days.map((day, indx) => { if (newDate.getDay() == indx) return day })}</li>
            <li>{newDate.getDate()}</li>
            <li className='text-xs'>{months.map((month, indx) => { if (newDate.getMonth() == indx) return month })}</li>
        </span>
    )

}


const CinemaContainer = () => {
    // const {data,loading}=useSelector(state=>state.singleMoviPage.buyMoviContainer);
    const { isActive } = useSelector(state => state.buyTicket.seatingComp)
    console.log("is", isActive);

    const loading = false;
    const dispatch = useDispatch();

    // useEffect(()=>{
    //     window.scrollTo(0, 0)
    // },[])
    if (data && Object.keys(data).length != 0)
        return (

            <div className='w-full h-full min-h-[80%]  relative'>
                {
                    loading && <Loader />
                }
                {isActive ?<SittingArrange />:


                <div className="">
                <header className='w-full flex-col  bg-slate-200 flex gap-2 min-h-[200px] p-3 list-none'>
                    <span className="flex w-full flex-col gap-4 pb-1 border-b-2 border-solid border-red-800" >
                        <h4 className='text-3xl font-lg'>{data.film_name}</h4>
                        <span className='flex gap-3'>
                            <li className='bg-white px-2 rounded-md'>{data?.age_rating[0]?.rating}</li>
                            {
                                data.genres.map((genres) => {
                                    return (
                                        <li key={genres.genre_id}>{genres.genre_name}</li>
                                    )
                                })
                            }
                        </span>
                        <button className='bg-pink-600 p-2 rounded-md text-white max-w-[300px]'>Watch trailer</button>

                    </span>

                    <span className='flex w-full max-w-[400px] '>
                        <Swiper
                            // spaceBetween={2}
                            // direction= 'horizontal'
                            slidesPerView="auto"
                            // spaceBetween="2"
                            navigation={true}
                            className='myswiper2'

                            modules={[Navigation, Pagination]}
                        >
                            {
                                data.show_dates.map((date, id) => {
                                    return <SwiperSlide key={id}><DateContainer date={date?.date} /></SwiperSlide>
                                })
                            }
                        </Swiper>
                    </span>
                </header>


                <CinemaMall movi_id={data?.film_id} date={data?.show_dates[0]?.date} />
                </div>
}

            </div>
        )
}

const CinemaMall = ({ movi_id, date }) => {
    console.log(date);

    const dispatch = useDispatch();
    //     useEffect(()=>{
    //         dispatch(getshowTime({movi_id,date}))
    //     },[])

    return (
        <div className="flex flex-col w-full">
            <nav className='w-full flex items-center justify-end h-[50px] bg-slate-400 px-3 list-none gap-x-2 uppercase text-xs font-semibold'>
                <li className=' relative before:size-2 before:absolute before:left-[-15px] before:top-1/2 before:translate-y-[-50%] before:bg-green-500 
                before:content-[""] before:rounded-full' >available</li>
                <li className='ml-3 relative before:size-2 before:absolute before:left-[-15px] before:top-1/2 before:translate-y-[-50%] before:bg-red-500 
                before:content-[""] before:rounded-full'>fast filling</li>
                <li>subtitles language</li>
            </nav>

            <div className="
p-3 list-none border-b-[1px] border-solid border-gray-200
">

                {
                    showTime.cinemas.map((cinema, id) => {
                        return (
                            <span className="flex  gap-3 min-h-[100px] w-full flex-col" key={cinema.cinema_id}>
                                <span className="flex gap-2 items-center">
                                    <img className='size-[40px] rounded-full' src={cinema.logo_url} alt="" />
                                    <span>

                                        <h3>{cinema.cinema_name}</h3>
                                        <span className='flex items-center text-xs font-semibold'><MdLocationOn className='font-semibold text-lg' /> {(cinema.distance).toFixed(2)}Km</span>
                                    </span>
                                </span>
                                <span className="flex flex-wrap gap-2">
                                    {
                                        cinema.showings.Standard.times.map((value, id) => {

                                            return <li onClick={async () => { (dispatch(setTicket({ type: [["moviData", data], ["cinemaData", cinema], ["selectedAT", { time: value.start_time, date }]] })), dispatch(setActive())) }} className=' px-2 hover:bg-green-400 cursor-pointer rounded-md border-[2px] border-green-600 border-solid' key={id}>{timeConvert(value.start_time)}</li>
                                        })
                                    }
                                </span>

                            </span>
                        )
                    })
                }



            </div>


        </div>
    )

}

const SittingArrange = () => {
    const { moviData, cinemaData, selectedAT,tickets } = useSelector(state => state.buyTicket.ticketData);
    const dispatch=useDispatch();

    // if(Object.keys(moviData).length!=0 && Object.keys(cinemaData).length!=0  && bject.keys(selectedAt).length!=0  )
    return (
        <div className="
         bg-gray-800 w-full flex-col h-full flex-1 flex z-[39]

        
     
     ">
            <nav className='px-3 py-8  border-b-2 border-solid flex gap-2 flex-col border-white w-full '>
<span onClick={()=>dispatch(setActive())} className='bg-slate-600 text-slate-300 size-[50px] rounded-full flex items-center justify-center hover:bg-slate-300 hover:text-black cursor-pointer'>

<GrPrevious className='text-xl '/>
</span>
                <span className="flex w-full flex-col  gap-4 pb-1  list-none" >
                   

        <span className='text-4xl font-lg flex gap-3 text-gray-400 font-semibold flex justify-start items-center'>
        {moviData?.film_name}
        <li className='bg-white px-2 size-5 text-center text-sm flex justify-center items-center rounded-md'>{moviData?.age_rating[0]?.rating}</li>
        </span>
                   


        <span>
                    {cinemaData?.cinema_name}|{dateFormat(selectedAT?.date).split(",")}|{timeConvert(selectedAT?.time)}|

                </span>
                </span>

                <span className="flex flex-wrap gap-2 list-none">
                                    {
                                        cinemaData?.showings?.Standard?.times?.map((value, id) => {

                                            return <li onClick={async () => { (dispatch(setTicket({ type: [["moviData", data], ["cinemaData", cinema], ["selectedAT", { time: value.start_time, date }]] })), dispatch(setActive())) }} className={`${value.start_time==selectedAT.time?"bg-green-600":""} px-2 hover:bg-green-400 cursor-pointer rounded-md border-[2px] border-green-600 border-solid`} key={id}>{timeConvert(value.start_time)}</li>
                                        })
                                    }
                                </span>
               
            </nav>


            <div className="sitting-container flex flex-col gap-2 p-3">
            <span className='bg-slate-500 flex flex-col max-w-[200px] rounded-lg overflow-hidden text-center'>
                <h6 className='border-b capitalize'>choose seat</h6>
                <select name="" className='text-center bg-transparent' id="">
            {
                Array(5).fill(null).map((_,index)=>{
                    return (<option value={index+1}>{index+1}</option>)
                })
            }
            </select></span>
<SeatContainer/>

<span className='w-full flex items-center justify-center'>
    <button onClick={()=>dispatch(bookTicket({moviData, cinemaData, selectedAT,tickets}))} className='bg-pink-300 py-2 px-4 rounded-[5px]'>payment now</button>
</span>
            </div>

        </div>
    )


}


export default CinemaContainer