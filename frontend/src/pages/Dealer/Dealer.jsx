import React, { memo, useCallback, useEffect, useState } from 'react'
import useReactHooks from '../../custom-hooks/useReactHooks'
import { FaIndianRupeeSign, FaPlus, FaPrint, FaXmark } from 'react-icons/fa6'
import { FaArrowRight, FaSearch } from 'react-icons/fa'
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
import { useGetDealerDetailsQuery, useLazyGetDealerDetailsQuery } from '../../services/dealer'
import Lottie from 'lottie-react'
import print from '../../assets/animations/print.json'
import { exportExcel } from '../../utils/printExcelFile'
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

      showclassName=""
      hideclassName="px-[0px]"  
      active={false}      

      />
      <Statement company={company}/>

      
    </div>
  )
}

const Statement=memo(({company})=>{
  const [filters, setFilters] = useState({
    shopName: "",
    shopOwner: "",
    shopAddress: "",
    cmpId:company?.cmpId,
});
  const [refetch, { data, error, isLoading }] = useLazyGetDealerDetailsQuery(filters)
  const [srhParam,setSrhParam]=useState("")
  
  useEffect(()=>{
    if(company?.cmpId){
    setFilters(prev=>({...prev,cmpId:company?.cmpId}));
    refetch({cmpId:company?.cmpId});}
  },[company])

  useEffect(()=>{
    const timeout =setTimeout(() => {

      if(isNotEmpty(srhParam)){
        refetch({type:"multipleSrh",query:srhParam})


      }else{
        refetch({cmpId:filters.cmpId})
      }
      
    }, 500);
   
    return ()=>clearTimeout(timeout)

  },[srhParam])

  const onFetch=(e)=>{
    e.preventDefault();
    refetch({type:"multipleSrh",query:srhParam})

  }
  return(
    <span className='flex flex-col gap-2 pb-20'>

<form className="w-full mx-auto flex-1">   
    <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
    <label htmlFor='search' className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">

          <FaSearch className='text-slate-400'/>
            {/* <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" strokeLinejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg> */}
        </div>
        <input  onChange={(e)=>setSrhParam(e.target.value)} value={srhParam} type="search" id="search" className=" block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search shopOwner,Area, shopName..." required />
        
        <span  className="text-white absolute end-2.5 bottom-2.5 gap-1 flex items-center justify-end min-w-[200px] min-h-[20px]">
       {isNotEmpty(srhParam) && <FaXmark className='
       cursor-pointer ' onClick={()=>setSrhParam("")}/>}
        {/* <button onClick={onFetch} type="submit" className="text-white  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button> */}

        <span onClick={()=>exportExcel(data?.data?.records)} className="center top-1 cursor-pointer fadeIn  px-4 py-2.5 rounded-md min-w-[50px] min-h-[40px]  relative  overflow-hidden border  ">

        <LottieAnimation loop={false} file={print} className={"ml-3 mt-2"}/>
        </span>
        </span>
    </label>
</form>


<div className="relative overflow-x-auto shadow-md rounded-lg">

   

<table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" className="p-4">
                    <span className="flex items-center">
                        <input id="checkbox-all-search" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                        <label htmlFor="checkbox-all-search" className="sr-only">checkbox</label>
                    </span>
                </th>
                <th scope="col" className="col3">
                    Shop name & Owner ({data?.data?.count})
                </th>
                <th scope="col" className="col3">
                    area
                </th>
                <th scope="col" className="col3">
                    company
                </th>
                <th scope="col" className="col3">
                    Mobile no
                </th>
                <th scope="col" className="col3">
                    GSt
                </th>
                <th scope="col" className="col3">
                    Address
                </th>
            </tr>
        </thead>
        <tbody className=''>
          {isLoading && <tr   className='w-4 p-4 center w-full text-center'><td colSpan={2} className='center  text-center' >loading....</td></tr>}
          {
          isNotEmpty(data?.data?.records) ? data?.data?.records.map((body,index)=>{
            return (
        
        <tr key={body?._id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
        <td className="w-4 p-4">
            <span className="flex items-center">
                <input id="checkbox-table-search-1" type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <label htmlFor="checkbox-table-search-1" className="sr-only">checkbox</label>
            </span>
        </td>
        <th scope="row" className="col2 text-gray-900 whitespace-nowrap dark:text-white">
            <span className="flex flex-col ps-1">
                <span className="text-base font-semibold">{body?.shopName}</span>
                <span className="font-normal text-gray-500">{body?.shopOwner}</span>
            </span>  
        </th>
        <td className="col2">
            {body?.area}
        </td>
        <td className="col2">
            {body?.company?.cmpName}
        </td>
        <td className="col2">
            <span className="flex items-center">
                {/* <span className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></span>  */}
                {body?.mobNo || "--"}
            </span>
        </td>
        <td className="col2">
        {body?.withGST?"Yes" : "no"}

            {/* <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit user</a> */}
        </td>
        <td className="col2">
        {body?.shopAddress ||  "--"}

        </td>
    </tr>
    

            )
          }):


       isLoading? <tr   className='w-4 p-4 center w-full text-center'><td colSpan={2} className='center  text-center' >loading....</td></tr>:  <span className='min-w-100 min-h-20 center min-w-full capitalize center '>
          <p className='mx-auto absolute left-1/2 translate-1/2 transform'>record not found</p>
         </span>
          }
           </tbody>
    </table>
   
</div>


    </span>
  )
})
const DealerForm=memo(( {company})=>{

  const [refetch] = useLazyGetDealerDetailsQuery();
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

      if(!/^\d*$/.test(value) || value.length>10){
       return setErrorLog(prev=>({...prev,mobNoError:{...prev.mobNoError,message:"Mobile number must be 10 digits and contain only numbers!",status:true}}));
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
    
    console.log(formData);
    
    if(!isNotEmpty(shopName))
      return  toast.error("Shop name is required!");
    if(!isNotEmpty(shopAddress))
      return  toast.error("shop address is required!");
    if(!isNotEmpty(area))
      return  toast.error("area name is required!");

    

    await axios.post(`${url}/dealer/addDealer`,formData,{withCredentials:true}).then((res)=>{
      // console.log("res",res.status);

      if(res?.data?.status)
      if(res?.data?.status){
        reset()
        refetch({cmpId:formData?.company?.cmpId})
        return toast.success(res?.data?.message)
      }
    }).catch((error)=>{
      // console.log(error?.response?.data?.error);
      toast.error(error?.response?.data?.error)
      
    })

    


    // if(formDa)
  }
  const reset=()=>{
    return setFormData(prev=>(
      { ...prev,
        shopName:"",
        shopOwner:"",
        mobNo:"",
        area:"",
        shopAddress:"",
        withGST:false,

      }
    )
      
    )
  }
  return(
    <span className='page border p-2 gap-2 flex flex-col min-h-[100px] flex-1 rounded-[5px]'> 
    <input type="text" value={formData?.shopName} className='inputField' name='shopName' onChange={(e)=>formHandleChange(e.target)} placeholder='Shop Name' />
    <input type="text" value={formData?.shopOwner} className='inputField' name='shopOwner' onChange={(e)=>formHandleChange(e.target)} placeholder='Dealer Name' />

    <input type="number" defaultValue={formData?.mobNo} value={formData?.mobNo} name="mobNo"  onChange={(e)=>{formHandleChange(e.target);
    }}  id="" placeholder='Ex. +919940569074'  className='inputField'/>
   {errorLog.mobNoError.status && <span className='text-sky-500'>{ errorLog.mobNoError.message}</span>}
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
  },[userInfo])
  
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
                                setCompany(prev => ({ ...prev,  cmpName: data?.cmpName, cmpId: data?._id }));  }}>{data?.cmpName}</li>
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

export const DropDownContainer = memo(({ hideChildren,hideClass,showClass,showChildren,active}) => {
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


const LottieAnimation=({file,className,loop})=>{
  return(
    <Lottie  className= {`${className} absolute size-[200px]`} animationData={file} loop={loop} />
  )
}



//  {/* <!-- Edit user modal --> */}
//  <div id="editUserModal" tabindex="-1" aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 items-center justify-center hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
      
//  <div className="relative w-full max-w-2xl max-h-full">
//      {/* <!-- Modal content --> */}
//      <form className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
//          {/* <!-- Modal header --> */}
//          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600 border-gray-200">
//              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
//                  Edit user
//              </h3>
//             <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="editUserModal">
//              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
//              </svg>
//              <span className="sr-only">Close modal</span>
//          </button>
//          </div>
//          {/* <!-- Modal body --> */}
//          <div className="p-6 space-y-6">
//              <div className="grid grid-cols-6 gap-6">
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="first-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
//                      <input type="text" name="first-name" id="first-name" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Bonnie" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="last-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
//                      <input type="text" name="last-name" id="last-name" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Green" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
//                      <input type="email" name="email" id="email" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="example@company.com" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="phone-number" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
//                      <input type="number" name="phone-number" id="phone-number" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g. +(12)3456 789" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="department" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Department</label>
//                      <input type="text" name="department" id="department" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Development" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="company" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Company</label>
//                      <input type="number" name="company" id="company" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="123456" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="current-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Current Password</label>
//                      <input type="password" name="current-password" id="current-password" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required=""/>
//                  </div>
//                  <div className="col-span-6 sm:col-span-3">
//                      <label for="new-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
//                      <input type="password" name="new-password" id="new-password" className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required=""/>
//                  </div>
//              </div>
//          </div>
//          {/* <!-- Modal footer --> */}
//          <div className="flex items-center p-6 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
//              <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save all</button>
//          </div>
//      </form>
//  </div>
// </div>
export default Dealer