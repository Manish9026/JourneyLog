import React from 'react'
import './loder.css'
// import logo from '../../../public/logo.png'
// import video from '../../assets/load2.gif'
import video from '../../assets/load.mp4'

const Loader = ({ style }) => {
  return (
      <div className=" loader-container capitalize top-0 left-0 primary-font flex-col absolute  w-full h-full center z-10" style={style}>

        <video src={video}  loop autoPlay={true} muted  className='size-[200px] rounded-lg'></video>
        {/* <img src={logo} alt="" className='loader-2' /> */}
        validate...
      </div>

  
  )
}

export default Loader