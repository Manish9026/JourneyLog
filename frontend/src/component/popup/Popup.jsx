import React, { Children, forwardRef, useEffect, useState } from 'react'
import { FaXmark } from 'react-icons/fa6'
import './style.scss'
const Popup = forwardRef(({children, iconBox={},active,title,bodyClass,boxClass=""},ref) => {
    const [isActive,setIsActive]=useState(false);
    const [width,setWidth]=useState(window.innerWidth)
    useEffect(()=>{
        setIsActive(active);
    },[active])

  return (
    <div onClick={(e)=> {e.stopPropagation();setIsActive(0)}} className={`${bodyClass}  ${width<=700 && "bg-transparent"}  ${isActive?" visible opacity-100 z-[100]":" opacity-[50] invisible"} flex items-center justify-center tansition-all duration-700 left-0 fixed w-full top-0  bg-slate-300/20 min-h-full `}>
{window.innerWidth>=700?
    <div className={`${boxClass} ${isActive?"scale-100 opacity-100 visible ease-out":"scale-[.2] opacity-0 invisible ease-in"} tansition-all duration-700 box p-1 absolute min-w-[300px] relative  bg-blue-500 min-h-[200px] rounded-md`}>
        <span  className={`${iconBox} relative flex`}>
            <h5>title</h5>
        <span onClick={()=>setIsActive(prev=>!prev)} className=' cursor-pointer size-[25px] bg-slate-500 center absolute right-1 top-1 rounded-full '> <FaXmark/></span>
        </span>

        <span className='w-full h-full'>
            {children}
        </span>
        

    </div> :
    <div ref={ref} onClick={(e)=>e.stopPropagation()} className={` ${boxClass} ${isActive?"bottom-[0]  opacity-100":"bottom-[-100vh] opacity-50"} transition-all duration-1000 ease box  p-1 absolute w-full   bg-blue-500    min-h-[200px]  `} >

        <span  className={` relative flex  invisble`}>
            <h5>{title}</h5>
        <span style={iconBox} className={`  cursor-pointer  size-[25px] bg-slate-500 center  absolute right-1 top-1 bg-slate-200/20 text-blue-200 rounded-full z-[30] `} onClick={()=>setIsActive(prev=>!prev)}> <FaXmark/></span>
        </span>

        <span className='flex  left-0 top-0 absolute  w-full h-full'>
            {children}
        </span>
        

    </div>}


    </div>
  )
})

export default Popup