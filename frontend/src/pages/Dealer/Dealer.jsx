import React, { memo, useCallback, useEffect, useState } from 'react'
import useReactHooks from '../../custom-hooks/useReactHooks'
import { FaIndianRupeeSign, FaPlus } from 'react-icons/fa6'
import { FaArrowRight } from 'react-icons/fa'
import { BsDash } from 'react-icons/bs'
import { IoIosArrowUp } from 'react-icons/io'
import { PiBuildingOfficeBold } from 'react-icons/pi'
import {isNotEmpty,isMobNo} from '../../utils/isNotEmpty'
import("./style.scss")
import {toast} from 'react-toastify';
import { useSelector } from 'react-redux'
import { TiTick } from 'react-icons/ti'
import axios from 'axios'
import { url } from '../../utils/url'
import { SrhContainer } from '../travelRoute.jsx/TravelRoute'


const Dealer = () => {
 const [company,setCompany]=useState({cmpName:"",cmpId:""})


  return (
    <div className='primary-px flex-col flex gap-2 border-t'>
      <span className="flex-1 text-sky-200 p-2">
      <h3>Dealer Info</h3>
      </span>
      <CompanyOption setCompany={setCompany} company={company}/>
      <DropDownContainer
      
      showChildren={
      
      <span className=' flex center gap-2'>
        <PiBuildingOfficeBold/>
        Add dealer Detail
      </span>}
      hideChildren={ <DealerForm company={company}/>
    }

      showClass=""
      hideClass="px-[0px]"  
      active={true}      

      />
      <DropDownContainer/>

      
    </div>
  )
}
const DealerForm=memo(( {company})=>{

  const [formData,setFormData]=useState({
    shopName:"",
    shopOwner:"",
    mobNo:"",
    area:"",
    shopAddress:"",
    withGST:false,
    company:{
      cmpId:"",
      cmpName:""
    }
  })
  const [srhBox,setSrhBox]=useState(false);
  const [errorLog,setErrorLog]=useState({
    mobNoError:{message:"",status:false}
  })
  useEffect(() => {
    setFormData(prev=>({...prev,company}))
  }, [company]);

  const formHandleChange=async(event)=>{
    const {name,value}=event;

    if(name=="mobNo" ){

      if(value===undefined || !isMobNo(value) || !value){
       return setErrorLog(prev=>({...prev,mobNoError:{...prev.mobNoError,message:"Mobile number must be 10 digits and contain only numbersr",status:true}}));
      }else{
        setErrorLog(prev=>({...prev,mobNoError:{...prev.mobNoError,message:"",status:false}}));
      }
    }
    if(name=="area")
      setSrhBox(prev=>!prev)



    setFormData(prev=>(
     { ...prev,[name]:value}
    ))
  }
  const onHadleSubmit=async()=>{
    const {shopName,shopAddress,shopOwner,area,withGST,mobNo}=formData;
    
    
    if(!isNotEmpty(shopName))
      return  toast.error("Shop name is required!");
    if(!isNotEmpty(shopAddress))
      return  toast.error("shop address is required!");
    if(!isNotEmpty(area))
      return  toast.error("area name is required!");

    console.log(formData);
    

    await axios.post(`${url}/dealer/addDealer`,formData,{withCredentials:true}).then((res)=>{
      // console.log("res",res.status);

      if(res?.data?.status)
      if(res?.data?.status){
        reset()
        return toast.success(res?.data?.message)
      }
    }).catch((error)=>{
      // console.log(error?.response?.data?.error);
      toast.error(error?.response?.data?.error)
      
    })

    


    // if(formDa)
  }
  const reset=()=>{
    return setFormData(
      {
        shopName:"",
        shopOwner:"",
        mobNo:"",
        area:"",
        shopAddress:"",
        withGST:false,
        company:{
          cmpId:"",
          cmpName:""
        }
      }
    )
  }
  return(
    <span className='page border p-2 gap-2 flex flex-col min-h-[100px] flex-1 rounded-[5px]'> 
    <input type="text" value={formData?.shopName} className='inputField' name='shopName' onChange={(e)=>formHandleChange(e.target)} placeholder='Shop Name' />
    <input type="text" value={formData?.shopOwner} className='inputField' name='shopOwner' onChange={(e)=>formHandleChange(e.target)} placeholder='Dealer Name' />

    <input type="number" defaultValue={formData?.mobNo} name="mobNo"  onChange={(e)=>{formHandleChange(e.target);
    }}  id="" placeholder='Ex. +919940569074'  className='inputField'/>
   {errorLog.mobNoError.status && <span>{ errorLog.mobNoError.message}</span>}
    <span className="relative">
    <input type="text" name='area' value={formData?.area} className='inputField relative z-[4]' onChange={(e)=>formHandleChange(e.target)}  placeholder='Area' />
    {/* <span className="w-full  left-0 top-[40px] absolute z-[1] min-h-[100px] bg-slate-600 center hidden">

      near area
      
    </span> */}
   { srhBox && <SrhContainer srhParam={formData?.area} setValue={(value)=>setFormData(prev=>({...prev,area:value?.trim()}))} close={()=>setSrhBox(prev=>!prev)}/>}
    </span>

    {/* <span className=""> */}
      <label htmlFor="withGST" className='flex will-change-transform fadeIn cursor-pointer items-center inputField gap-2 flex-1'>
      <input type="checkbox" name="withGST" onChange={(e)=>{  setFormData(prev=>(
     { ...prev,[e.target.name]:e.target.checked}
    ));
      }} id="withGST" checked={formData.withGST}/>
        GST available
      </label>
     
    {/* </span> */}
   

    <textarea value={formData?.shopAddress} name="shopAddress" id="" onChange={(e)=>formHandleChange(e.target)}  className='inputField' placeholder='shop addess'></textarea>

    <span className="flex gap-2 text-slate-200  ">
      <button onClick={()=>reset()} className="flex-1 p-2 bg-rose-400 active:scale-75 will-change-transform transition-all duration-700 capitalize rounded-md min-w-[100px]">reset</button>
      <button className="flex-1  active:scale-75 transition-all duration-700 p-2 border capitalize bg-sky-900/30 border-sky-400 rounded-md min-w-[100px] will-change-transform" onClick={onHadleSubmit} >submit</button>
    </span>
  </span>
  )
})
const CompanyOption=memo(({setCompany,company})=>{
  const { userInfo } = useSelector(state => state.auth);
  useEffect(()=>{
    if (userInfo?.company) {
      const result = userInfo?.company.find((ele) => { return userInfo?.recentCompany == ele.cmpName })
      setCompany(prev => ({ ...prev, cmpId: result?._id, cmpName: result?.cmpName  }))

    }
  },[])
  
    return(


      <DropDownContainer

      showChildren={ <span className='flex items-center justify-start flex-wrap'>
        <h6 className='text-[.8rem] font-semibold w-full'>selected company</h6>
 <input type="text" value={company?.cmpName} readOnly className="bg-transparent outline-none pointer-events-none cursor-pointer" placeholder='choose company' />
 <TiTick className='text-green-900' />
      </span>
       }
      hideChildren={

        <span className={`w-full secondary-bg    hidden transition-height duration-500 overflow-auto  flex flex-col gap-1   list-none`}>
                    {
        
                        userInfo && Array.isArray(userInfo?.company) && userInfo?.company.length != 0 ?
                          userInfo?.company.map((data, id) => {
                            return (
                              <li key={data?._id} className='border px-1 rounded-md center capitalize secondary-font cursor-pointer' onClick={(e) => { 
                                e.stopPropagation();
                                setCompany(prev => ({ ...prev,  cmpName: data?.cmpName, cmpId: data?._id })); setIsActive(prev=>!prev); }}>{data?.cmpName}</li>
                            )
                          }) :
                          <span className="capitalize w-full min-h-[100px] center flex-col">
                            <p className='tertiary-font center'> company dosen't exist in own record</p>
                            <p className='center secondary-font'> please add company details after that fill entry</p>
                            <button onClick={() => navigate("/detail")} className='flex w-full gap-2 capitalize  cursor-pointer center max-w-[150px] mt-2 primary-font bg-sky-400 flex-1 max-h-[40px] rounded-md'><FaPlus /> <p>add</p></button>
                          </span>
                      }</span>
      }
      />
 
    )
  }
)

const DropDownContainer = memo(({ hideChildren,hideClass,showClass,showChildren,active}) => {
  const [isActive, setIsActive] = useState(active)
  const {dispatch}=useReactHooks();
  return (
    <span className=" flex no-scrollbar flex-col w-full gap-2  max-h-[500px] overflow-auto">
      {/* show */}
      <span onClick={() => setIsActive(prev => !prev)} className={`${showClass} flex cursor-pointer relative text-slate-800  items-center sticky top-0 z-[2] gap-2 capitalize rounded-md p-2 bg-sky-200 w-full`}>

        {/* <PiBuildingOfficeBold />  */}
        {showChildren}

       <span className={`absolute right-[20px] top-[50%] translate-y-[-50%] ${isActive ? "rotate-180" : "rotate-0"} transition-all duration-700`} ><IoIosArrowUp /></span>
      </span>
      {/*hide*/}

      <span className={`${isActive ? "max-h-[400px] pb-2 opacity-100 " : "max-h-0 opacity-0  pb-0"}     transition-all duration-700  flex  px-2 gap-2 flex-col ${hideClass}`}>
      
     {hideChildren}

      </span>


    </span>
  )
})
export default Dealer