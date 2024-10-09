import React, { useState } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { FaArrowRight, FaRupeeSign } from 'react-icons/fa';
import { travler } from '../../pages/travelRoute.jsx/TravelRoute';
import { getFormatedDate } from '../../utils/timeFormat';
import { MdPrint } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import useReactHooks from '../../custom-hooks/useReactHooks';
import { setPrintLoading } from '../../slices/statementSlice';


export const TravelReport = ({className,travlerName,companyName}) => {
const pdfRef=useRef()
const triggerPdfDownload = () => {
    if (pdfRef.current) {
      pdfRef.current.handleDownloadPdf();
    }
  };
	return(<>
	
	<PdfReport ref={pdfRef} travlerName={travlerName} companyName={companyName}/>
		<span className={className} onClick={()=>triggerPdfDownload()}> <MdPrint/></span>
	</>
	)

};




// const recentRoutes = [
// 	{
// 		"_id": "6703e70db9309be0a9a72592",
// 		"userId": "6703d74de654f5598df72a31",
// 		"travel": [
// 			{
// 				"whereTo": "mayur vihar extention",
// 				"whereFrom": "asharm ",
// 				"travelBy": "rapido",
// 				"amount": 56,
// 				"_id": "6703e70db9309be0a9a72593",
// 				"date": "2024-10-07T13:50:05.888Z"
// 			},
// 			{
// 				"whereTo": "asharm",
// 				"whereFrom": "mayur vihar",
// 				"travelBy": "rapido",
// 				"amount": 56,
// 				"_id": "6703e714b9309be0a9a725a1",
// 				"date": "2024-10-07T13:50:12.421Z"
// 			},
// 			{
// 				"whereTo": "meerut",
// 				"whereFrom": "new delhi",
// 				"travelBy": "metro",
// 				"amount": 5000,
// 				"_id": "6703e847b9309be0a9a72635",
// 				"date": "2024-10-07T13:55:19.207Z"
// 			}
// 		],
// 		"createdAt": "2024-10-07T13:50:05.893Z",
// 		"updatedAt": "2024-10-07T13:55:19.210Z",
// 		"__v": 2
// 	},
// 	{
// 		"_id": "6704ed07b9309be0a9a72680",
// 		"userId": "6703d74de654f5598df72a31",
// 		"travel": [
// 			{
// 				"whereTo": "rajori garden",
// 				"whereFrom": "tilak nagar",
// 				"travelBy": "metro",
// 				"amount": 500,
// 				"_id": "6704ed07b9309be0a9a72681",
// 				"date": "2024-10-08T08:27:51.805Z"
// 			}
// 		],
// 		"createdAt": "2024-10-08T08:27:51.806Z",
// 		"updatedAt": "2024-10-08T08:27:51.806Z",
// 		"__v": 0
// 	}
// ]
const PdfReport =forwardRef( ({travlerName,companyName},ref) => {
	const componentRef = useRef();
const {dispatch}=useReactHooks()
    const { statement, loading } = useSelector(state => state.statement)
	useImperativeHandle(
	  ref,
	  () => ({
		async handleDownloadPdf(){
            // setpageCount(1)
dispatch(setPrintLoading(true))
            
			const element = componentRef.current;
	if(!element) return toast("no records")
			const canvas = await html2canvas(element, {
				scale: 2,
				useCORS: true,
			});
	
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 297; // A4 height in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;
            pdf.text("", 10, 10 + 10);
			let position = 0;
	
			pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
			heightLeft -= pageHeight;
			// Add new pages if content overflows
			while (heightLeft > 0) {
				position = heightLeft - imgHeight;
                // setpageCount(prev=>prev+1)
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
               
			}
	
			pdf.save('travelReport.pdf');
dispatch(setPrintLoading(false))

		}
	  })
	)
    if(Array.isArray(statement) && statement?.length!=0)
	return (

        
		<div className="w-full p-1 flex-col" ref={componentRef} style={{ width: '600px', height: "auto", border: "1px solid white", display: "flex", position:"absolute",top:"-1000000px",fontFamily: 'Arial, sans-serif',  
			boxSizing: 'border-box' }}>

			<header className='primary-p flex w-full list-none border-b border-red-400 flex-col capitalize'>
				<span className='center flex-col'><h4>travel report </h4>
                <p className='center'>{new Date(statement[0].createdAt).toLocaleDateString('en') }-{new Date(statement[statement.length-1].createdAt).toLocaleDateString()}</p></span>
				<span className="flex justify-between">
					<ul>
						<li className='flex items-center '>company name:<p className='text-sm mt-1'>{companyName}</p></li>
						<li className='flex items-center'>traveler Name: <p className='text-sm mt-1'>{travlerName}</p></li>
					</ul>
					<ul>
						<li>date:{new Date().toLocaleDateString()}</li>
						<li>total amount:{Array.isArray(statement) && statement.reduce((sum,item)=>sum + item.travel.reduce((sum,data)=>sum + data.amount,0),0)}</li>
					</ul>
				</span>
			</header>

			<div className="body capitalize w-full">

			{
                Array.isArray(statement) && statement.length!=0 &&
				statement.map((routes,id)=>{
					return(
						
				<div key={routes?._id} className="box w-full border flex flex-col primary-px">
				<span className="box-head center relative top-[-8px] ">
{getFormatedDate({date:routes?.createdAt,type:"date"})}
				</span>
				 <div className="  flex-wrap gap-1 pb-2 flex w-full">
				{
                    Array.isArray(routes?.travel) && routes?.travel.length!=0 &&
					routes?.travel.map((data,id)=>{
						return(
							<span key={data?._id} className=' relative flex-1 min-w-[300px] flex-wrap   w-full flex   justify-between cursor-pointer rounded-md p-1 text-sm light-dark gap-1' >
							<span className='flex flex-1  justify-between   items-center p-1  gap-2'>
								<span className='  text-lg center  p-1 rounded-full'>{travler.map((items, indx) => {
                                if (items[0] == data.travelBy)
                                  return (<span key={indx} className='text-yellow-900'>{items[1]}</span>)
                              })}</span>
								<span className='flex flex-1 justify-center w-full  gap-2 items-center capitalize '>
									<span className='relative flex-1 center top-[-8px] center h-full text-center  rounded-md '>{data?.whereFrom}</span><FaArrowRight className='text-xs font-normal text-white mt-0' /> <p className='center relative flex-1 top-[-8px] h-full '>{data?.whereTo}</p>
								</span>
	
							</span>
							<span className='flex justify-end    items-center text-sm gap-1'>
								<span className='size-[20px]  p-1 rounded-full'><FaRupeeSign/></span><p className='min-w-[50px]  relative top-[-8px] '>{data?.amount}</p></span>
	
							<p className='absolute top-1 right-[20px] text-slate-900 text-[10px]'></p>
						</span>
						)
					})
				}
			</div> 
				

				<span className="box-footer text-sm flex-col items-start list-none justify-start flex text-start relative top-[-8px]">
					<li>travel count:{routes?.travel?.length}</li>
					<li>total amount:{routes?.travel?.reduce((initial,item)=>{
                       return  initial +item.amount

                    },0)}</li>
				</span>
			</div>

					)
				})
			}
			</div>


		</div>
	)

})