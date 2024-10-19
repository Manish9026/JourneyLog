import React from 'react'
import Popup from './popup/Popup'
import Title from './Title'
import { travler } from '../pages/travelRoute.jsx/TravelRoute'
import { FaArrowRight } from 'react-icons/fa'
import { FaIndianRupeeSign } from 'react-icons/fa6'
import { BsDash } from 'react-icons/bs'
import { getFormatedDate } from '../utils/timeFormat'
import { useSelector } from 'react-redux'
import useReactHooks from '../custom-hooks/useReactHooks'
import { deleteRoute, setAlert, setDelStateData } from '../slices/travelRouteSlice'

const DelAlert = () => {
    const {data,loading,alert} =useSelector(state=>state.travelRoute.deleteState)
    const {dispatch}=useReactHooks();
  return (
    <Popup active={alert} iconBox={{display:'none'}}>
        <span className='bg-slate-900 w-full h-full flex flex-col '>
            <div className='border-b primary-p'><Title title={"delete confirmation"}/></div>
            <span className='t-container primary-p flex-1 flex flex-col gap-y-2 max-h-[100px] overflow-auto'>
           {
            Array.isArray(data) && data.map((travel,id)=>{
                return(
                    <span className='t-body flex items-center flex-wrap relative ' >
                    <span className='flex items-center flex-wrap flex-1  gap-x-2 gap-y-1  min-w-[250px]'>
                      {travler.map((items, indx) => {
                        if (items[0] == travel?.travelDetails?.travelBy)
                          return (<span key={indx} className='text-yellow-900'>{items[1]}</span>)
                      })}
                      <span className='flex gap-x-2 flex-1 items-center capitalize flex-wrap'>
                        <p>{travel?.travelDetails?.whereFrom}</p><FaArrowRight className='text-xs font-normal mt-1' /> <p>{travel?.travelDetails?.whereTo}</p>
                      </span>
    
                    </span>
                    <span className='flex items-center text-sm flex-1 min-w-[100px] gap-1'>
                      <FaIndianRupeeSign className='text-sm mt-1' />{travel?.travelDetails?.amount}</span>
                      <span onClick={()=>dispatch(deleteRoute({cmpId,routeId:data?._id,date,parentId}))} className=' tertiary size-[25px] absolute right-[-8px] cursor-pointer secondary-font top-[50%] translate-y-[-50%] center rounded-full transition-all duration-700 active:scale-75'><BsDash /></span>
    
                    <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'></p>
                  </span>
                )
            })
           }
        </span>
        <div className="flex gap-2  capitalize p-2 center ">
          <button onClick={()=>{dispatch(setAlert());dispatch(setDelStateData({detail:null,type:"delete"}))}} className='bg-slate-500/50 py-2 active:scale-50 transition-all ease duration-700 rounded-md capitalize max-w-[200px] flex-1'>cancel</button>
          <button onClick={()=>{dispatch(deleteRoute({cmpId:data[0].cmpId,routeId:data[0]?.travelDetails?._id,deleteFrom:"recent",parentId:data[0].parentId}));dispatch(setAlert());dispatch(setDelStateData({detail:null,type:"delete"}))}} className='py-2 bg-blue-400 active:scale-50 transition-all ease duration-700  rounded-md capitalize max-w-[200px] flex-1'>confirm</button>
        </div>
        </span>
       


    </Popup>
  )
}

export default DelAlert