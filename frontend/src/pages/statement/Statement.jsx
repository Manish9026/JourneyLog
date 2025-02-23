import React, { forwardRef, lazy, memo, useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowRight, FaSearch } from 'react-icons/fa'
import { FaFilter, FaIndianRupeeSign } from 'react-icons/fa6';
import { BiSortAlt2 } from "react-icons/bi";
import { useSelector } from 'react-redux';
import Title from '../../component/Title';
import { travler } from '../travelRoute.jsx/TravelRoute';
import { getFormatedDate } from '../../utils/timeFormat';
import { TravelReport } from '../../component/travel-report/TravelReport';
import useReactHooks from '../../custom-hooks/useReactHooks';
import { getStatements, sort } from '../../slices/statementSlice';
import { BsDash } from 'react-icons/bs';
import { setAlert, setDelStateData, setEditAlert, setEditData } from '../../slices/travelRouteSlice';
import Popup from '../../component/popup/Popup';
import Datepicker from 'react-tailwindcss-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FcPaid } from "react-icons/fc";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdAccountBalanceWallet, MdDeleteSweep, MdEdit, MdOutlineUpdate } from 'react-icons/md';
import { LuIndianRupee } from 'react-icons/lu';
import Lottie from "lottie-react";
import { getSortMonthWithDate } from '../../utils/dataTransformation';
import money from "../../assets/animations/money.json"
import not_found from "../../assets/animations/notFound.json"
import { debounce } from '../../utils/optimization';
import useSticky from '../../custom-hooks/useSticky';
const SpinCounter = lazy(() => import("../../component/SpinCounter"));
const Statement = () => {

  const { userInfo } = useSelector(state => state.auth)
  const [isSort, setIsSort] = useState(-1);
  const { statement, loading, printLoading } = useSelector(state => state.statement)
  const { dispatch } = useReactHooks();
  const [searchValue, setSearchValue] = useState("")
  const filterBoxRef = useRef();
  const deleteBoxRef = useRef();

  const [deleteBoxActive, setDeleteBoxActive] = useState(1)
  // const [headerActive,setHeaderActive]=useState(0)
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
      <span className=' flex justify-end w-full gap-1'>



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
        <span className="size-[40px] center tertiary rounded-[5px] primary-font cursor-pointer" onClick={() =>deleteBoxRef?.current?.toggleActive()}><MdDeleteSweep /></span>
        <span className="size-[40px] center tertiary rounded-[5px] primary-font cursor-pointer" onClick={() => setIsSort(prev => prev == 1 ? -1 : 1)}><BiSortAlt2 /></span>
       
        <span onClick={() => boxStatus()} className="size-[40px]  center tertiary rounded-[5px] primary-font cursor-pointer"><FaFilter /></span>
      </span>
    )
  },[statement])
  return (
    <div className='flex relative flex-col w-full primary-p h-full overflow-hidden '>


      <FilterPopup ref={filterBoxRef} company={searchValue} />
      {<Popup ref={deleteBoxRef} buttonToggle ={(value)=>{setDeleteBoxActive(value) }}  boxClass="min-h-[60vh]"  >
        <div className='flex flex-col gap-2 p-2 w-full  bg-slate-900 text-slate-100'>

          <span className='flex gap-2 items-center'>
            <h3>Delete Statement</h3>
          </span>
          <span className='flex gap-2 items-center'></span>
        </div>
      </Popup>}
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


      <span className='relative flex-col  gap-2 py-2 w-full h-full'>
        <span className={`fixed  ${headerActive ? 'visible top-[0] opacity-100' : 'visible top-[-100px] opacity-30'} center flex primary-bg min-h-[70px] transition-all ease duration-700  z-[110] flex-1 w-full left-0 right-0 primary-p  `}>
          <AmountDisplay />
        </span>
        {loading ? <CardSkelton /> : statement.length != 0 ?
          statement.map((routes, id) => {

            return (
              <div className="" key={routes._id}>
                <Title title={getFormatedDate({ date: routes.createdAt, type: "date" })} />
                <div className="t-container  flex flex-col gap-2 py-2 w-full">

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

          }) :

          <div className="flex w-full min-h-[400px]  justify-center items-center">
            <span className='size-[200px] center flex-col capitalize text-sky-200'>
              <Lottie animationData={not_found} loop={false} />
              !! not found
            </span>
          </div>
        }
      </span>

    </div>
  )
}

const CardSkelton = () => {
  return (
    <div className="flex flex-col gap-2 ">
      <span className='capitalize secondary-font'>fetching details...</span>
      <span className='flex flex-col gap-1'>
        {
          Array(5).fill(0).map((_, id) => {
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
    dispatch(getStatements({ skip: 0, next: 5, company: filterData.company.cmpName, filterData }))
  }


  const ContentBox = useCallback(() => {
    return (
      filterNav?.amount ? <AmountBox /> : filterNav?.date ? <DateBox /> : filterNav?.status ? <StatusBox /> : filterNav?.company ? <CompanyBox /> : null
    )
  }, [filterNav, filterData.date, filterData.paymentStatus, filterData.company])
  return (

    <Popup flexibleBox={[filterData?.date]} bodyClass={"w-full "} ref={ref} boxClass='min-h-[300px] max-h-[600px] bg-slate-900 text-slate-100'>
      <div className='w-full p-1 flex-col  flex  h-full flex-1 '>
        <div className="p-1 border-b">Filter </div>
        <div className='flex  flex-1  py-1'>
          <ul className='bg-sky-200/20 primary-font flex flex-col items-start py-2 capitalize h-full max-w-[100px] gap-1'>
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
export default Statement