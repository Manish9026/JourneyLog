import { DateTime } from 'luxon'

const badRes = ({ message, statusCode, data, error, status, res } = {}) => {
  return res.status(statusCode || 201).json({
    message: message || "try after some time",
    data: data || null,
    error: error || null,
    status: false,
  })
}
const goodRes = ({ message, statusCode, data, status, res } = {}) => {
  return res.status(statusCode || 201).json({
    message: message || "success",
    data: data || null,
    status: true,
  })
}
function convertToTimeZone(dateString) {
  // Parse the date in UTC


  const date = DateTime.fromISO(new Date(dateString).toISOString(), { zone: 'UTC' }).setZone((Intl.DateTimeFormat().resolvedOptions().timeZone))
  console.log(date);

  // Convert to the desired time zone
  return date.toISO();
}
const startingDate = (date) => {
  const d = new Date(date);

  
if( d.getUTCHours()*60 +d.getUTCMinutes() < 18*60 +30){

  d.setUTCDate(d.getUTCDate() - 1);
  d.setUTCHours(18, 30, 0, 0)
  console.log("starting date",d);

    return d
  }
    else{
    d.setUTCHours(18, 30, 0, 0)
  console.log("starting date",d);

    return d
  }
}
const endingDate = (date) => {
  const d = new Date(date);

if( d.getUTCHours()*60 +d.getUTCMinutes() <=18*60 +30){

  d.setUTCHours(18, 29, 59, 999);
  console.log("ending date",d);
  
    return d
}else{
    let end = new Date(d);
    end.setUTCDate(d.getUTCDate() + 1);
    end.setUTCHours(18, 29, 59, 999);
  console.log("ending date",end);

    return end
}
}
const isNotEmpty = (value) => {
  if (value == 'null' || value == 'undefined') {
    return false;
  }
  if (value === null || value == undefined) {
    return false;
  }

  if (typeof value === 'string') {
    return value.trim() !== '';
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true; // For other data types, assume non-empty if not null/undefined
}

export { badRes, goodRes, isNotEmpty, startingDate, endingDate, convertToTimeZone }
// console.log(convertToTimeZone("2024-10-18T00:00:00.000Z"))
