import React, { forwardRef, lazy, memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowRight, FaPlus, FaSearch } from 'react-icons/fa'
import { FaFilter, FaIndianRupeeSign } from 'react-icons/fa6';
import { BiSortAlt2 } from "react-icons/bi";
import { useSelector } from 'react-redux';
import Title from '../../component/Title';
import { travler } from '../travelRoute.jsx/TravelRoute';
import { getFormatedDate } from '../../utils/timeFormat';
import { TravelReport } from '../../component/travel-report/TravelReport';
import useReactHooks from '../../custom-hooks/useReactHooks';
import { getStatements, setFilterStates, sort } from '../../slices/statementSlice';
import { BsDash } from 'react-icons/bs';
import { deleteTravelRecords, getTravelRecord, setAlert, setDelStateData, setEditAlert, setEditData } from '../../slices/travelRouteSlice';
import Popup from '../../component/popup/Popup';
import Datepicker from 'react-tailwindcss-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FcPaid } from "react-icons/fc";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdAccountBalanceWallet, MdDeleteSweep, MdEdit, MdOutlineUpdate } from 'react-icons/md';
import { LuIndianRupee } from 'react-icons/lu';
import Lottie from "lottie-react";
// import { ImSpinner9 } from "react-icons/im";
import { getSortMonthWithDate } from '../../utils/dataTransformation';
import money from "../../assets/animations/money.json"
import not_found from "../../assets/animations/notFound.json"
// import { debounce } from '../../utils/optimization';
import useSticky from '../../custom-hooks/useSticky';
// import { DateField } from '../Payment/Payment';
import SlideButton from '../../component/UI component/SlidingButton';
// import { Skeleton } from '@mui/material';

const SpinCounter = lazy(() => import("../../component/SpinCounter"));
const Statement = () => {

  const { userInfo } = useSelector(state => state.auth)
  const [isSort, setIsSort] = useState(-1);
  const { statement, loading, printLoading,scrollStates,filterStates} = useSelector(state => state.statement)
  const { dispatch } = useReactHooks();
  const [searchValue, setSearchValue] = useState("")
  const filterBoxRef = useRef();
  const deleteBoxRef = useRef();

  // const [deleteBoxActive, setDeleteBoxActive] = useState(1)
  // const [headerActive,setHeaderActive]=useState(0)

    const loaderRef = useRef(null);
    

  const headerActive = useSticky(100, 50);
  useEffect(() => {
    if (!searchValue) {
      let timeout = setTimeout(() => {
        setSearchValue(userInfo?.recentCompany || "")
        // dispatch(getStatements({skip:0,next:5,company:searchValue}))
      }, 1000);

      return () => clearTimeout(timeout)
    }

  }, [userInfo?.recentCompany, searchValue])
  useEffect(() => {
    dispatch(sort(isSort))
  }, [isSort])

  const isSearched = () => {
    dispatch(getStatements({ skip: 0, next: 5, company: searchValue }))

  }
  const boxStatus = () => {
    if (filterBoxRef?.current) {
      filterBoxRef.current.toggleActive()
    }
  }

  const AmountDisplay = useCallback(() => {
    return (
      <span className=' flex justify-end w-full items-center gap-1'>



        <ul className="leaderboad flex flex-1  gap-2 text-slate-200 sticky top-0">
          <li style={{ boxShadow: "inset 1px 1px 5px 0px  #7a98eb , inset -1px -1px 5px 0px #7a98eb" }} className='max-w-[200px] min-w-[100px] px-2 py-1 gap-1  justify-center flex flex-col   rounded-md'>
            {/* <span className='flex items-center gap-1'><h6 className='capitalize text-sm'>from</h6></span> */}
            <MdOutlineUpdate className='text-sky-200' />
            <p className='text-xs '>{getSortMonthWithDate(statement[0]?.createdAt)}{'\t - \t'}{getSortMonthWithDate(statement[statement.length - 1]?.createdAt)}</p>

          </li>
          <li style={{ boxShadow: "inset 1px 1px 5px 0px  #7a98eb , inset -1px -1px 5px 0px #7a98eb" }} className='max-w-[200px] min-w-[100px] px-2 py-1 gap-1   justify-center flex flex-col   rounded-md'>
            {/* <span className='flex items-center gap-1'><h6 className='capitalize text-sm'>from</h6></span> */}
            {/* <MdAccountBalanceWallet className='text-sky-200'/> */}
            <span className='size-[20px] flex'><Lottie animationData={money} loop={true} /></span>
            <p className='text-xs flex items-center gap-1 font-semibold'><LuIndianRupee className='text-xm relative top-[1px]' />{Array.isArray(statement) && <SpinCounter amount={statement.reduce((sum, item) => sum + item.travel.reduce((sum, data) => sum + data.amount, 0), 0)} duration={3.5} /> || 0}</p>

          </li>

        </ul>
        <span className="size-[40px] center tertiary rounded-[5px] primary-font cursor-pointer" onClick={() => deleteBoxRef?.current?.toggleActive()}><MdDeleteSweep /></span>
        <span className="size-[40px] center tertiary rounded-[5px] primary-font cursor-pointer" onClick={() => setIsSort(prev => prev == 1 ? -1 : 1)}><BiSortAlt2 /></span>

        <span onClick={() => boxStatus()} className="size-[40px]  center tertiary rounded-[5px] primary-font cursor-pointer"><FaFilter /></span>
      </span>
    )
  }, [statement])

  useEffect(() => {
    let timeout=undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !scrollStates?.isFull) {
          // observer.unobserve(loaderRef?.current); 
          if(searchValue)
            timeout=setTimeout(() => {
              dispatch(getStatements({ skip:statement?.length,next:statement?.length + 5, company: searchValue ,refetch:true,filterData:filterStates}));
            }, 1000);
         

          
        }
      },
      {threshold: 1, rootMargin: "100px" }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
      clearTimeout(timeout)
    };
  }, [searchValue,statement] );
 
  return (
    <div className='flex relative flex-col w-full primary-p h-full overflow-hidden '>


      <FilterPopup ref={filterBoxRef} company={searchValue} />
      <DeleteBox ref={deleteBoxRef} recentCompany={userInfo?.recentCompany} />

      {printLoading && <span className='fixed top-0 left-0 z-10 w-full flex-col capitalize primary-font center h-full light-dark top-0 left-0'><div class="loader rounded-[5px]"></div> printing...</span>}
      <span className='flex search w-full flex-col  gap-1'>
        <span className='flex w-full gap-1 '>
          <label htmlFor='search' className='flex items-center  p-1 light-bg w-full min-h-[40px]  rounded-[5px]'>



            <input list="company" id='search' value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className=" flex min-w-[100px] bg-transparent px-2 h-full  flex-1 w-full" />
            <datalist id="company">
              {userInfo && userInfo?.company?.map((value, id) => {
                return (
                  <option value={value.cmpName} key={id} />
                )
              })}

            </datalist>

            <span onClick={() => isSearched()} className='text-[15px] min-w-[40px] text-sky-400 center  h-full'>
              <FaSearch className='  ' />
            </span>
          </label>



          {/* <span className='min-w-[40px] center tertiary rounded-[5px] primary-font cursor-pointer'>

<TiPrinter />
    </span> */}
          <TravelReport travlerName={userInfo?.userName} companyName={searchValue} className="min-w-[40px]  center tertiary  primary-font cursor-pointer" />

        </span>
        <AmountDisplay />
      </span>


      <span   className='relative flex-col  gap-2 py-2 w-full h-full pb-[50px]'>
        <span className={`fixed  ${headerActive ? 'visible top-[0] opacity-100' : 'visible top-[-100px] opacity-30'} center flex primary-bg min-h-[70px] transition-all ease duration-700  z-[110] flex-1 w-full left-0 right-0 primary-p  `}>
          <AmountDisplay />
        </span>
        { statement?.length != 0  && 
          statement?.map((routes, id) => {

            return (
              <div className="" key={routes._id}>
                <Title title={getFormatedDate({ date: routes.createdAt, type: "date" })} />
                <div className="t-container  flex flex-col gap-2 py-2 w-full ">

                  {
                    Array.isArray(routes?.travel) && routes?.travel.length != 0 &&
                    [...routes.travel].sort((a, b) => new Date(b.date) - new Date(a.date)).map((data, id) => {
                      return (
                        <span className='t-body flex flex-col relative cursor-pointer' key={data._id}>
                          <span className='flex items-center flex-1  gap-2'>
                            {travler.map((items, indx) => {
                              if (items[0] == data.travelBy)
                                return (<span key={indx} className='text-yellow-900'>{items[1]}</span>)
                            })}
                            <span className='flex gap-2 items-center capitalize flex-wrap'>
                              <p>{data?.whereFrom}</p><FaArrowRight className='text-xs font-normal mt-1' /> <p>{data?.whereTo}</p>
                            </span>

                            <div className="  flex items-center flex-col gap-1  absolute justify-center right-[-10px] h-full top-0">

                              <span onClick={() => { dispatch(setDelStateData({ detail: { cmpId: routes.company.cmpId, travelDetails: data, deleteFrom: "statement", parentId: routes._id }, type: "add" })); dispatch(setAlert()) }} className=' tertiary size-[25px]   cursor-pointer secondary-font  center rounded-full transition-all duration-700 active:scale-75'><BsDash /></span>
                              <span onClick={() => { dispatch(setEditData({ cmpId: routes.company.cmpId, ...data, editFrom: "statement", parentId: routes._id })); dispatch(setEditAlert()) }} className=' tertiary size-[25px]   cursor-pointer secondary-font  center rounded-full transition-all duration-700 active:scale-75'><MdEdit className='text-sm' /></span>
                            </div>




                          </span>
                          <span className='flex items-center '>
                            <span className='flex items-center min-w-[100px] text-sm'>
                              <FaIndianRupeeSign className='text-sm mt-1' />{data?.amount}</span>
                            <span className='flex text-slate-900'>
                              {
                                data?.payStatus ? <p className='flex items-center gap-2'><FcPaid className='mt-[6px] text-lg' /> paid</p> : <p className='flex items-center gap-2'><CiNoWaitingSign className='text-red-900 mt-[1px]' /> unpaid
                                </p>
                              }
                            </span>
                          </span>


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

          }) 

          
        }



{(scrollStates?.isFull) && <div  className={`${statement?.length==0 && "h-full min-h-[300px]"} center flex `}>
            <span className={`${statement?.length==0 && "h-full"} center flex-col capitalize text-sky-200`}>
              <Lottie animationData={not_found} className='size-[50px]' loop={true} />
              {!(scrollStates?.isFull && statement?.length>0) ? "!! no records found" : "!! no more records "}
            </span>
          </div>}
        <div className="flex" ref={loaderRef}> {loading  &&  <CardSkelton headingClass={"hidden"}/>}</div>
      </span>

    </div>
  )
}

const CardSkelton = ({headingClass,cardLength=5,}) => {
  return (
    <div  className="flex flex-col gap-2 flex-1">
      <span className={` ${headingClass} capitalize secondary-font`}>fetching details...</span>
      <span className='flex flex-col gap-1'>
        {
          Array(cardLength).fill(0).map((_, id) => {
            return (
              <span key={id} className=' relative flex flex-col cursor-pointer rounded-md p-2 light-dark gap-1' >
                <span className='flex items-center  gap-2'>
                  <span className='size-[20px] inner-shade p-1 rounded-full'></span>
                  <span className='flex gap-2 items-center capitalize flex-wrap'>
                    <p className='min-w-[100px] inner-shade p-1 rounded-md'></p><FaArrowRight className='text-xs font-normal text-white mt-0' /> <p className='min-w-[100px] inner-shade p-1 rounded-md'></p>
                  </span>

                </span>
                <span className='flex items-center text-sm gap-2'>
                  <span className='size-[20px] inner-shade p-1 rounded-full'></span><p className='min-w-[50px] inner-shade py-[5px] rounded-[2px]'></p></span>

                <p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'></p>
              </span>
            )
          })
        }
      </span>
    </div>

  )
}

const DeleteBox = forwardRef(({ recentCompany }, ref) => {

  const [isActive, setIsActive] = useState(0);
  const userInfo = useSelector(state => state.auth.userInfo);
  const { deleteAllRecordsState:{loading, message, error,status},travelRecords } = useSelector(state => state.travelRoute);
  const { dispatch } = useReactHooks();
  const [selectDateOption, setSelectDateOption] = useState({
    paid:1,
    unpaid:0,
    other:0,
    recentSelection:"paid"

  });
  const [formData, setFormData] = useState({
    company: {
      cmpName: "",
      cmpId: ""
    },
    date: {
      startDate: Date.now,
      endDate: Date.now,
    },

  })


  useEffect(() => {
    if (userInfo?.company) {
      const result = userInfo?.company.find((ele) => { return userInfo?.recentCompany == ele.cmpName })
      setFormData(prev => ({ ...prev, company: { cmpId: result?._id, cmpName: result?.cmpName } }))

    }
    // if(travelRecords?.data)
    // setFormData(prev=>({...prev,date:{startDate:travelRecords?.data?.paid?.minDate,endDate:travelRecords?.data?.paid?.maxDate}}))

  }, [userInfo])

  useEffect(() => {
    if(status=="success" || formData.company.cmpId)
    dispatch(getTravelRecord({company:formData?.company}))

  }, [formData.company,status])

  useEffect(() => {

    
    if(selectDateOption?.recentSelection=="paid" || selectDateOption?.recentSelection=="unpaid" )
      setFormData(prev=>({...prev,date:{startDate:travelRecords?.data?.[selectDateOption?.recentSelection]?.minDate,endDate:travelRecords?.data?.[selectDateOption?.recentSelection]?.maxDate}}))
    else
      setFormData(prev=>({...prev,date:{startDate:null,endDate:null}}))
    
  }, [selectDateOption,formData.company])

const onSelectDate=(type)=>{
  setSelectDateOption(prev=>({...prev,recentSelection:type,[prev.recentSelection]:0,[type]:1}))
    
}

  return (
    <Popup ref={ref} buttonToggle={(value) => { setDeleteBoxActive(value) }} boxClass={`${ref?.current?.clientHeight} min-h-[300px] max-h-[600px] bg-slate-900 text-slate-100 relative overflow-hidden md:justify-center  md:max-h-[400px]  md:min-w-[400px] md:rounded-xl`} bodyClass={"w-full items-end md:items-center transition-height duration-500"}  >
      <div className='flex flex-col  transition-height duration-500 gap-2 p-2 w-full h-full bg-slate-900 text-slate-100'>

        <span className='flex gap-2 pb-1 border-b items-center'>
          <h3>Delete Statement</h3>
        </span>

        <span className=" justify-start flex flex-col gap-2">
          <h6 className=' capitalize'>record</h6>
          <span className='relative flex gap-5 flex-wrap w-full'>
          

          <CustomRecordSelect isSlected={selectDateOption?.paid} onClick={()=>{onSelectDate("paid")}} startDate={travelRecords?.data?.paid?.minDate} endDate={travelRecords?.data?.paid?.maxDate} title={"paid"}/>
          <CustomRecordSelect startDate={travelRecords?.data?.unpaid?.minDate} isSlected={selectDateOption?.unpaid} endDate={travelRecords?.data?.unpaid?.maxDate} onClick={()=>{onSelectDate("unpaid")}} title={"Unpaid"}/>

          <CustomRecordSelect startDate={null} isSlected={selectDateOption?.other} endDate={null} onClick={()=>{onSelectDate("other")}} title={"other"}/>
       
          </span>
        

        </span>

        <span onFocus={() => { setIsActive(1) }} className="flex   flex-col w-full placeholder:capitalize">
          <input type="text" value={formData?.company?.cmpName ?? ""} readOnly className="inputField" placeholder='choose company' />
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


        <span className="flex gap-2 flex-wrap">
          {/* <DateField /> */}
          <SingleDateField placeHolder="Start Date" onChange={(value) => { console.log(value); setFormData((prev) => ({ ...prev, date: { startDate: value, endDate: prev?.date?.endDate } })) }} value={formData?.date?.startDate} />

          <SingleDateField placeHolder="End Date" onChange={(value) => { console.log(value); setFormData((prev) => ({ ...prev, date: { endDate: value, startDate: prev?.date?.startDate } })) }} value={formData?.date?.endDate} />





        </span>
        <span className='flex gap-2 items-center md:justify-center'>

          <SlideButton status={loading ? "wait" : 'success'} onConfirm={() => dispatch(deleteTravelRecords(formData))} />

        </span>
      </div>
    </Popup>
  )
})

const FilterPopup = forwardRef(({ company }, ref) => {

  const [filterData, setFilterData] = useState({
    date: {},
    amount: {
      min: "", max: ""
    }, paymentStatus: {
      paid: 0,
      unpaid: 0

    },
    company: {
      cmpId: "",
      cmpName: company
    }
  })
  const [filterNav, setFilterNav] = useState({
    date: 1,

  })
  const { dispatch } = useReactHooks();
  const reset = () => {
    setFilterData({
      date: {}, amount: {
        min: "", max: ""
      }, paymentStatus: {
        paid: 0,
        unpaid: 0

      }, company: {
        cmpId: "",
        cmpName: company
      }
    })
  }
  const DateBox = useCallback(() => {
    // console.log(newRef,"new ref");

    return (
      <div className="flex flex-col items-center gap-2">
        {/* {JSON.stringify(filterData)} */}
        {
          [["today", "today"], ["yesterday", "yesterday"], ["last week", "last_week"], ["range", "range"]].map((item, id) => {
            return (
              <label htmlFor={item[1]} key={id} className='w-full cursor-pointer flex items-center gap-2 capitalize'><input type="radio" name="date" checked={typeof filterData?.date == "object" && Object.keys(filterData.date).includes(item[1])} value={item[1]} id={item[1]} role={item} onChange={(e) => setFilterData(prev => ({ ...prev, date: { [e.target.value]: "" } }))} />{item[0]}</label>
            )
          })
        }
        {
          typeof filterData?.date == "object" && Object.keys(filterData.date).includes("range") && <span className='flex flex-col w-full items-center capitalize max-w-[200px]'>
            <Datepicker asSingle={true} useRange={false} inputClassName={"w-full text-sm px-4 py-1 border border-gray-300 secondary-font bg-[#1e293b] rounded-md"} popoverDirection='up' value={{ startDate: filterData?.date?.range?.startDate || null, endDate: filterData?.date?.range?.startDate }} onChange={(value) => {
              setFilterData(prev => ({ ...prev, date: { range: { ...prev?.date?.range, startDate: value?.startDate } } })); console.log(value, "value");
            }} />
            <p>to</p>
            {/* <Datepicker asSingle={true}/> */}
            <Datepicker asSingle={true} useRange={false} inputClassName={"w-full px-4 py-1 border border-gray-300 text-sm secondary-font bg-[#1e293b] rounded-md"} popoverDirection='up' value={{ startDate: filterData?.date?.range?.endDate || null, endDate: filterData?.date?.range?.endDate }} onChange={(value) => setFilterData(prev => ({ ...prev, date: { range: { ...prev?.date?.range, endDate: value?.startDate } } }))} />
          </span>
        }




      </div>
    )
  }, [filterData.date])

  const AmountBox = useCallback(() => {



    return (
      <span className='flex flex-col gap-2'>
        <li className=""><input type="number" placeholder='Min Amount' className={"w-full px-4 py-1 border border-gray-300 text-sm secondary-font bg-[#1e293b] rounded-md"} name='min' defaultValue={filterData?.amount?.min} onChange={(e) => setFilterData(prev => ({ ...prev, amount: { ...prev.amount, min: e.target.value } }))} /></li>
        <li className=""><input type="number" name='max' defaultValue={filterData?.amount?.max} onKeyUp={(e) => setFilterData(prev => ({ ...prev, amount: { ...prev.amount, max: e.target.value } }))} placeholder='Max Amount' className={"w-full px-4 py-1 border border-gray-300 text-sm secondary-font bg-[#1e293b] rounded-md"} /></li>

        {/* <li className=""></li> */}

      </span>
    )
  }, [filterData.amount, reset])
  const StatusBox = useCallback(() => {
    return (

      <span className='flex flex-col items-center'>
        <label htmlFor='paid' className="capitalize w-full"><input id='paid' type="checkbox" checked={filterData?.paymentStatus?.paid} onChange={() => setFilterData(prev => ({ ...prev, paymentStatus: { ...prev.paymentStatus, paid: !prev.paymentStatus.paid } }))} /> paid</label>
        <label htmlFor='unpaid' className="capitalize w-full"><input id='unpaid' type="checkbox" checked={filterData?.paymentStatus?.unpaid} onChange={() => setFilterData(prev => ({ ...prev, paymentStatus: { ...prev.paymentStatus, unpaid: !prev.paymentStatus.unpaid } }))} /> unpaid</label></span>
    )
  }, [filterData.paymentStatus])

  const CompanyBox = useCallback(() => {
    const { userInfo } = useSelector(state => state.auth)



    return (
      <div className="">

        {
          userInfo && Array.isArray(userInfo?.company) ? userInfo.company.map((data) => {
            return (
              <label htmlFor={data?._id} key={data?._id} className='w-full cursor-pointer flex items-center gap-2 capitalize'><input type="radio" name="company" checked={data?.cmpName === (filterData.company.cmpName || company)} value={filterData.company.cmpName} id={data?._id} onChange={(e) => setFilterData(prev => ({ ...prev, company: { cmpId: data?._id, cmpName: data?.cmpName } }))} />{data?.cmpName}</label>
            )
          }) : null
        }

      </div>
    )
  }, [filterData.company, company]
  )
  const filterHandler = () => {
    dispatch(setFilterStates(filterData))
    dispatch(getStatements({ skip: 0, next: 5, company: filterData.company.cmpName, filterData, }))
  }


  const ContentBox = useCallback(() => {
    return (
      filterNav?.amount ? <AmountBox /> : filterNav?.date ? <DateBox /> : filterNav?.status ? <StatusBox /> : filterNav?.company ? <CompanyBox /> : null
    )
  }, [filterNav, filterData.date, filterData.paymentStatus, filterData.company])
  return (

    <Popup bodyClass={"w-full md:items-center"} ref={ref} boxClass='min-h-[200px] md:max-h-[400px]  md:min-w-[400px] md:rounded-xl  bg-slate-900 text-slate-100'>
      <div className='w-full tansition-all duration-700 max-h-[600px] p-1 flex-col  flex  h-full flex-1 '>
        <div className="p-1 border-b md:p-2">Filter </div>
        <div className='flex  flex-1   py-1 md:px-2'>
          <ul className='bg-sky-200/20 primary-font flex flex-col items-start py-2 capitalize rounded-[5px] min-h-full max-w-[100px] gap-1'>
            {
              [["date range", "date"], ["amount", "amount"], ['status', 'status',], ["company", "company"]].map((navTitle, id) => {
                return (
                  <label className={`${filterNav[navTitle[1]] ? "bg-blue-500" : " "}  px-2 w-full capitalize transition-all cursor-pointer ease duration-700`} htmlFor={navTitle[1] + id} key={id}>
                    <input type='button' className='capitalize cursor-pointer' name={navTitle[1]} id={navTitle[1] + id} value={navTitle[0]} onClick={(e) => setFilterNav({ [e.target.name]: 1 })} />
                  </label>
                )
              })
            }
            {/* <li>date range</li>

        <li>amount</li>
        <li>status</li> */}
          </ul>
          <ul className='p-2'>
            <ContentBox />
            {/* <DateBox/> */}
            {/* <AmountBox/> */}



          </ul>

        </div>
        <div className="flex gap-2  capitalize p-2 center ">
          <button onClick={reset} className='bg-slate-500/50 py-2 active:scale-50 transition-all ease duration-700 rounded-md capitalize max-w-[200px] flex-1'>reset</button>
          <button onClick={filterHandler} className='py-2 bg-blue-400 active:scale-50 transition-all ease duration-700  rounded-md capitalize max-w-[200px] flex-1'>apply</button>
        </div>

      </div>
    </Popup>
  )
}
)

export const SingleDateField = memo(({ title, placeHolder = "Enter Date  (YYYY-MM-DD)", className, popupClass, value, onChange, dateDirection = "down" }) => {
  return (
    <span className={`min-w-[250px]  md:min-w-[300px] max-w-[500px] flex-1  ${className}`}>
      <Title title={title} className={"px-2"} />
      <Datepicker
        useRange={false}
        asSingle={true}
        value={{ startDate: (value), endDate: (value) }}
        onChange={(value) =>{ 
          
          const now = new Date();
          // console.log(now,"now");
          
    value?.startDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());

          // console.log(value?.startDate,"value");

        return onChange(value?.startDate)}}
        placeholder={placeHolder}
        inputClassName="w-full text-slate-200 px-4 py-2 border border-gray-300 bg-[#1e293b] rounded-md"
        containerClassName="relative text-gray-900  min-w-full transition-height  duration-500"
        popoverDirection={dateDirection}
        showShortcuts={false}  // Hides shortcuts (optional)
        showSingleCalendar={true}

        toggleClassName={"absolute right-2 top-0 translate-y-1/2 text-sky-400"}

        popupClassName={"  relative overflow-visible max-w-full max-h-[300px] transition-all ease-out duration-300  z-10 mt-[1px] text-sm lg:text-xs 2xl:text-sm mb-2.5 mt-2.5  translate-y-0 opacity-0 hidden"}

      />
    </span>
  )
})

const CustomRecordSelect=({endDate,startDate,title,isSlected=false,onClick})=>{

  const extactDate=(date)=>{
    if(!date)
      return "?"
    return new Date(date).toLocaleDateString()
  }
  return(
    <ul className={`flex-col cursor-pointer justify-start gap-2 ${isSlected ?" border":" "} px-2 py-1 rounded-lg `} onClick={onClick}>
            <li className='relative flex items-center   gap-2 capitalize'><PingDot size={10}/><p className='mt-[-5px]'>{title}</p></li>
            <li className='text-[.6rem] flex justify-center'>{extactDate(startDate)}-{extactDate(endDate)}</li>
            </ul>
  )
}
const PingDot = ({ size = 10 }) => {

  return (
    <span style={{width:`${size}px`,height:`${size}px`}} className={`relative flex size-[${size+"px"}] `}>  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-600 opacity-75"></span>  <span style={{width:`${size}px`,height:`${size}px`}}  className={`relative inline-flex size-[${size+"px"}] rounded-full bg-sky-500`}></span></span>
  )
}


export default Statement