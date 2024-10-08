const recentRoutes = [
	{
		"_id": "6703e70db9309be0a9a72592",
		"userId": "6703d74de654f5598df72a31",
		"travel": [
			{
				"whereTo": "mayur vihar extention",
				"whereFrom": "asharm ",
				"travelBy": "rapido",
				"amount": 56,
				"_id": "6703e70db9309be0a9a72593",
				"date": "2024-10-07T13:50:05.888Z"
			},
			{
				"whereTo": "asharm",
				"whereFrom": "mayur vihar",
				"travelBy": "rapido",
				"amount": 56,
				"_id": "6703e714b9309be0a9a725a1",
				"date": "2024-10-07T13:50:12.421Z"
			},
			{
				"whereTo": "meerut",
				"whereFrom": "new delhi",
				"travelBy": "metro",
				"amount": 5000,
				"_id": "6703e847b9309be0a9a72635",
				"date": "2024-10-07T13:55:19.207Z"
			}
		],
		"createdAt": "2024-10-07T13:50:05.893Z",
		"updatedAt": "2024-10-07T13:55:19.210Z",
		"__v": 2
	},
	{
		"_id": "6704ed07b9309be0a9a72680",
		"userId": "6703d74de654f5598df72a31",
		"travel": [
			{
				"whereTo": "rajori garden",
				"whereFrom": "tilak nagar",
				"travelBy": "metro",
				"amount": 500,
				"_id": "6704ed07b9309be0a9a72681",
				"date": "2024-10-08T08:27:51.805Z"
			}
		],
		"createdAt": "2024-10-08T08:27:51.806Z",
		"updatedAt": "2024-10-08T08:27:51.806Z",
		"__v": 0
	}
]

const result=recentRoutes.reduce((sum,item)=>sum + item.travel.reduce((sum,data)=>sum + data.amount,0),0)
console.log(result);
