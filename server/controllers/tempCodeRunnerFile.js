
 const startingDate=(date)=>{
  const d=new Date(date);
  const yesterday = new Date(d);
yesterday.setUTCDate(d.getUTCDate() - 1);
yesterday.setUTCHours(0, 0, 0, 0); 
  return yesterday
 }
 console.log(startingDate("2024-10-31T18:30:00.000Z"));
 