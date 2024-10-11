import React from 'react'
import './loder.css'
import logo from '../../../public/logo.png'
const Loader = ({ style }) => {
  return (
      <div className=" loader-container capitalize top-0 left-0 primary-font flex-col absolute  w-full h-full center z-10" style={style}>

        <img src={logo} alt="" className='loader-2' />
        validate...
      </div>

  
  )
}

export default Loader