import moment from 'moment-timezone'
import {DateTime} from 'luxon'

const d = new Date("2024-10-31T18:29:59.999Z");
const startDate = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 18, 30, 0, 0)); // Note: Months are 0-indexed (0 = January)
const y=new Date(d)
// Setting the end date to 2024-10-18T23:59:59.999Z
y.setUTCDate(d.getUTCDate() - 1);
const endDate = new Date(Date.UTC(y));

console.log(startDate,endDate);


// Date in local time zone (Asia/Kolkata)

// const isoDate = new Date(); // Example ISO date (UTC)
// const date = new Date(isoDate);
// console.log(date);

// // Convert to Indian Standard Time (IST) by manually adjusting offset
// const istOffset = 5.5 * 60; // IST is UTC+5:30
// console.log
// (date.getTimezoneOffset())
// const istTime = new Date(date.getTime() + Math.abs(date.getTimezoneOffset()) * 60 * 1000);

// // Format back to ISO string in the desired format (without the time zone suffix 'Z')
// // const isoIST = istTime.toISOString().replace('Z', '');

// // Output the formatted IST time in ISO format
// console.log( new Date(istTime));
// console.log(new Date().getTimezoneOffset());
function convertToTimeZone() {
    // Parse the date in UTC
   
    const date = DateTime.fromISO("2024-10-17T23:42:20.138+05:30", { zone: 'UTC' }).setZone((Intl.DateTimeFormat().resolvedOptions().timeZone))
    console.log(date);
    
    // Convert to the desired time zone
    return date.toISO();
  }


    const convertedDate = convertToTimeZone();
    console.log(convertedDate);
// const getISODate=(ISO_String)=>{

//     // Function to automatically convert to a specified time zone
 
    
//     // Example usage
//      // Output: "2024-10-16T18:30:00.000+05:30"
    

// //     const date1 = new Date('2024-10-17T00:00:00.000Z');

// // // Convert to the time zone with a 5:30 offset (e.g., Asia/Kolkata)
// // const options = { timeZone: 'Asia/Kolkata', hour12: false };
// // const dateInKolkata = date1.toLocaleString('en-GB', options);

// // console.log(dateInKolkata);

// // // Adjust formatting back to ISO format manually
// // const kolkataDateISO = new Date(dateInKolkata + ' GMT+0530').toISOString();
// // console.log(kolkataDateISO);

//     // const date=new Date()
//     // const iso=new Date(ISO_String);
//     // console.log(iso.getTime());
    
//     // const istTime = new Date(iso.getTime() -  Math.abs(iso.getTimezoneOffset()) * 60 * 1000);
//     // console.log(istTime);
    
//     // return new Date(istTime)

// }

// getISODate("2024-10-16T18:30:00.000Z")
// console.log("production");

// getISODate("2024-10-17T00:00:00.000Z")
const da=new Date();
console.log(da.getTime()>da.getTime() + 300 *60*1000);
