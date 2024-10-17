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

const getISODate=(ISO_String)=>{
    const iso=new Date(ISO_String);
    console.log(iso);
    
    const istTime = new Date(iso.getTime() -  Math.abs(date.getTimezoneOffset()) * 60 * 1000);
    console.log(istTime);
    
    return new Date(istTime)

}

console.log(getISODate("2024-10-17T00:00:00.000Z"));
