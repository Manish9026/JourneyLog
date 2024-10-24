import React, { useCallback, useEffect, useRef, useState } from 'react'
import Popup from './Popup'
import { useSelector } from 'react-redux';
import Title from '../Title';
import { FaArrowRight } from 'react-icons/fa';
import { FaIndianRupeeSign } from 'react-icons/fa6';
import { travler } from '../../pages/travelRoute.jsx/TravelRoute';
import { setEditAlert, setEditData, updateTravelRoute } from '../../slices/travelRouteSlice';
import useReactHooks from '../../custom-hooks/useReactHooks';
import DelAlert from '../DelAlert';
import { payment } from '../../slices/paymentSlice';


const PopupChildren = () => {
    const boxRef = useRef();
    const { dispatch } = useReactHooks();
    const { editState,deleteState,popupType } = useSelector(state => state.travelRoute);
    const trackPopup=useRef();
    useEffect(() => {
        if(trackPopup.current)
        isactive()

        // console.log(editState?.alert);
        trackPopup.current=true;
    }, [editState?.alert,deleteState?.alert])

    const isactive = () => {
        if (boxRef.current) {
            boxRef.current?.toggleActive()
        }
    }
    const Editbox =useCallback (() => {
        const [formData, setFormData] = useState({
            whereFrom: "",
            whereTo: "",
            amount: "",
            travelBy: "metro",

        })

        useEffect(() => {
            if(editState?.data)
            setFormData({...editState?.data})

        }, [editState])

        const updateHandler = (e) => {
        setFormData(prev=>({...prev,[e.target.name]:e.target.value}))
        console.log({[e.target.name]:e.target.value});
        
        // console.log(formData);
        
        }
        return (
            <span className='bg-slate-900 w-full h-full flex flex-col '>
                <div className='border-b primary-p'><Title title={"edit confirmation"} /></div>
                <span className='t-container primary-p flex-1 flex flex-col gap-y-2 max-h-[200px] overflow-auto'>

                    <span className='t-body flex justify-center flex-col relative gap-1 ' >
                        <span className='flex items-center flex-wrap flex-1  gap-x-2 gap-y-1  min-w-[150px]'>

                            <label htmlFor='travel_By' className=" flex list-none gap-2 capitalize ">

                                  {travler.map((items, indx) => {
                        if (items[0] ==formData.travelBy)
                          return (<li key={indx} className='size-[25px] tertiary center rounded-lg primary-font'>
                                {items[1]}</li>)
                      })}
                                
                                <li><select name="travelBy" onChange={updateHandler} value={formData.travelBy} className=' cursor-pointer bg-transparent border-b-2 capitalize' id="travel_By">
                                    {
                                        travler.map((item, id) => {

                                            return (
                                                <option key={id} value={item[0]}>{item[0]}</option>
                                            )
                                        })
                                    }
                                </select></li>
                            </label>
                            <span className='flex flex-wrap gap-x-2  w-full items-center capitalize '>
                                <input type="text" defaultValue={formData?.whereFrom} onChange={updateHandler} placeholder='whereFrom' name='whereFrom' className='p-2 rounded-md bg-slate-900/60 flex-1 min-w-[100px] secondary-font placeholder:secondary-font capitalize' />
                                to
                                <input type="text" onChange={updateHandler} name='whereTo' defaultValue={formData?.whereTo} placeholder='whereFrom' className='p-2 rounded-md min-w-[150px]  flex-1 bg-slate-900/60 secondary-font placeholder:secondary-font capitalize' />
                            </span>

                        </span>

                        <label htmlFor='amount' className='p-2 rounded-md bg-slate-900/60 flex-1 secondary-font placeholder:secondary-font gap-2  capitalize flex  items-center'>
                            <FaIndianRupeeSign className='text-sm mt-1' /><input type="number" onChange={updateHandler} name="amount" defaultValue={formData?.amount} className='bg-transparent border-b outline-none max-w-[100px]' id="amount" /></label>
                            

                        <span className='px-2 flex flex-wrap   rounded-md bg-slate-900/60 flex-1 secondary-font placeholder:secondary-font   capitalize flex  items-center'>
                        <Title title={"payment"}/>
                        <label  htmlFor="paid" className="flex items-center gap-2 min-w-[150px] flex-1 ">

                        <input type="radio" onClick={updateHandler} name="payStatus" defaultChecked={formData?.payStatus} id="paid" value={true}  className='size-[15px] border-0 outline-none bg-green-600'   />
                        <p>paid</p>
                        </label>
                        <label htmlFor='unpaid' className="flex items-center gap-2 min-w-[150px] flex-1 ">

                        <input type="radio" value={false} onClick={updateHandler
                        }     name="payStatus" id="unpaid" defaultChecked={!formData?.payStatus} className='size-[15px] border-0 outline-none bg-green-600'   />
                        <p>unpaid </p>
                        </label>
                       
                        </span>
                        {/* <span onClick={()=>dispatch(deleteRoute({cmpId,routeId:data?._id,date,parentId}))}className=' tertiary size-[25px] absolute right-[-8px] cursor-pointer secondary-font top-[50%] translate-y-[-50%] center rounded-full transition-all duration-700 active:scale-75'><BsDash /></span> */}

                        <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'></p>
                    </span>

                </span>
                <div className="flex gap-2  capitalize p-2 center ">
                    <button onClick={() => { dispatch(setEditAlert({type:"clear"})) }} className='bg-slate-500/50 py-2 active:scale-50 transition-all ease duration-700 rounded-md capitalize max-w-[200px] flex-1'>cancel</button>
                    <button onClick={() => {dispatch(updateTravelRoute(formData)) }} className='py-2 bg-blue-400 active:scale-50 transition-all ease duration-700  rounded-md capitalize max-w-[200px] flex-1'>update</button>
                </div>
            </span>
        )
    },[editState?.data]
    )
    return (
        <Popup ref={boxRef} active={true} boxClass='rounded-t-2xl  overflow-hidden  min-h-[300px]' flexibleBox={[setEditData]} >
          { popupType=="edit" && <Editbox />}
        {popupType=="del" && <DelAlert/>}

        </Popup>
    )
}


export default PopupChildren