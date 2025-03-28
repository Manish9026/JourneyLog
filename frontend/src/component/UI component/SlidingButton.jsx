import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ImSpinner9 } from "react-icons/im";
import { TiTick } from "react-icons/ti";
const SlideButton = ({ onConfirm = () => {},status="wait" }) => {
  const controls = useAnimation();
  const [confirmed, setConfirmed] = useState(false);
  const buttonRef = useRef(null);

  const handleDragEnd = async (event, info) => {
    // console.log(buttonRef?.current?.clientWidth * .75,info.point.x);
    const buttonWidth = buttonRef?.current?.clientWidth;
    
    if (info.point.x > buttonWidth * .60) { // Adjust threshold for confirmation
      setConfirmed(true);
      await controls.start({ x:(buttonWidth - 50) }); // Reset position if not confirmed
   if(confirm("Your are agree to delete records")){
    onConfirm();
   }

  

    } else {
      await controls.start({ x: 0 }); // Reset position if not confirmed
    }
  };
  useEffect(() => {

    if(status.toLocaleLowerCase()=="success"){
        
    const timeout=setTimeout(()=>{
        setConfirmed(false)
        controls.start({ x: 0 });
    },[1000])
    return () => {
      clearTimeout(timeout)
    }
}
  }, [confirmed])
  

  return (
    <div ref={buttonRef} onClick={()=>console.log(buttonRef?.current.clientWidth)
    } className="relative min-w-[180px] max-w-[400px] pl-1 flex-1 h-[50px] bg-blue-200 rounded-lg flex items-center  overflow-hidden">
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: ( buttonRef?.current?.clientWidth - 50 ) || 200 }} 
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative top-0 left-0 w-[45px] h-[45px] bg-blue-900 z-[5] rounded-full flex items-center justify-center 
         cursor-pointer shadow-lg overflow-hidden"
         
      >
        {confirmed?status.toLocaleLowerCase()=="success"?<TiTick />:<span className="animate-[wiggle_1s_ease-in-out_infinite] center">➜</span>:<span className="animate-[wiggle_1.5s_ease-in-out_infinite] center">➜</span>}
      </motion.div>
      <span className="absolute left-0  w-full center transform text-gray-700 font-semibold h-full ">
        {confirmed ? status=="wait" ?   <button type="button" class=" center absolute w-full h-full  top-0 left-0" disabled>
          <ImSpinner9 className='mr-3 size-5  animate-spin' />Processing…</button>:"Confirmed!" : "Slide to Confirm delete"}
    
      </span>
    </div>
  );
};

export default SlideButton;
