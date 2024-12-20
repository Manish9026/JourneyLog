

import React, { lazy } from 'react'
const CountUp = lazy(() => import("react-countup"));

const SpinCounter = ({ amount, duration=3.5 }) => {
  return (
     
       <CountUp start={0} end={amount || 0} duration={duration}>
    
      </CountUp>
    
  )
}

export default SpinCounter