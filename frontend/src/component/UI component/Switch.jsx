import React from 'react'
import './style.scss'
const Switch = ({width="50",height="20",checked,onclick}) => {
  return (

        // <div className="w-full flex">
     
            <label className="switch cursor-pointer"  >
    <input checked={checked} readOnly  type="checkbox" />
    <span className="slider round" onClick={onclick}>
        <p className='dot'></p>
    </span>
  </label>
            
            // </div>
    
   
  )
}

export default Switch