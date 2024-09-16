
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import {Layout} from './Layout.jsx'
import Home from './pages/Home/Home.jsx'
import MoviePage from './pages/single movie/MoviePage.jsx'
import {useDispatch} from 'react-redux'
import { getMoviDetailsAndCinema, getMovieData } from './slices/singleMoviPageSlice.js'
import CinemaContainer from './pages/buy-ticket/CinemaContainer.jsx'
import { Layout } from './Layout.jsx'
import { isVerified } from './slices/authSlice.js'
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
      path:"/movies/:moviId/:IMDB_id",
      element:<MoviePage/>,
      loader:({params})=>{
        console.log(params);
        dispatch(getMovieData({movi_id:params.moviId,IMDB_id:params.IMDB_id}))
        return 0
        
      }
    },{
      path:'/buyticket/:movi_id/:IMDB_id',
      element:<CinemaContainer/>,
      loader:({params})=>{
        const {IMDB_id,movi_id}=params;
        console.log(IMDB_id,movi_id);

        dispatch(getMoviDetailsAndCinema({IMDB_id,movi_id}))
        return 0
        

      }
    }]
  
  }])

  return <RouterProvider router={router}/>
}

export default RoutesProvider
