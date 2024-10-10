function checkDateStatus(dateString) {
    const days=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"]
        // date declaration
        const [givenDate,today,checkIfDate,yesterday]=[new Date(new Date(dateString).toLocaleDateString()),new Date(),new Date(),new Date(),new Date()]
        // logic of yesterday date
        yesterday.setDate(today.getDate() - 1);
      //  convert date to local string "DD/MM/YYYY" format
        checkIfDate.setDate(today.getDate()-(  today.getDay()));
        const [givenDateStr,todayStr,yesterdayStr]=[givenDate.toLocaleDateString(),today.toLocaleDateString(),yesterday.toLocaleDateString()];
        // logic of date chickig

        if(checkIfDate<=givenDate){
            if(givenDateStr==todayStr){
                return "today";
            }
            else if(givenDateStr==yesterdayStr){
                return "yesterday"
            }
            else{
            //   console.log ( givenDate.getDay())
                return days.filter((day,indx)=>{if(indx===givenDate.getDay()) return day
                }).toString()
            }
    
        }
        else{
            return givenDate.toLocaleDateString();
        }
    
    
      
    }

export const getFormatedDate=({type,date}={})=>{
    if(type=="time"){
       const newDate= new Date(date)
       let hour=newDate.getHours();
       let min=newDate.getMinutes();
    //    console.log(hour,min);
       
       if(hour<=12 && hour>=1){
        if(hour==12){
        return `${hour}:${min} PM`
    
        }
        return `${hour}:${min} AM`
       }
       else if(hour===0){
        return `${12}:${min} AM`

       }
        else{
        return `${hour-12}:${min} PM`

       }

             
    }
    else if(type=="date"){
       return checkDateStatus(date)
    }


}

