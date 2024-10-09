import React, { useState } from 'react'
import Title from '../../component/Title'
import { Button } from '../../component/UI component/Button'
import { FaPlus } from 'react-icons/fa'
import useReactHooks from '../../custom-hooks/useReactHooks'
import { useSelector } from 'react-redux'
import { addCompany } from '../../slices/detailSlice'

const Detail = () => {
    const {company}=useSelector(state=>state.detail)
    const [cmpName,setCmpName]=useState("");
    const {dispatch}=useReactHooks();
  return (
    <div className='flex flex-col w-full primary-p gap-2'>

        <div className="flex flex-col gap-1 w-full">
            <Title title={"add company"}/>
            <span className='flex gap-1 '>
                <input type="text" className='inputField' onChange={(e)=>setCmpName(e.target.value)} />
                
                <span  onClick={()=>dispatch(addCompany(cmpName))} className="size-[40px]  rounded-md primary-font center tertiary"><abbr title="Add company"><FaPlus/></abbr></span>
                
            </span>
        </div>
        <div className="flex flex-col">
            <Title title={"added companies"}/>
            <ul className=' flex flex-col gap-1 rounded-md'>
                {
                    company?.data && company?.data.length!=0? 
                    [...company?.data].sort((a,b)=>new Date(b.createdAt) - new Date(a.createdAt)).map((item,id)=>{
                        return(
                            <li key={item?._id} className='bg-sky-200 text-slate-900 capitalize px-1 rounded-sm'>{item?.cmpName}</li>
                        )
                    })
                    :

                    <div className="center p-3">No records </div>
                }
            </ul>
        </div>
    </div>
  )
}

export default Detail