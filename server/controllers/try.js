import { DateTime } from "luxon";

const data = [
  {
    "_id": "6713fd896eaeef7fa35352d0",
    "userId": "6709349de5c2064c0a70b447",
    "company": {
      "cmpName": "Krishna private limited",
      "cmpId": "670934fbe5c2064c0a70b468",
      "_id": "6713fd896eaeef7fa35352d1"
    },
    "createdAt": "2024-10-19T18:42:16.862Z",
    "updatedAt": "2024-10-20T04:07:10.120Z",
    "travel": [
      {
        "whereTo": "lagpat nagar",
        "whereFrom": "mahindra departmental store",
        "travelBy": "metro",
        "amount": 50,
        "date": "2024-10-19T18:42:16.862Z",
        "payStatus": false,
        "_id": "6713fd896eaeef7fa35352d2"
      },
      {
        "whereTo": "moti nagar",
        "whereFrom": "ashram",
        "travelBy": "metro",
        "amount": 36,
        "date": "2024-10-19T19:31:14.326Z",
        "payStatus": false,
        "_id": "671409033ec9bd4764d7c3a6"
      },
      {
        "whereTo": "rk ashram marg",
        "whereFrom": "mayur vihar extension ",
        "travelBy": "metro",
        "amount": 20,
        "date": "2024-10-20T04:07:09.904Z",
        "payStatus": false,
        "_id": "671481ee2baf52981bb7f271"
      }
    ]
  },
  {
    "_id": "6712c1c1a310e898aa77741c",
    "userId": "6709349de5c2064c0a70b447",
    "company": {
      "cmpName": "Krishna private limited",
      "cmpId": "670934fbe5c2064c0a70b468",
      "_id": "6712c1c1a310e898aa77741d"
    },
    "createdAt": "2024-10-18T20:14:56.905Z",
    "updatedAt": "2024-10-19T12:43:12.104Z",
    "travel": [
      {
        "whereTo": "ashram",
        "whereFrom": "mayur vihar",
        "travelBy": "rapido",
        "amount": 36,
        "date": "2024-10-19T12:43:11.901Z",
        "payStatus": false,
        "_id": "6713a960f94192408d3212d8"
      }
    ]
  }
]


// const getFormattedTravelCountPerDay = (data) => {
//   const travelByCount = {};

//   data.forEach(record => {
//       record.travel.forEach(travelEntry => {
//           const date = new Date(travelEntry.date).toLocaleDateString('en-GB', {
//               day: 'numeric',
//               month: 'short'
//           }); // Format date as "15 Aug"
//           const travelBy = travelEntry.travelBy.toLowerCase();

//           // Initialize if date is not in the object yet
//           if (!travelByCount[date]) {
//               travelByCount[date] = { metro: 0, rapido: 0, auto: 0, other: 0, date: date };
//           }

//           // Increment counts for specific travel methods or count as 'other' if it doesn't match known methods
//           if (travelByCount[date][travelBy] !== undefined) {
//               travelByCount[date][travelBy]++;
//           } else {
//               travelByCount[date].other++;
//           }
//       });
//   });

//   // Convert the object into an array format
//   return Object.values(travelByCount);
// };
// console.log(getFormattedTravelCountPerDay(data));
// console.log(21%12);
// console.log(new Date(Date.UTC(2024,10,21,22,30,30)));




// Extract top-level _id values
const result = data.reduce((acc, item) => {
  // Collect top-level _id
  acc.topLevelIds.push(item._id);
  
  // Collect travel _id values
  acc.travelIds.push(...item.travel.map(travel => travel._id));
  return acc;
}, { topLevelIds: [], travelIds: [] });

console.log("Top-level _id values:", result.topLevelIds);
console.log("Travel _id values:", result.travelIds);


let date1 = new Date("03/16/2024");
let date2 = new Date("05/26/2024");

// Calculating the time difference
// of two dates
let Difference_In_Time =
    date2 - date1

// Calculating the no. of days between
// two dates
console.log(Difference_In_Time);

let Difference_In_Days =
    Math.abs(Math.floor
        (Difference_In_Time / (1000 * 3600 * 24)))

// To display the final no. of days (result)
console.log
    ("Total number of days between dates:\n" +
        date1.toDateString() + " and " +
        date2.toDateString() +
        " is: " + Difference_In_Days + " days");
