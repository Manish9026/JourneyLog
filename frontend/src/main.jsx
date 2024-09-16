import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider, useSelector } from 'react-redux'

import RouterProvider from './RoutesProvider.jsx'
import { store } from './store.js'

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
   <RouterProvider/>
   </Provider>

)
