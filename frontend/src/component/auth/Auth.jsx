

import React, { memo, useCallback, useEffect, useState } from 'react'
import './style.scss'
import { IoMdLogIn } from "react-icons/io";

import { GrUserNew } from "react-icons/gr";
import { FaArrowLeft, FaArrowRight, FaEdit, FaUpload } from 'react-icons/fa';
import { MdEdit } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, setFormStatus } from '../../slices/authSlice';
// import Loader from '../../component/loader/Loder'

import { useNavigate } from 'react-router-dom';
import Loader from '../loader/Loader';
export const Register = () => {
    const {loading}=useSelector(state=>state.auth)
    console.log(loading);
    const dispatch=useDispatch();
        const [formData, setFormData] = useState({
            userName: "",
            userEmail: "",
            mobileNo: "",
            password: "",
            file:null
        })
    
        const onchangeHandler = (ele) => {
            let { name, value } = ele;
            setFormData(prev => ({ ...prev, [name]: value }))
        }
        const onSubmitHandler = () => {
            console.log(formData);
            dispatch(register(formData))
    
        }
        return (
            <div className="sign-up">
               {loading? <Loader/>:""}
                <span className="mdIcons" onClick={() => {dispatch(setFormStatus({register:false}))}}>
                    <FaArrowLeft />
                </span>
                <div className="heading text-center">
                    Sign up
                </div>
                <div className="s-body">
    
    <label htmlFor='file'  className="upload">
    <input type="file" style={{display:"none"}} onChange={(e)=>setFormData(prev=>({...prev,file:e.target.files[0]}))} name="" id="file" />
    <img src={formData?.file && URL.createObjectURL(formData.file)} alt="" style={{display:!formData.file && "none"}}/>
    <span className="uploadIcon" style={{display:formData.file?"none":""}}>
        <FaUpload/>
    </span>
    <div className="editIcon" style={{display:formData.file?" ":"none"}}>
        <MdEdit/>
    </div>
    </label>
                    <div className="inputBox">
                        <input type="text" name="userName" value={formData.userName} onChange={(e) => onchangeHandler(e.target)} required /> <p>Username</p>
                    </div>
                    <div className="inputBox">
                        <input type="text" name="userEmail" value={formData.userEmail} onChange={(e) => onchangeHandler(e.target)} required /> <p>Useremail</p>
    
                    </div>
                    <div className="inputBox">
                        <input type="password" value={formData.password} onChange={(e) => onchangeHandler(e.target)} name="password" required /> <p>password</p>
                    </div>
                    <div className="flex-inputBox ">
                        <div className="inputBox max-w-full">
                            <input type="text"  name="mobileNo" value={formData.mobileNo} onChange={(e) => { if (!isNaN(e.target.value)) onchangeHandler(e.target) }} required /> <p>Mobile no</p>
                        </div>
                     
    
                    </div>
                    <input type="submit" value={"submit"} className='submitBtn' onClick={() => onSubmitHandler()} />
                </div>
    
    
            </div>
        )
    }
export const Login = memo(() => {
        const {loading}=useSelector(state=>state.auth)
        const dispatch=useDispatch();
        const [formdata, setFormdata] = useState({
            userEmail: "",
            password: ""
        })
        const onchangeHandler = (ele) => {
            let { name, value } = ele;
            setFormdata(prev => ({ ...prev, [name]: value }))
        }
        const onSubmitHandler = () => {
            console.log(formdata);
            dispatch(login(formdata))
    
        }
        return (
            <div className={"signin"}>
    {loading?<Loader/>:""}
                <span className="mdIcons" onClick={() => {dispatch(setFormStatus({login:false}))}}>
                    <FaArrowLeft />
                </span>
                <div className="content">
    
                    <h2>Sign In</h2>
    
                    <div className="form">
    
                        <div className="inputBox">
    
                            <input type="text" name="userEmail" value={formdata.userEmail} onChange={(e) => onchangeHandler(e.target)} required /> <p>User Email</p>
    
                        </div>
    
                        <div className="inputBox">
    
                            <input type="password" value={formdata.password} name='password' onChange={(e) => onchangeHandler(e.target)} required /> <p>Password</p>
    
                        </div>
    
                        <div className="links"> <a href="#">Forgot Password</a> 
                        <a  onClick={()=>{dispatch(setFormStatus({register:true,login:false}))}}>Signup</a>
    
                        </div>
    
                        <div className="inputBox">
    
                            <input type="submit" onClick={() => onSubmitHandler()} value="Login" />
    
                        </div>
    
                    </div>
    
                </div>
    
            </div>
        )
    })