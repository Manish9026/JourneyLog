import React from 'react'
import './loder.css'
const Loader = ({ style }) => {
  return (
    <div className='loader-c' style={style}>
      <div className="ring-container">
        <span className='ring'></span>
        <span className='ring'></span>
        <span className='ring'></span>
        <p>loading...</p>
      </div>

    </div>
  )
}

export default Loader