
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import {Layout} from './Layout.jsx'
import './index.scss'
import Home from './pages/Home/Home.jsx'
import {useDispatch} from 'react-redux'

import { Layout } from './Layout.jsx'
import { isVerified } from './slices/authSlice.js'
import TravelRoute from './pages/travelRoute.jsx/TravelRoute.jsx'
import { recentRoutes } from './slices/travelRouteSlice.js'
import Statement from './pages/statement/Statement.jsx'
import { TravelReport } from './component/travel-report/TravelReport.jsx'
import { getStatements } from './slices/statementSlice.js'
import Detail from './pages/Detail/Detail.jsx'
import { getDetails } from './slices/detailSlice.js'
import Payment from './pages/Payment/Payment.jsx'
import { recentPayment } from './slices/paymentSlice.js'
import { getTravelDetail } from './slices/homeSlice.js'
function RoutesProvider() {

const dispatch=useDispatch();
  const router=createBrowserRouter([{
    path:"",
    element:<Layout/>,
    loader:()=>{
      dispatch(isVerified())
      return 0
    },
    
    children:[{
      path:'/',
      element:<Home/>,
      loader:()=>{
        dispatch(getTravelDetail({skip:0,next:7,company:""}))
        return 0
      }
    },{
      path:"/add-routes",
      element:<TravelRoute/>,
      loader:()=>{
        dispatch(recentRoutes())
        return 0
      }
    },{
      path:"statement",
      element:<Statement/>,
      loader:()=>{
        dispatch(getStatements({skip:0,next:5,company:null}))
        return 0
      }
    },{
      path:"/pdf",
      element:<TravelReport/>
    },{
      path:"/detail",
      element:<Detail/>,
      loader:()=>{
        dispatch(getDetails())
        return 0
      }
    },{
      path:"/payment",
      element:<Payment/>,
      loader:()=>{
        dispatch(recentPayment())
        return null
      }
    }]
  
  }])

  return <RouterProvider router={router}/>
}

export default RoutesProvider
