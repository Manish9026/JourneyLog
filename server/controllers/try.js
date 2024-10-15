const isoDate = new Date(); // Example ISO date (UTC)
const date = new Date(isoDate);

// Convert to Indian Standard Time (IST) by manually adjusting offset
const istOffset = 5.5 * 60; // IST is UTC+5:30
const istTime = new Date(date.getTime() + istOffset * 60 * 1000);

// Format back to ISO string in the desired format (without the time zone suffix 'Z')
// const isoIST = istTime.toISOString().replace('Z', '');

// Output the formatted IST time in ISO format
console.log( new Date(istTime));
// console.log(new Date().getTimezoneOffset());
