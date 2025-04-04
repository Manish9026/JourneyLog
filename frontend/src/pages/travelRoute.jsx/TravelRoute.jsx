import React, { memo, useEffect, useState } from 'react'
import Title from '../../component/Title'

import { FaArrowRight, FaCross, FaTrain } from "react-icons/fa";
import { RiEBikeLine } from "react-icons/ri";
import { MdClear, MdDirectionsCarFilled } from "react-icons/md";
import { FaRoute } from "react-icons/fa";
import { FaGroupArrowsRotate, FaIndianRupeeSign, FaPlus, FaXmark } from "react-icons/fa6";
import { LuArrowDownUp } from "react-icons/lu";
// import { Button } from '../Home/Home';
import useReactHooks from '../../custom-hooks/useReactHooks';
import { addRoute, deleteRoute, searchPlace, setAlert, setDelStateData } from '../../slices/travelRouteSlice';
import { toast } from 'react-toastify';
import { Button } from '../../component/UI component/Button';
import { useSelector } from 'react-redux';
import { getFormatedDate } from '../../utils/timeFormat';
import { Tuple } from '@reduxjs/toolkit';
// import { log } from 'console';
// import { MdDelete } from "react-icons/md";
// import {DropDownContainer as DropDown} from '../Dealer/Dealer.jsx'

export const travler = [["rapido", <RiEBikeLine />], ["metro", <FaTrain />], ["auto", <MdDirectionsCarFilled />], ["other", <FaRoute />]]
const TravelRoute = () => {

  const { recentRoutes, loading } = useSelector(state => state.travelRoute.addRoute)
  const { userInfo } = useSelector(state => state.auth)
  const [srhBox, setSrhBox] = useState({
    one: false,
    two: false
  })
  const { dispatch, navigate } = useReactHooks();
  const [formData, setFormData] = useState({
    whereFrom: "",
    whereTo: "",
    amount: '',
    travelBy: "metro",
    date: {
      type:"",
      dateValue:null
    },
    company: {
      cmpName: "",
      cmpId: ""
    }
  })
  const [isActive, setIsActive] = useState(0)

  const [isToggle,setIsToggle]=useState({first:0,second:0});
  const [routes,setRoutes]=useState([{

  }])

  const [walkingForm,setWalkingForm]=useState({
    whereFrom:"",
    whereTo:"",
    amount:"",
    date:new Date(),
    travelBy:"metro"
  })
  const onChangeHandler = (ele) => {

    const { name, value } = ele.target;
    if (name == "amount") {
      if (!isNaN(value))
        setFormData(prev => ({ ...prev, [name]: value }));
      return
    }
    setFormData(prev => ({ ...prev, [name]: value }));

  }

  const isValidate = () => {

    if (!formData.whereFrom) {
      toast.error("please enter location")
      return false
    }
    else if (!formData.whereTo) {
      toast.error("please enter destination location")
      return false
    }
    else if (!formData.company.cmpName) {
      toast.error("please choose company name")
      return false
    }
    else if (!formData.travelBy) {
      toast.error("please choose option from travelBY")
      return false
    }
    else if (!formData.amount) {
      toast.error("please enter amount")
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
  const reset = () => {
    setFormData({
       whereFrom: "",
    whereTo: "",
    amount: '',
    travelBy: "metro",
    date: {
      type:"",
      dateValue:{startDate:null,endDate:null}
    },
    company: {
      cmpName: "",
      cmpId: ""
    }
    })
  }

  const recentCmp = () => {
    if (userInfo?.company) {
      const result = userInfo?.company.find((ele) => { return userInfo?.recentCompany == ele.cmpName })
      setFormData(prev => ({ ...prev, company: { cmpId: result?._id, cmpName: result?.cmpName } }))

    }
  }

  const addroutes=()=>{
    if(walkingForm?.whereFrom && walkingForm?.whereTo){
      setRoutes((prev=>[...prev,{whereFrom:walkingForm?.whereFrom,whereTo:walkingForm?.whereTo,amount:walkingForm?.amount,date:new Date(),travelBy:walkingForm?.travelBy}]))
    }
  }

  const routesValueHandle=(e)=>{
    const {name,value}=e.target;

    setWalkingForm(prev=>({...prev,[name]:value}))
  }

  const interchangeHandler = () => {
    // if(formData.whereFrom)
    setFormData(prev => ({ ...prev, whereFrom: prev.whereTo, whereTo: prev.whereFrom }))
  }
 useEffect(()=>{
  recentCmp()
  },[userInfo?.recentCompany])

  useEffect(()=>{
    setFormData(prev=>({...prev,date:{dateValue:null,type:""}}))
  },[isToggle])

  return (
    <div className='flex flex-col w-full h-full'>
  {/*      <div className="primary-p">

      <DropDown 
    showChildren={<div>walking mode</div>} 
    hideChildren={<div className='page w-full min-h-[100px] border rounded-md p-2 flex  flex-col gap-1'>
       <span onFocus={() => { setIsActive(1); recentCmp() }} className="flex   flex-col w-full placeholder:capitalize">
            <input type="text" value={formData?.company?.cmpName} readOnly className="inputField" placeholder='choose company' />
            <span className={`w-full secondary-bg  relative z-[1]  ${isActive ? "max-h-[150px] opacity-100  px-2 py-1  " : "p-[0] max-h-[0px]  opacity-0 hidden "} transition-height duration-500 overflow-auto  flex flex-col gap-1   list-none`}>
              {

                userInfo && Array.isArray(userInfo?.company) && userInfo?.company.length != 0 ?
                  userInfo?.company.map((data, id) => {
                    return (
                      <li key={data?._id} className='border px-1 rounded-md center capitalize secondary-font cursor-pointer' onClick={() => { setFormData(prev => ({ ...prev, company: { cmpName: data?.cmpName, cmpId: data?._id } })); setIsActive(0) }}>{data?.cmpName}</li>
                    )
                  }) :
                  <span className="capitalize w-full min-h-[100px] center flex-col">
                    <p className='tertiary-font center'> company dosen't exist in own record</p>
                    <p className='center secondary-font'> please add company details after that fill entry</p>
                    <button onClick={() => navigate("/detail")} className='flex w-full gap-2 capitalize  cursor-pointer center max-w-[150px] mt-2 primary-font bg-sky-400 flex-1 max-h-[40px] rounded-md'><FaPlus /> <p>add</p></button>
                  </span>
              }</span>
          </span>
      <form className='flex gap-2 flex-wrap' ><input type="text" name={walkingForm?.whereFrom?"whereTo":"whereFrom"} className='inputField min-w-[150px]' placeholder={walkingForm?.whereFrom?"Destination place":"Starting place"} onChange={routesValueHandle} />
      <select name="travelBy" id="" value={walkingForm.travelBy} onChange={ routesValueHandle} className='inputField min-w-[100px] flex-1'>
              <option value="metro">metro</option>
              <option value="rapido">rapido</option>
              <option value="auto">auto</option>
              <option value="other">other</option>
            </select>
      <input type="number" onChange={routesValueHandle} className='inputField flex-1 w-full min-w-[100px]' placeholder='Amount'/>
      <button type='submit' className='flex-1  active:scale-75 transition-all duration-700 p-2 border capitalize text-slate-300 bg-sky-900/30 border-sky-400 rounded-md min-w-[100px] will-change-transform'>Add</button></form>

      <div className="">
        <Title title={"visited place"}/>
      </div>
    </div>}
    hideClass={"px-[2px]"}
    />
      </div> */ }
    
      <div className="primary-p " >
        <Title title={"Pick location"} />
        <span className='flex flex-col items-center gap-1 max-w-[400px]'>
          <span className='w-full relative '>
            <input type="text" onFocus={() => setSrhBox(prev => ({ ...prev, one: true }))
            } className={`inputField`} name='whereFrom' onChange={onChangeHandler}   value={formData.whereFrom} placeholder='where from' />
{
  formData?.whereFrom && 
 <span onClick={()=>setFormData(prev=>({...prev,whereFrom:""}))}  className='absolute size-[35px] transition-all duration-500 right-[20px] top-[50%] cursor-pointer translate-y-[-50%] center text-sky-400 text-lg'> <MdClear /></span>}
            {srhBox.one && <SrhContainer close={() => setSrhBox(prev => ({ ...prev, one: false }))} srhParam={formData.whereFrom} setValue={(value) => { setFormData(prev => ({ ...prev, whereFrom: value })); setSrhBox(prev => ({ ...prev, one: false })) }
            } />}
          </span>

          <LuArrowDownUp className='size-[25px] cursor-pointer tertiary-font p-1 text-xl' onClick={() => interchangeHandler()} />
          <span className='w-full relative '>

            <input type="text"  value={formData.whereTo} onChange={onChangeHandler} name='whereTo' onFocus={() => setSrhBox(prev => ({ ...prev, two: true }))} className={`inputField`} placeholder='where to' />
{
  formData?.whereTo &&
 
 <span onClick={()=>setFormData(prev=>({...prev,whereTo:""}))}  className={`$ease-in absolute  size-[35px] right-[20px] top-[50%] transition-all duration-500 cursor-pointer translate-y-[-50%] center text-sky-400 text-lg`}> <MdClear /></span>}
            {srhBox.two && <SrhContainer close={() => setSrhBox(prev => ({ ...prev, two: false }))} srhParam={formData.whereTo} setValue={(value) => { setFormData(prev => ({ ...prev, whereTo: value })); setSrhBox(prev => ({ ...prev, two: false })) }
            } />}
          </span>

          <span onFocus={() => { setIsActive(1); recentCmp() }} className="flex   flex-col w-full placeholder:capitalize">
            <input type="text" value={formData?.company?.cmpName} readOnly className="inputField" placeholder='choose company' />
            <span className={`w-full secondary-bg  relative z-[1]  ${isActive ? "max-h-[150px] opacity-100  px-2 py-1  " : "p-[0] max-h-[0px]  opacity-0 hidden "} transition-height duration-500 overflow-auto  flex flex-col gap-1   list-none`}>
              {

                userInfo && Array.isArray(userInfo?.company) && userInfo?.company.length != 0 ?
                  userInfo?.company.map((data, id) => {
                    return (
                      <li key={data?._id} className='border px-1 rounded-md center capitalize secondary-font cursor-pointer' onClick={() => { setFormData(prev => ({ ...prev, company: { cmpName: data?.cmpName, cmpId: data?._id } })); setIsActive(0) }}>{data?.cmpName}</li>
                    )
                  }) :
                  <span className="capitalize w-full min-h-[100px] center flex-col">
                    <p className='tertiary-font center'> company dosen't exist in own record</p>
                    <p className='center secondary-font'> please add company details after that fill entry</p>
                    <button onClick={() => navigate("/detail")} className='flex w-full gap-2 capitalize  cursor-pointer center max-w-[150px] mt-2 primary-font bg-sky-400 flex-1 max-h-[40px] rounded-md'><FaPlus /> <p>add</p></button>
                  </span>
              }</span>
          </span>
          <div className="sub flex w-full flex-wrap gap-1 ">

            {/* <input type="text" /> */}
            <select name="travelBy" id="" value={formData.travelBy} onChange={ onChangeHandler} className='inputField max-w-[200px] flex-1'>
              <option value="metro">metro</option>
              <option value="rapido">rapido</option>
              <option value="auto">auto</option>
              <option value="other">other</option>
            </select>
            <input type="number" value={formData.amount} onChange={onChangeHandler} name='amount' placeholder='Amount' className='inputField min-w-[50px] flex-1 ' />

          </div>

              <span className='flex w-full items-center gap-2 px-2 py-1 flex-wrap'>
                <Switch checked={isToggle.first} onclick={()=>setIsToggle(prev=>({...isToggle,first:!prev.first,second:0}))}/> 
                <p className='secondary-font capitalize'>update privious record</p>
                <span className={`${isToggle.first?"max-h-[100px] opacity-100":"max-h-0 opacity-0  invisible"} transition-all duration-700 w-full `}>
                  
                  {/* <DateField inputClassName={"text-slate-200"} onChange={(value)=>{setFormData(prev=>({...prev,date:{dateValue:value,type:"update"}}));console.log(value);
                }}  value={formData?.date?.dateValue} /> */}
                <SingleDateField  onChange={(value)=>{setFormData(prev=>({...prev,date:{dateValue:value,type:"update"}}));console.log(value);
                }}  value={formData?.date?.dateValue} 
               />
                
                </span>
              </span>

              {/* <SingleDateField onChange={(value)=>console.log(value)
              } /> */}
              {/* add new previous record */}
              <span className='flex w-full items-center gap-2 px-2  flex-wrap'>
                <Switch checked={isToggle.second} onclick={()=>setIsToggle(prev=>({...isToggle,first:0,second:!prev.second}))}/> 
                <p className='secondary-font capitalize'>add new privious record</p>
                <span className={`${isToggle.second?"max-h-[100px] opacity-100":"max-h-0 opacity-0 invisible"} transition-all duration-700 w-full `}><SingleDateField inputClassName={"text-slate-200"}  onChange={(value)=>{setFormData(prev=>({...prev,date:{dateValue:value,type:"new"}}))}}  value={formData?.date?.dateValue} /></span>
              </span>
          <div className="flex gap-2  center w-full">

            <Button className={"btn bg-sky-200 flex-1"} btnName={"reset"} onClick={() => reset()} />
            <Button className={"btn tertiary flex-1"} btnName={"Add"} onClick={() => onSubmitHandler()} />
          </div>


        </span>


      </div>

      <div className="primary-p w-full max-h-[500px] overflow-auto ">
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

          {
            recentRoutes && Array.isArray(recentRoutes) && recentRoutes.length != 0 ?
              [...recentRoutes].sort((a,b)=>new Date(b?.date) - new Date(a?.date)).map((travelRoutes, id) => {
                return (
                  <div className="" key={id}>
                    <Title title={getFormatedDate({ date: travelRoutes?.date, type: "date" })} />
                    {


                      travelRoutes.companies?.map((data, id) => {

                        return (
                          <div className="" key={id}>
                            <DropDownContainer company={data.company} travelDetails={data.travelDetails} cmpId={data.cmpId}  date={travelRoutes?.date} parentId={travelRoutes?.routeId} />
                          </div>
                        )
                      })
                    }

                  </div>
                )

              })
              : <div className="">
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
import { PiBuildingOfficeBold } from "react-icons/pi";
import { IoIosArrowUp } from "react-icons/io";
import Switch from '../../component/UI component/Switch';
import { DateField } from '../Payment/Payment';
import { BsDash } from "react-icons/bs";
import { SingleDateField } from '../statement/Statement.jsx';

export const SrhContainer = memo(({ srhParam, setValue, close }) => {
  const { dispatch } = useReactHooks();
  const { loading, data } = useSelector(state => state.travelRoute.addRoute.srhResult);
  useEffect(() => {
    const timout = setTimeout(() => {
      // console.log(srhParam);
      dispatch(searchPlace(srhParam))
    }, 500)

    return () => clearTimeout(timout)
  }, [srhParam])

  return (

    <div className="flex z-10 transition-all duration-500 flex-wrap p-2 gap-2 list-none secondary-bg min-h-[200px] pt-[30px] absolute w-full ">

      <span onClick={() => close()} className='absolute top-[5px] cursor-pointer right-[10px] size-[20px] light-bg center rounded-full '><FaXmark /></span>
      {loading?<span className='  center w-full secondary-font '>Loading...</span>:Array.isArray(data) && data.length != 0 ? data.map((place, id) => {
        return (
          <li key={place?._id} onClick={() => {setValue(place?.name);close()}} className='center bg-sky-200 min-w-[100px] opacity-80 cursor-pointer p-2 rounded-md capitalize  max-h-[50px] '>{place.name}</li>
        )
      }) : <div className='flex flex-col w-full gap-2 capitalize primary-font center'><p>place not exist in own record</p> <p className='tertiary-font'>please try manual</p>
      </div>}
    </div>
  )
})


 const DropDownContainer = memo(({ travelDetails,parentId, company = "company name",cmpId ,date}) => {
  const [isActive, setIsActive] = useState(false)
  const {dispatch}=useReactHooks();
  return (
    <span className=" flex no-scrollbar flex-col w-full gap-2  max-h-[500px] overflow-auto">
      {/* show */}
      <span onClick={() => setIsActive(prev => !prev)} className="flex cursor-pointer relative text-slate-800  items-center sticky top-0 z-[2] gap-2 capitalize rounded-md p-2 bg-sky-200 w-full">

        <PiBuildingOfficeBold /> {company}

        <span className={`absolute right-[20px] top-[50%] translate-y-[-50%] ${isActive ? "rotate-180" : "rotate-0"} transition-all duration-700`} ><IoIosArrowUp /></span>
      </span>
      {/*hide*/}

      <span className={`${isActive ? "max-h-[400px] pb-2 opacity-100 " : "max-h-0 opacity-0  pb-0"} transition-all duration-700 t-container flex  px-2 gap-2 flex-col `}>
        {
          travelDetails.map((data, id) => {
            return (
              <span className='t-body flex items-center flex-wrap relative ' key={data?._id}>
                <span className='flex items-center flex-wrap flex-1  gap-x-2 gap-y-1  min-w-[250px]'>
                  {travler.map((items, indx) => {
                    if (items[0] == data.travelBy)
                      return (<span key={indx} className='text-yellow-900'>{items[1]}</span>)
                  })}
                  <span className='flex gap-x-2 flex-1 items-center capitalize flex-wrap'>
                    <p>{data?.whereFrom}</p><FaArrowRight className='text-xs font-normal mt-1' /> <p>{data?.whereTo}</p>
                  </span>

                </span>
                <span className='flex items-center text-sm flex-1 min-w-[100px] gap-1'>
                  <FaIndianRupeeSign className='text-sm mt-1' />{data?.amount}</span>
                  {/* deleteRoute({cmpId,routeId:data?._id,date,parentId}) */}
                  <span onClick={()=>{dispatch(setDelStateData({detail:{parentId,cmpId,travelDetails:data},type:"add"}));dispatch(setAlert())}} className=' tertiary size-[25px] absolute right-[-8px] cursor-pointer secondary-font top-[50%] translate-y-[-50%] center rounded-full transition-all duration-700 active:scale-75'><BsDash /></span>

                <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'>{getFormatedDate({ date: data?.date, type: "time" })}</p>
              </span>
            )
          })
        }


      </span>


    </span>
  )
})

export default TravelRoute