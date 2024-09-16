import React from 'react'
import { RiCustomerService2Fill } from "react-icons/ri";
import { IoTicketSharp } from "react-icons/io5";
import { IoIosMailOpen } from "react-icons/io";
import logo from '../assets/logo.png'
const footer=[[<RiCustomerService2Fill />,"27/7 customer care"],
[<IoTicketSharp />,"resend booking confirmation"],
[<IoIosMailOpen />,"subscribe to the newsLetter"]]
import { TiSocialFacebook } from "react-icons/ti";
import { BsInstagram } from "react-icons/bs";
import { BsYoutube } from "react-icons/bs";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";

const icons=[<FaLinkedinIn />,
<FaXTwitter />,
<BsYoutube />,
<BsInstagram />,
<TiSocialFacebook />

]
const Footer = () => {
  return (
    <div className='flex pb-10 flex-col w-full  bg-gray-600 h-full min-h-[200px]'>
      <div className="row1 p-2 gap-2  flex flex-1 border-b border-gray-500 justify-around items-center flex-wrap ">
        {
          footer.map((value,id)=>{
            return <span key={id} className='flex text-gray-400  cursor-pointer hover:text-gray-300 items-center justify-center flex-col capitalize'>
             <span className='text-4xl'>{value[0]}</span> 

            <p>{value[1]}</p>
      
              </span>
          })
        }
      
        
      </div>
      <span className='flex w-full justify-center items-center   relative '>

        {/* <p className='w-full absolute border-gray-100 border-t-2 z-[4] top-1/2 ' /> */}
          <img src={logo} alt="" className=' footer-logo z-[900] mix-blend-multiply  '  />
        </span>
        <span className=' flex flex-1 justify-center gap-3 items-center'>
          {
            icons.map((icon,id)=>{
              return(<span key={id} className='cursor-pointer bg-gray-500 rounded-full flex text-lg justify-center items-center size-[30px] hover:bg-gray-100'>{
                icon}</span>)
            })
          }
        </span>

    </div>
  )
}

export default Footer