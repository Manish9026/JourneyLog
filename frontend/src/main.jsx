
import { createRoot } from 'react-dom/client'
import './index.scss'
import { Provider } from 'react-redux'

import RouterProvider from './RoutesProvider.jsx'
import { store } from './store.js'

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
   <RouterProvider/>
   </Provider>

)
