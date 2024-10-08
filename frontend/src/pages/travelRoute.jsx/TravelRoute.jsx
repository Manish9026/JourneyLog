import React, { memo, useEffect, useState } from 'react'
import Title from '../../component/Title'

import { FaArrowRight, FaCross, FaTrain } from "react-icons/fa";
import { RiEBikeLine } from "react-icons/ri";
import { MdDirectionsCarFilled } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { FaIndianRupeeSign, FaXmark } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
// import { Button } from '../Home/Home';
import useReactHooks from '../../custom-hooks/useReactHooks';
import { addRoute, searchPlace } from '../../slices/travelRouteSlice';
import { toast } from 'react-toastify';
import { Button } from '../../component/UI component/Button';
import { useSelector } from 'react-redux';
import { getFormatedDate } from '../../utils/timeFormat';
import { Tuple } from '@reduxjs/toolkit';
// import { log } from 'console';

export const travler = [["rapido", <RiEBikeLine />], ["metro", <FaTrain />], ["auto", <MdDirectionsCarFilled />], ["other", <FaRoute />]]
const TravelRoute = () => {

  const { recentRoutes, loading } = useSelector(state => state.travelRoute.addRoute)
  const [srhBox,setSrhBox]=useState({
    one:false,
    two:false
  })
  const { dispatch } = useReactHooks();
  const [formData, setFormData] = useState({
    whereFrom: "",
    whereTo: "",
    amount: '',
    travelBy: "metro",
    date: Date.now
  })


  const onChangeHandler = (ele) => {

    const { name, value } = ele;
    if (name == "amount") {
      if (!isNaN(value))
        setFormData(prev => ({ ...prev, [name]: value }));
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }));

  }

  const isValidate = () => {
    if (!formData.amount) {
      toast.error("please enter amount")
      return false
    }
    else if (!formData.travelBy) {
      toast.error("please choose option from travelBY")
      return false
    }
    else if (!formData.whereFrom) {
      toast.error("please enter location")
      return false
    }
    else if (!formData.whereTo) {
      toast.error("please enter destination location")
      return false
    }
    else {
      return true
    }
  }
  const onSubmitHandler = () => {
    if (isValidate())
      dispatch(addRoute(formData))
  }
  const reset=()=>{
    setFormData({
      whereFrom: "",
      whereTo: "",
      amount: '',
      travelBy: "metro",
      date: Date.now
    })
  }

  const interchangeHandler = () => {
    // if(formData.whereFrom)
    setFormData(prev => ({ ...prev, whereFrom: prev.whereTo, whereTo: prev.whereFrom }))
  }

  
  return (
    <div className='flex flex-col w-full h-full'>

      <div className="primary-p">
        <Title title={"Pick location"} />
        <span className='flex flex-col items-center gap-1 max-w-[400px]'>
          <span className='w-full relative '>
          <input type="text" onFocus={()=>setSrhBox(prev=>({...prev,one:true}))
          } className={`inputField`} name='whereFrom' onChange={(e) => onChangeHandler(e.target)} value={formData.whereFrom} placeholder='where from' />

          {srhBox.one && <SrhContainer close={()=>setSrhBox(prev=>({...prev,one:false}))} srhParam={formData.whereFrom} setValue={(value)=>{setFormData(prev=>({...prev,whereFrom:value}));setSrhBox(prev=>({...prev,one:false}))}
          }/>}
          </span>

          <LuArrowDownUp className='size-[25px] cursor-pointer tertiary-font p-1 text-xl' onClick={() => interchangeHandler()} />
            <span className='w-full relative '>

          <input type="text" value={formData.whereTo} onChange={(e) => onChangeHandler(e.target)} name='whereTo' onFocus={()=>setSrhBox(prev=>({...prev,two:true}))} className={`inputField`} placeholder='where to' />

          {srhBox.two && <SrhContainer close={()=>setSrhBox(prev=>({...prev,two:false}))} srhParam={formData.whereTo} setValue={(value)=>{setFormData(prev=>({...prev,whereTo:value}));setSrhBox(prev=>({...prev,two:false}))}
          }/>}
            </span>

          <div className="sub flex w-full flex-wrap gap-1 ">

            {/* <input type="text" /> */}
            <select name="travelBy" id="" defaultValue={formData.travelBy} onChange={(e) => onChangeHandler(e.target)} className='inputField max-w-[200px] flex-1'>
              <option value="metro">metro</option>
              <option value="rapido">rapido</option>
              <option value="auto">auto</option>
              <option value="other">other</option>
            </select>
            <input type="text" value={formData.amount} onChange={(e) => onChangeHandler(e.target)} name='amount' placeholder='Amount' className='inputField min-w-[50px] flex-1 ' />

          </div>

          <div className="flex gap-2  center w-full">

            <Button className={"btn bg-sky-200 flex-1"} btnName={"reset"}  onClick={()=>reset()}/>
            <Button className={"btn tertiary flex-1"} btnName={"Add"} onClick={() => onSubmitHandler()} />
          </div>


        </span>


      </div>

      <div className="primary-p w-full max-h-[500px] overflow-auto">
        <Title title={"your recent travels"} />
        <div className=" flex flex-col gap-2 py-2 w-full ">
          {loading && <span className=' relative flex flex-col cursor-pointer rounded-md p-2 light-dark gap-1' >
            <span className='flex items-center  gap-2'>
              <span className='size-[20px] inner-shade p-1 rounded-full'></span>
              <span className='flex gap-2 items-center capitalize flex-wrap'>
                <p className='min-w-[100px] inner-shade p-1 rounded-md'></p><FaArrowRight className='text-xs font-normal text-white mt-0' /> <p className='min-w-[100px] inner-shade p-1 rounded-md'></p>
              </span>

            </span>
            <span className='flex items-center text-sm gap-2'>
              <span className='size-[20px] inner-shade p-1 rounded-full'></span><p className='min-w-[50px] inner-shade py-[5px] rounded-[2px]'></p></span>

            <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'></p>
          </span>}
          {recentRoutes.length != 0 ?
            recentRoutes.map((routes, id) => {

              return (
                <div className="" key={routes._id}>
                  <Title title={getFormatedDate({ date: routes.createdAt, type: "date" })} />
                  <div className="t-container  flex flex-col gap-2 py-2 w-full">

                    {
                      Array.isArray(routes?.travel) && routes?.travel.length != 0 &&
                      [...routes.travel].sort((a, b) => new Date(b.date) - new Date(a.date)).map((data, id) => {
                        return (
                          <span className='t-body relative cursor-pointer' key={data._id}>
                            <span className='flex items-center  gap-2'>
                              {travler.map((items, indx) => {
                                if (items[0] == data.travelBy)
                                  return (<span key={indx} className='text-yellow-900'>{items[1]}</span>)
                              })}
                              <span className='flex gap-2 items-center capitalize flex-wrap'>
                                <p>{data?.whereFrom}</p><FaArrowRight className='text-xs font-normal mt-1' /> <p>{data?.whereTo}</p>
                              </span>

                            </span>
                            <span className='flex items-center text-sm'>
                              <FaIndianRupeeSign className='text-sm mt-1' />{data?.amount}</span>

                            <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'>{getFormatedDate({ date: data?.date, type: "time" })}</p>
                          </span>
                        )
                      })
                    }

                  </div>

                </div>
              )

              //   return(
              //     <span className='t-body cursor-pointer' key={id}>
              //     <span className='flex items-center  gap-2'><span className='text-yellow-900'>{travler[0][1]}</span> 
              //       <span className='flex gap-2 items-center capitalize flex-wrap'>
              //       <p>{"ashram"}</p><FaArrowRight className='text-xs font-normal mt-1'/> <p>{"mayur vihar"}</p>
              //       </span>

              //       </span>
              //       <span className='flex items-center text-sm'>
              // <FaIndianRupeeSign className='text-sm mt-1'/>{100}</span>
              //     </span>
              //   )

            }) :

            <div className="">
              recent not routes avilable
            </div>
          }


        </div>
        <div className="">

        </div>
      </div>
    </div>
  )
}

const SrhContainer=memo(({srhParam,setValue,close})=>{
const {dispatch}=useReactHooks();
const {loading,data} = useSelector(state => state.travelRoute.addRoute.srhResult);
  useEffect(()=>{
    const timout=setTimeout(()=>{
// console.log(srhParam);
dispatch(searchPlace(srhParam))
    },500)

    return ()=>clearTimeout(timout)
  },[srhParam])

  return(

    <div className="flex z-10 transition-all duration-500 flex-wrap p-2 gap-2 list-none secondary-bg min-h-[200px] pt-[30px] absolute w-full ">

      <span onClick={()=>close()} className='absolute top-[5px] cursor-pointer right-[10px] size-[20px] light-bg center rounded-full '><FaXmark/></span>
      {Array.isArray(data) && data.length!=0 ?data.map((place,id)=>{
        return(
          <li onClick={()=>setValue(place?.name)} className=' flex bg-sky-200 min-w-[100px] opacity-80 cursor-pointer p-2 flex-1 rounded-md capitalize center max-h-[40px]'>{place.name}</li>
        )
      }):<div className='flex flex-col w-full gap-2 capitalize primary-font center'><p>place not exist in own record</p> <p className='tertiary-font'>please try manual</p>
      </div>}
    </div>
  )
})

export default TravelRoute