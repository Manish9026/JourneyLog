import React from 'react'
import './style.scss'
const Switch = ({width="50",height="20",checked,onclick}) => {
  return (

        // <div className="w-full flex">
     
            <label class="switch cursor-pointer"  >
    <input checked={checked} type="checkbox" />
    <span class="slider round" onClick={onclick}>
        <p className='dot'></p>
    </span>
  </label>
            
            // </div>
    
   
  )
}

export default Switch