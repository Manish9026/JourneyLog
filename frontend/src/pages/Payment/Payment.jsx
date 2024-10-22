import React, { memo, useState } from 'react'
import { FaSearch, FaPlus, FaArrowDown, FaChevronDown } from 'react-icons/fa'
import Title from '../../component/Title'
import InputField from '../../component/UI component/InputField'
import Datepicker from "react-tailwindcss-datepicker";
import useReactHooks from '../../custom-hooks/useReactHooks'
import { payment } from '../../slices/paymentSlice';
import { useSelector } from 'react-redux';
import { PiBuildingOfficeBold } from 'react-icons/pi';
import { IoIosArrowUp } from 'react-icons/io';
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineUpdate } from "react-icons/md";
import { FaIndianRupeeSign, FaRupeeSign } from 'react-icons/fa6';
import { rupee, travel, walet } from '../../assets/icons';
import {getFormatedDate} from '../../utils/timeFormat'

const Payment = () => {

    const [formData, setFormData] = useState({
        company: { cmpName: "", cmpId: "" },
        startFrom:{startDate:null,endDate:null},
        startTo:{startDate:null,endDate:null},
        amount: ""
    })
    const {recentPayment}=useSelector(state=>state.payment)
    const [isSelected, setIsSelected] = useState(false)
    const { dispatch, navigate } = useReactHooks();
    const { userInfo } = useSelector(state => state.auth)
    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(payment(formData))
        setFormData({
        company: { cmpName: "", cmpId: "" },
        startFrom:{startDate:null,endDate:null},
        startTo:{startDate:null,endDate:null},
        amount: ""
    })
    }

    return (
        <div className='w-full primary-p gap-2 flex flex-col'>

            <div className=" flex flex-col gap-2">
                <Title title={"add payment"} />
                <form className='flex flex-col gap-2' onSubmit={submitHandler}>

                    <span className='flex flex-col' onClick={()=>setIsSelected(prev=>!prev)}>
                        <label htmlFor='search' className='flex items-center  p-1 bg-sky-200/80 w-full min-h-[40px] overflow-hidden rounded-[5px]'>
                            <input type='text'  placeholder='Pick Company' id='search' value={formData?.company?.cmpName} onChange={(e) => ""} className=" placeholder:text-blue-900 flex outline-none min-w-[100px] bg-transparent px-2 h-full  flex-1 w-full" />
                            <span onClick={""} className='text-[15px] min-w-[40px] text-sky-400 center  h-full'>
                                <FaChevronDown className={` ${isSelected?"rotate-180":"rotate-0"} transition-all duration-700 text-blue-950 `} />
                            </span>
                        </label>
                        <span className={`w-full secondary-bg  relative z-[1]  ${isSelected ? "max-h-[250px] opacity-100  px-2 py-1  " : "p-[0] max-h-[0px]  opacity-0 hidden "} transition-height duration-700 overflow-auto  flex flex-col gap-1   list-none`}>
                            {

                                userInfo && Array.isArray(userInfo?.company) && userInfo?.company.length != 0 ?
                                    userInfo?.company.map((data, id) => {
                                        return (
                                            <li key={data?._id} className='border px-1 rounded-md center capitalize secondary-font cursor-pointer' onClick={() => { setFormData(prev => ({ ...prev, company: { cmpName: data?.cmpName, cmpId: data?._id } })); setIsSelected(0) }}>{data?.cmpName}</li>
                                        )
                                    }) :
                                    <span className="capitalize w-full py-2 min-h-[100px] center flex-col">
                                        <p className='tertiary-font center text-center'> company dosen't exist in own record</p>
                                        <p className='center secondary-font text-center'> please add company details after that fill entry</p>
                                        <button onClick={() => navigate("/detail")} className='flex w-full gap-2 capitalize  cursor-pointer center max-w-[150px] mt-2 primary-font bg-sky-400 flex-1 max-h-[40px] rounded-md'><FaPlus /> <p>add</p></button>
                                    </span>
                            }</span>
                    </span>

                    <span className='flex items-center flex-wrap primary-font gap-2 w-full'>
                        <DateField title={" from"} value={formData.startFrom} onChange={(value) => setFormData((prev) => ({ ...prev, startFrom: value }))} />
                        <DateField title={" to"} value={formData.startTo} onChange={(value) => setFormData((prev) => ({ ...prev, startTo: value }))} />

                        <input type="number" className='inputField max-w-[200px]' value={formData.amount} onChange={(e) => { if (!isNaN(e.target.value)) setFormData(prev => ({ ...prev, amount: e.target.value })) }} placeholder='Amount ' />
                    </span>

                    <span className='flex w-full justify-center items-center'>
                        <button className=' btn rounded-md capitalize tertiary primary-font px-2 py-1 flex-1  max-w-[250px] transtition-all duration-700 active:scale-70'>  payment</button>
                    </span>






                </form>

            </div>
            <div className="">
                <Title title={"recent payments"} />
                <span className="flex flex-col gap-2">


                  {
                    Array.isArray(recentPayment.data) && recentPayment.data.length!=0 ?recentPayment.loading?<paymentSkelton/>: recentPayment.data.map((pay,id)=>{
                        return(
                            <DropDownContainer  paymentDetails={pay} />
                        //     <ul key={pay?._id} className=' flex flex-wrap bg-sky-200 px-2 py-1 w-full rounded-md'>
                        //     <li className="p-box">
        
                        //         <PiBuildingOfficeBold /> {pay?.company?.cmpName}
        
        
                        //     </li>
                        //     <li className='p-box'><MdOutlineUpdate />{ new Date(pay?.createdAt).toDateString()}</li>
        
                        //     <li className="p-box">
        
                        //         <MdOutlineDateRange />
                        //         <p>{new Date(pay?.startFrom).toLocaleDateString()}</p>
                        //         <p>{new Date(pay?.startTo).toLocaleDateString()}</p>
        
                        //     </li>
                        //     <li className="p-box"><FaIndianRupeeSign />{pay?.amount.payAmount}</li>
                        //     <li className="p-box">remaining<FaIndianRupeeSign /> {pay?.amount.NewRemainingAmount}</li>
        
                        // </ul>
                        )
                    })
                     :""
                  }
                </span>
            </div>


        </div>
    )
}

export const DateField = memo(({ title, className, value, onChange }) => {
    
    return (
        <span className={`min-w-[200px] max-w-[300px] flex-1  ${className}`}>
            <Title title={title} className={"px-2"} />
            <Datepicker
             
                selected={value}
                useRange={false}
                asSingle={true}
                onChange={onChange}
               value={value}
               inputClassName={"w-full px-4 py-2 border border-gray-300 bg-[#1e293b] rounded-md"}
            />
        </span>
    )
})

const DropDownContainer = memo(({ paymentDetails}) => {
    const [isActive, setIsActive] = useState(false)
    const {dispatch}=useReactHooks();
    
    return (
      <span key={paymentDetails._id} className=" flex no-scrollbar flex-col w-full gap-2  max-h-[500px] overflow-auto">
        {/* show */}
        <Title title={getFormatedDate({date:paymentDetails?.createdAt,type:"date"})}/>
        <span onClick={() => setIsActive(prev => !prev)} className="list-none flex cursor-pointer relative text-slate-800 justify-between  items-center sticky top-0 z-[2] gap-2 capitalize rounded-md p-2 bg-sky-200 w-full">
  
  <li className='flex items-center gap-1'><PiBuildingOfficeBold /> {paymentDetails?.company?.cmpName}</li>
          
          <li className='flex gap-1 min-w-[100px]'><img src={rupee} alt="" /> {paymentDetails?.amount?.payAmount}</li>
          <span className={`absolute right-[20px] top-[50%] translate-y-[-50%] ${isActive ? "rotate-180" : "rotate-0"} transition-all duration-700`} ><IoIosArrowUp /></span>
        </span>
        {/*hide*/}
  
        <span className={`${isActive ? "h-[100px] pb-2 opacity-100 " : "h-0 opacity-0 overflow-hidden  p-0"} transition-all t-body duration-700 t-container flex  px-2 gap-2 flex-col `}>
        
        <span className='t-body flex items-center list-none flex-wrap relative ' >
             
             <li className='p-box'><MdOutlineDateRange/> <p>{new Date(paymentDetails?.startFrom).toLocaleDateString()}</p>-<p>{new Date(paymentDetails?.startTo).toLocaleDateString()}</p></li>
             <li className='p-box'><MdOutlineUpdate/> <p>{ new Date(paymentDetails.createdAt).toDateString()}</p></li>
             <li className='p-box'><img src={travel} alt="" /> <p>{paymentDetails.amount.travelAmount}</p><FaIndianRupeeSign className='text-[12px]'/></li>
             <li className='p-box'><img src={walet} alt="" /><p>{paymentDetails.amount.NewRemainingAmount>=0?'+'+ paymentDetails.amount.NewRemainingAmount:'-'+paymentDetails.amount.NewRemainingAmount}</p><FaIndianRupeeSign className='text-[12px]'/></li>


                </span>
  
  
        </span>
  
  
      </span>
    )
  })
const paymentSkelton=()=>{
    return(
        Array(2).fill(2).map((_,indx)=>{
            return(
                <ul key={indx} className=' flex flex-wrap secondary-bg gap-2 px-2 py-2 w-full rounded-md'>
                {
                    Array(4).fill(4).map((_,id)=>{
                        return(
                            <li key={id} className="p-box">

                    <p className="sixe-[10px] inner-shade rounded-full"></p>
                    <p className='inner-shade p-[5px] max-w-[300px] flex-1 rounded-md'> </p>


                </li>
                        )
                    })
                }
              

            </ul>
            )
        })
    )
}

const Dot=()=>{
    return(
        <>
        <style>
            {
                `
.loader.--8::before,
.loader.--8::after {
	width: var(--size-dot);
	height: var(--size-dot);
	border-radius: 50%;
	background-color: var(--color);
}

.loader.--8::before {
	opacity:.8;
	animation: loader-8-2 0.8s cubic-bezier(0.06, 0.01, 0.49, 1.18) infinite;
}
@keyframes loader-8-2 {
	0%, 100% {
		opacity: 0;
	}
	
	33% {
		opacity: 0.9;
	}
	
	0% {
		transform: scale(0);
	}
	
	100% {
		transform: scale(4);
	}
}



                `
            }
        </style>
        
        
        </>
    )
}
export default Payment