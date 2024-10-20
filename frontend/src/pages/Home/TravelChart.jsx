import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import Box from '@mui/material/Box';
import { getFormattedTravelCountPerDay } from '../../utils/dataTransformation';
// export const dataset = [
//     {
//       london: 59,
//       paris: 57,
//       newYork: 86,
//       seoul: 21,
//       month: 'Jan',
//     },
//     {
//       london: 50,
//       paris: 52,
//       newYork: 78,
//       seoul: 28,
//       month: 'Feb',
//     },
//     {
//       london: 47,
//       paris: 53,
//       newYork: 106,
//       seoul: 41,
//       month: 'Mar',
//     },
//     {
//       london: 54,
//       paris: 56,
//       newYork: 92,
//       seoul: 73,
//       month: 'Apr',
//     },
//     {
//       london: 57,
//       paris: 69,
//       newYork: 92,
//       seoul: 99,
//       month: 'May',
//     },
//     {
//       london: 60,
//       paris: 63,
//       newYork: 103,
//       seoul: 144,
//       month: 'June',
//     },
//     {
//       london: 59,
//       paris: 60,
//       newYork: 105,
//       seoul: 319,
//       month: 'July',
//     },
//     {
//       london: 65,
//       paris: 60,
//       newYork: 106,
//       seoul: 249,
//       month: 'Aug',
//     },
//     {
//       london: 51,
//       paris: 51,
//       newYork: 95,
//       seoul: 131,
//       month: 'Sept',
//     }, {
//         london: 59,
//         paris: 57,
//         newYork: 86,
//         seoul: 21,
//         month: 'Jan',
//       },
//       {
//         london: 50,
//         paris: 52,
//         newYork: 78,
//         seoul: 28,
//         month: 'Feb',
//       },
//       {
//         london: 47,
//         paris: 53,
//         newYork: 106,
//         seoul: 41,
//         month: 'Mar',
//       },
//       {
//         london: 54,
//         paris: 56,
//         newYork: 92,
//         seoul: 73,
//         month: 'Apr',
//       },
//       {
//         london: 57,
//         paris: 69,
//         newYork: 92,
//         seoul: 99,
//         month: 'May',
//       },
//       {
//         london: 60,
//         paris: 63,
//         newYork: 103,
//         seoul: 144,
//         month: 'June',
//       },
//       {
//         london: 59,
//         paris: 60,
//         newYork: 105,
//         seoul: 319,
//         month: 'July',
//       },
//       {
//         london: 65,
//         paris: 60,
//         newYork: 106,
//         seoul: 249,
//         month: 'Aug',
//       },
//       {
//         london: 51,
//         paris: 51,
//         newYork: 95,
//         seoul: 131,
//         month: 'Sept',
//       },
//     {
//       london: 60,
//       paris: 65,
//       newYork: 97,
//       seoul: 55,
//       month: 'Oct',
//     },
//     {
//       london: 67,
//       paris: 64,
//       newYork: 76,
//       seoul: 48,
//       month: 'Nov',
//     },
   
//   ];
  const dataset=[
    { metro: 3, rapido: 2, auto: 1, other: 9, date: '20 Oct' },
    { metro: 0, rapido: 1, auto: 0, other: 0, date: '19 Oct' }, 
    { metro: 3, rapido: 2, auto: 1, other: 9, date: '21 Oct' },
    { metro: 0, rapido: 1, auto: 0, other: 0, date: '22 Oct' },
    { metro: 3, rapido: 2, auto: 1, other: 9, date: '23 Oct' },
    { metro: 0, rapido: 1, auto: 0, other: 0, date: '24 Oct' }, 
    { metro: 3, rapido: 2, auto: 1, other: 9, date: '25 Oct' },
    { metro: 0, rapido: 1, auto: 0, other: 0, date: '23 nov' },
    { metro: 0, rapido: 1, auto: 0, other: 0, date: '27 Oct' }

  ]
  export function valueFormatter(value) {
    return `${value}mm`;
  }
  
const chartSetting = {
  yAxis: [
    {
      label: 'Travel count',
      labelStyle: {
        fill: 'blue', fontSize: '14px' , // Styling for the Y-axis labels
      },
    },
 
  ],


  sx: {
    [`.${axisClasses.left} .${axisClasses.label} `]: {
    //   transform: 'translate(0px, 0)',
    },
    [`.MuiBarElement-series-l_id`]: {
        stroke: '#006BD6',
      },
      [`.${axisClasses.root}`]: {
        [`.${axisClasses.tick}, .${axisClasses.line}`]: {
          stroke: 'white',
          strokeWidth: 3,
        },
        [`.${axisClasses.tickLabel}`]: {
          fill: 'gray'
        //   margin:30
        },
      },
//  backgroundColor: '',
  },
  
};
const label=[["metro","metro",'#1875f3'],["rapido","rapido",'#fae05c'],["auto","auto",'#28f9f6'],["other","other",'#c328f9']]
const series=()=>{
    let series=[];
    label.map((item)=>{
    series.push( {dataKey:item[0], label:item[1] ,color: item[2] })
})
return series
}
export default function TravelChart({travelDetail,loading}) {

   
  return (
    travelDetail.length!=0 ?  <Box  sx={{ width: '100%',minHeight:"200px" ,flex:1,textTransform:"capitalize", color:"gray" }}>
        <BarChart
        //  width="100%" // Set width and height to 100% for responsiveness
        // height="100%"
    dataset={getFormattedTravelCountPerDay(travelDetail) || []}
      xAxis={[{ scaleType: 'band', dataKey: 'date',tickPlacement:"end",tickLabelPlacement:"middle",tickLabelStyle:{fontSize:"10px"} }]}
      series={series()}
      {...chartSetting}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'top', horizontal: 'right' },
          padding:10,
          labelStyle: {
            fontSize: 14,
            fill: '#e3f5f4',
          },
       
        },
      }}
  
    />
    </Box>:<div className='w-full capitalize m-1 h-full secondary-font center   border-b-2 border-l-2 min-h-[200px]'>
       {loading? "loading...":"no record"}
    </div>
  );
}
