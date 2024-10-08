
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import {Layout} from './Layout.jsx'
import Home from './pages/Home/Home.jsx'
import {useDispatch} from 'react-redux'

import { Layout } from './Layout.jsx'
import { isVerified } from './slices/authSlice.js'
import TravelRoute from './pages/travelRoute.jsx/TravelRoute.jsx'
import { recentRoutes } from './slices/travelRouteSlice.js'
import Statement from './pages/statement/Statement.jsx'
import { TravelReport } from './component/travel-report/TravelReport.jsx'
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
      element:<Home/>
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
        dispatch(recentRoutes({skip:0,next:20}))
        return 0
      }
    },{
      path:"/pdf",
      element:<TravelReport/>
    }]
  
  }])

  return <RouterProvider router={router}/>
}

export default RoutesProvider
