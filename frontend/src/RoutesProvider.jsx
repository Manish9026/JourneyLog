import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.scss'
import './pages/Home/style.scss'
import {useDispatch} from 'react-redux'
import pageLoad from './assets/animations/pageLoad.json'
// import {Layout} from './Layout.jsx'
// import Home from './pages/Home/Home.jsx'
// import TravelRoute from './pages/travelRoute.jsx/TravelRoute.jsx';
// import Detail from './pages/Detail/Detail.jsx';
const Home=lazy(() => import('./pages/Home/Home.jsx'))
const Layout =lazy(() => import('./Layout.jsx'));
const TravelRoute=lazy(() => import('./pages/travelRoute.jsx/TravelRoute.jsx'))
const Detail =lazy(() => import('./pages/Detail/Detail.jsx'));
const Statement=lazy(()=>import("./pages/statement/Statement.jsx"));
const TravelReport =lazy(()=>import("./component/travel-report/TravelReport.jsx"));
const Payment=lazy(()=>import("./pages/Payment/Payment.jsx"));
// import Statement from './pages/statement/Statement.jsx';
// import { TravelReport } from './component/travel-report/TravelReport.jsx'
// import Payment from './pages/Payment/Payment.jsx'
// import Detail from './pages/Detail/Detail.jsx'
import { isVerified } from './slices/authSlice.js'
import { recentRoutes } from './slices/travelRouteSlice.js'
import { getStatements } from './slices/statementSlice.js'
import { getDetails } from './slices/detailSlice.js'
import { recentPayment } from './slices/paymentSlice.js'
import { getTravelDetail } from './slices/homeSlice.js'
import Lottie from 'lottie-react'
import Dealer from './pages/Dealer/Dealer.jsx'
import { InfiniteScroll } from './component/InfiniteScrolling.jsx'

function RoutesProvider() {

const dispatch=useDispatch();
  const router=createBrowserRouter([{
    path:"",
    element:<Layout/>,
    loader:()=>{
      dispatch(isVerified())
      return null
    },
    
    children:[{
      path:'/',
      element:<Home/>,
      loader:()=>{
        dispatch(getTravelDetail({skip:0,next:7,company:""}))
        return null
      }
    },{
      path:"/add-routes",
      element:<TravelRoute/>,
      loader:()=>{
        dispatch(recentRoutes())
        return null
      }
    },{
      path:"statement",
      element:<Statement/>,
      loader:()=>{
        dispatch(getStatements({skip:0,next:5,company:""}))
        return null
      }
    },{
      path:"/pdf",
      element:<TravelReport/>
    },{
      path:"/detail",
      element:<Detail/>,
      loader:()=>{
        dispatch(getDetails())
        return null
      }
    },{
      path:"/payment",
      element:<Payment/>,
      loader:()=>{
        dispatch(recentPayment())
        return null
      }
    },
    {
      path:"dealer",
      element:<Dealer/>,
      loader:()=>{
        // dispatch()
        return null
      }
    },{
      path:"/h",
      element:<div className='flex center w-full h-full primary-bg '>

        <span className='size-[200px] center flex-col text-sky-200 text-xl'>
        <Lottie animationData={pageLoad} loop={true} />
        Loading...
        </span>
      </div>
    },{
      path:"/scroll",
      element:<InfiniteScroll/>
    }]
  
  }])

  return <Suspense fallback={<div className='flex center w-full h-screen primary-bg '>

    <span className='size-[200px] center flex-col text-sky-200 text-xl'>
    <Lottie animationData={pageLoad} loop={true} />
    Loading...
    </span>
  </div>}>
<RouterProvider router={router}/>
</Suspense>
// return  <RouterProvider router={router}/>
}

export default RoutesProvider
