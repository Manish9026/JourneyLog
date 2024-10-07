import React from 'react'
import { FaArrowRight, FaSearch } from 'react-icons/fa'
import { FaFilter, FaIndianRupeeSign } from 'react-icons/fa6';
import { TiPrinter } from "react-icons/ti";
import { BiSortAlt2 } from "react-icons/bi";
import { useSelector } from 'react-redux';
import Title from '../../component/Title';
import { travler } from '../travelRoute.jsx/TravelRoute';
import { getFormatedDate } from '../../utils/timeFormat';

const Statement = () => {
  const { recentRoutes, loading } = useSelector(state => state.travelRoute.addRoute)

  return (
    <div className='flex flex-col w-full primary-p'>

<span className='flex search w-full flex-col gap-1'>
   <span className='flex w-full gap-1'>
   <label htmlFor='search' className='flex items-center  p-1 light-bg w-full min-h-[40px] overflow-hidden rounded-[5px]'>
        <input type='text' id='search' className=" flex min-w-[100px] bg-transparent px-2 h-full  flex-1 w-full"/>
        <span className='text-[15px] min-w-[40px] text-sky-400 center  h-full'>
        <FaSearch className='  '/>
        </span>
    </label>
    <span className='min-w-[40px] center tertiary rounded-[5px] primary-font cursor-pointer'>

<TiPrinter />
    </span>
   </span>
   <span className='flex justify-end w-full gap-1'>

    <span className="size-[35px] center tertiary rounded-[5px] primary-font cursor-pointer"><BiSortAlt2 /></span>
    <span className="w-[40px] center tertiary rounded-[5px] primary-font cursor-pointer"><FaFilter/></span>
   </span>
</span>

<span className=' flex flex-col gap-2 py-2 w-full'>
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
</span>

    </div>
  )
}

export default Statement