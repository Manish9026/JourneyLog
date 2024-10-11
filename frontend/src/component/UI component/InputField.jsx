import React from 'react'
import './style.scss'
const InputField = ({className,type,name,value,onChange,message,placeholder}) => {
  return (
    <div className={`inputBox ${className}`}>
    <input type={type} id='start_date' name={name} value={value} required /> <p>{placeholder}</p>
</div>
  )
}

export default InputField