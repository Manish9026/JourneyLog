const company= [
    {
      "cmpName": "manish",
      "recentPayment": {
        "$date": "2024-10-09T08:29:27.555Z"
      },
      "_id": {
        "$oid": "67063ee7f423a223a09a116d"
      },
      "createdAt": {
        "$date": "2024-10-09T08:29:27.559Z"
      }
    },
    {
      "cmpName": "krisna oversiease",
      "recentPayment": {
        "$date": "2024-10-09T09:00:02.913Z"
      },
      "_id": {
        "$oid": "6706461257c266357d3c71cd"
      },
      "createdAt": {
        "$date": "2024-10-09T09:00:02.915Z"
      }
    },
    {
      "cmpName": "ANQ private limited",
      "recentPayment": {
        "$date": "2024-10-09T10:34:00.441Z"
      },
      "_id": {
        "$oid": "67065c180bc56e36d4de21bf"
      },
      "createdAt": {
        "$date": "2024-10-09T10:34:00.444Z"
      }
    },
    {
      "cmpName": "shatya interprices company",
      "recentPayment": {
        "$date": "2024-10-09T10:34:28.166Z"
      },
      "_id": {
        "$oid": "67065c340bc56e36d4de21cc"
      },
      "createdAt": {
        "$date": "2024-10-09T10:34:28.166Z"
      }
    }
  ]

 const cmp= company.map((item)=>{
    return item.cmpName
  })
  console.log(cmp);
  