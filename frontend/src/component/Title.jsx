import React from 'react'

const Title = ({title,className}) => {
  return (
    <div className={`${className} flex items-center w-full primary-font capitalize`}  >{title}</div>
  )
}

export default Title