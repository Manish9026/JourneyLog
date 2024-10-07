import React from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';

const useReactHooks = () => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const location=useLocation();

    return {
        dispatch,navigate,location
    }
}

export default useReactHooks