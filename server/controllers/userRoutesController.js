import { badRes, goodRes, isNotEmpty } from "./index.js";
import { userRouteModel } from "../models/userRoutesModel.js"
import { placeModel } from "../models/placesModel.js";
import { userModel } from "../models/authModel.js";

export class UserRoutes {

    static setRecentCmp = async (userId, cmpName) => {
        // console.log(userId,cmpName);

        try {
            const exist = await userModel.findOne({ _id: userId })
            // console.log(exist);

            if (exist) {
                exist.recentCompany = cmpName.trim();
                await exist.save()
            }
        } catch (error) {
            console.log(error);

        }
    }

    static addRoute = async (req, res) => {
        const userId = req?.user?._id || null

        try {

            const { whereTo, whereFrom, amount, travelBy, company, date: { dateValue: { startDate }, type } } = req.body;
            console.log(startDate, type);

            let chooseDate = !startDate == null && startDate ? startDate : new Date();
            console.log(chooseDate);


            if (whereTo && whereFrom && amount && travelBy && userId || type == "new") {
                let todayDate = new Date(chooseDate);
                let startDate = new Date(chooseDate);
                await this.addPlace(whereFrom, whereTo);
                this.setRecentCmp(userId, company?.cmpName)

                // transform time of choosed date 
                startDate.setHours(0, 0, 0, 0);
                todayDate.setHours(23, 59, 59, 999);
                // console.log(startDate,todayDate);


                const existTravelRoute = await userRouteModel.findOne({ $and: [{ createdAt: { $lte: todayDate } }, { createdAt: { $gte: startDate } }, { userId }, { "company.cmpId": company?.cmpId }] })
                console.log(existTravelRoute);

                if (existTravelRoute) {
                    existTravelRoute?.travel?.push({ whereTo, whereFrom, amount, travelBy, date: chooseDate })
                    if (existTravelRoute.save()) {
                        return goodRes({ res, data: existTravelRoute, message: "booked" })
                    }
                    else return badRes({ res, error })


                } else if (!existTravelRoute && type == "update") {

                    return badRes({ res, message: "no previous records", data: [] });

                } else {
                    return await userRouteModel.create({
                        userId,
                        travel: [{
                            whereTo, whereFrom, amount, travelBy, date: chooseDate
                        }],
                        company: {
                            cmpName: company.cmpName.trim(),
                            cmpId: company.cmpId.trim()
                        }, createdAt: chooseDate

                    }).then((result) => {
                        result.save()
                        return goodRes({ res, data: result, message: "booked" })
                    }).catch((error) => {
                        console.log(error);

                        return badRes({ res, error })

                    })
                }


            }
            return badRes({ res, message: "all fields are required" })
        } catch (error) {
            console.log(error);

            return badRes({ res, message: "internal error" })


        }
    }

    static deleteRoute = async (req, res) => {
        try {
            const { cmpId, routeId, date, deleteFrom } = req.body;
            const userId = req.user._id;


            if (isNotEmpty(cmpId) && isNotEmpty(routeId) && isNotEmpty(date) && isNotEmpty(userId)) {
                const startDate = new Date(date);
                const endDate = new Date(date);
                startDate.setHours(0, 0, 0, 0)
                endDate.setHours(23, 59, 59, 999);


                const existTravelRoute = await userRouteModel.findOneAndUpdate(
                    { $and: [{ createdAt: { $lte: endDate } }, { createdAt: { $gte: startDate } }, { userId }, { "company.cmpId": cmpId }] },
                    { $pull: { travel: { _id: routeId } } },
                    { new: true } // To return the updated document
                );
                if (existTravelRoute) {
                    return goodRes({ res, data: { existTravelRoute, deleteFrom }, message: "removed", })
                } else {
                    return badRes({ res, data: [], message: "already removed" })
                }
            }





        } catch (error) {
            return badRes({ res, data: [], message: "internal  error" })
        }
    }

    static addPlace = async (whereFrom, whereTo) => {
        whereFrom = whereFrom.toLowerCase().trim()
        whereTo = whereTo.toLowerCase().trim()


        try {
            const existPlace1 = await placeModel.findOne({ name: whereFrom })
            const existPlace2 = await placeModel.findOne({ name: whereTo })
            if (!existPlace1) {
                return await placeModel({
                    name: whereFrom
                }).save()
            }
            if (!existPlace2) {
                return await placeModel({
                    name: whereTo
                }).save()
            }


        } catch (error) {
            console.log(error);

        }
    }

    static getRecentRoutes = async (req, res) => {

        try {

            const userId = req?.user?._id || null
            const company = req?.user?.company?.map((item) => {
                return item.cmpName
            })

            if (userId && company.length != 0) {
                await userRouteModel.aggregate([
                    {
                        $match: { userId }  // Match by userId
                    },
                    {
                        $unwind: "$travel"  // Unwind the travel array so each travel log can be processed individually
                    },
                    {
                        $addFields: {
                            travelDate: {
                                $dateToString: { format: "%Y-%m-%d", date: '$travel.date', "timezone": "+05:30" }  // Extract the date (YYYY-MM-DD)
                            },
                            //   travelDate:'$travel.date'
                        }
                    },
                    {
                        $match: { "company.cmpName": { $in: company }, } // Filter based on the company names

                    },
                    {
                        $group: {
                            _id: { travelDate: "$travelDate", company: "$company.cmpName", cmpId: "$company.cmpId" },  // Group by date and company name
                            travelDetails: {
                                $push: {
                                    whereTo: "$travel.whereTo",
                                    whereFrom: "$travel.whereFrom",
                                    travelBy: "$travel.travelBy",
                                    amount: "$travel.amount",
                                    date: "$travel.date",
                                    _id: "$travel._id"
                                }
                            }
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.travelDate",  // Group by travel date
                            companies: {
                                $push: {
                                    company: "$_id.company",
                                    cmpId: "$_id.cmpId",
                                    travelDetails: "$travelDetails"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,  // Exclude the default _id field
                            date: "$_id",  // Rename the _id field to "date"
                            companies: 1  // Include the companies array
                        }
                    },
                    {
                        $sort: { "date": -1 }
                    }, {
                        $limit: 3
                    }
                ])
                    .then(result => {
                        //   console.log(result);
                        //   res.send(result) 
                        goodRes({ res, data: result }) // Output the result object
                    })
                    .catch(err => {
                        badRes({ res, })
                        console.error(err);
                    });
            }
            else {
                badRes({ res, message: "internal error" })
            }
        } catch (error) {

            badRes({ res, message: "internal error" })

        }




    }
    static getFilterOption = async (filterData) => {


        let filterOption = {travelArray: {
            $filter: {
                input: "$travel",
                as: "travelItem",
                cond: {
                    $and: [
                     // Filter for amount <= maxAmount
                    ]
                } // Filter travel records where amount > 40
            }
        }};
        try {
            if(!isNotEmpty(filterData)) return {}
            const { date, amount, paymentStatus } = filterData;
            console.log(date);
            
            if (isNotEmpty(date)) {
                if (Object.keys(date).includes("range") && isNotEmpty(date.range)) {
                    let { startDate, endDate } = date.range;
                    if (startDate && endDate)
                        filterOption.createdAt = {
                            $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
                            $lte:new Date( new Date(endDate).setHours(23, 59, 59, 999))
                        }

                }
                else if (Object.keys(date).includes("today")) {
                    filterOption.createdAt = {
                        $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                        $lte: new Date(new Date().setHours(23, 59, 59, 999))
                    }
                } else if (Object.keys(date).includes("yesterday")) {
                    let y = new Date(new Date().setDate(new Date().getDate() - 1));
                    console.log(y);

                    filterOption.createdAt = {
                        $gte: new Date(y.setHours(0, 0, 0, 0)),
                        $lte: new Date(y.setHours(23, 59, 59, 999))
                    }
                }
                // console.log(date,);       
            }
            if (isNotEmpty(amount)) {
                const { min, max } = amount;
                if (min && max)
                    filterOption.travelArray.$filter.cond.$and.push( { $gte: ["$$travelItem.amount", parseInt(min)] },
                { $lte: ["$$travelItem.amount", parseInt(max)] })
            }
            if (isNotEmpty(paymentStatus)) {
                console.log(paymentStatus);
                const {paid, unpaid}=paymentStatus
                if(paid){
                    filterOption.travelArray.$filter.cond.$and.push({$eq:["$$travelItem.payStatus",true]})
                }
                if(unpaid){
                    filterOption.travelArray.$filter.cond.$and.push({$eq:["$$travelItem.payStatus",false]})
                }
            }


            return filterOption

        } catch (error) {
            console.log(error);
                return {}
            
        }
    }

    static getRandomRoutes = async (req, res) => {
        const { limit, skip, company } = req.query;
        const userId = req?.user?._id
        const { recentCompany } = req.user;
        // console.log(recentCompany,userId,company);
        let cmpName = isNotEmpty(company) ? company : recentCompany;
        const filterOption=await this.getFilterOption(req.body.filter, res)
        try {
          const travelRoute= await userRouteModel.aggregate([
                { $match: { $expr : { $eq: [ '$userId' , { $toObjectId: userId } ] },  createdAt: filterOption.createdAt || {$lte:new Date()},"company.cmpName":cmpName} },
                {
                    $sort: {
                        createdAt: -1 // Sort by createdAt in descending order
                    }
                },
                {
                    $limit: 5 // Limit the results to 5 documents
                },
                   {
                       $project: {
                           _id: 1,
                           userId: 1,
                           company: 1,
                           travel: filterOption.travelArray || 1,
                           createdAt: 1,
                           updatedAt: 1
                       }
                   },
                   {
                       $match: {
                           "travel.0": { $exists: true } // Ensure only documents with matching travel records are returned
                       }
                   },
               ])
               if(travelRoute.length!=0){
                        goodRes({res,data:travelRoute})
                    }else badRes({res,message:"not found"})

               
        } catch (error) {
            badRes({res,})
                console.log(error);
        }


    }
    static searchPlace = async (req, res) => {
        try {
            const { srhParam } = req.query;
            console.log(srhParam);

            if (srhParam) {
                const regex = new RegExp("^" + srhParam, "i")
                const places = await placeModel.find({ name: { $regex: regex } });


                return goodRes({ res, data: places })
            } else {
                badRes({ res, message: "not found" })
            }

        } catch (error) {
            badRes({ res, message: "internal error" })

        }
    }

    // detail page controller
    static addCompany = async (req, res) => {
        try {
            const { _id, company } = req.user;
            const { cmpName } = req.body;

            if (_id && cmpName) {
                if (company.find((ell) => ell.cmpName == cmpName)) {
                    return goodRes({ res, data: [], message: "already added" })

                } else {
                    const existCmp = await userModel.findOneAndUpdate(
                        { _id },// The filter for the document you want to update
                        {
                            $addToSet: {
                                company: { cmpName: cmpName.trim(), recentPayment: new Date() } // Add new company if it doesn't exist
                            },
                            $set: {
                                recentCompany: cmpName.trim()// Set the most recent company
                            }
                        }, {
                        projection: { userName: 0, userEmail: 0, profileImage: 0, password: 0, userToken: 0 },
                        returnDocument: "after"
                    }
                    );
                    return goodRes({ res, data: existCmp?.company, message: "successfully added" })
                }


            } else {
                return badRes({ res, message: "field is empty", data: [] })
            }

        } catch (error) {
            return badRes({ res, message: "internal error", data: [] })

        }
    }
    static getDetails = async (req, res) => {
        try {
            const { _id, company } = req.user;

            goodRes({ res, data: { company } })
        } catch (error) {
            badRes({ res, message: "internal error" })
        }
    }
}


[{
    "companies": [
        {
            "company": "manish",
            "travelDetails": [
                {
                    "whereTo": "meerut ",
                    "whereFrom": "lucknow",
                    "travelBy": "metro",
                    "amount": 30,
                    "date": "2024-10-10T18:36:06.679Z",
                    "_id": "67081e96f8a3cf5d7639b22b"
                },
                {
                    "whereTo": "mayur vihar",
                    "whereFrom": "asharm",
                    "travelBy": "metro",
                    "amount": 25,
                    "date": "2024-10-10T18:46:05.769Z",
                    "_id": "670820ed75d9dd12bb429930"
                },
                {
                    "whereTo": "mumbai",
                    "whereFrom": "kanpur",
                    "travelBy": "metro",
                    "amount": 200,
                    "date": "2024-10-10T19:41:41.774Z",
                    "_id": "67082df53be42cc8f38268f1"
                }
            ]
        }
    ],
    "date": "2024-10-10T18:36:06.683Z"
}, {
    "companies": [
        {
            "company": "krisna oversiease",
            "travelDetails": [
                {
                    "whereTo": "agra",
                    "whereFrom": "asharm",
                    "travelBy": "rapido",
                    "amount": 56,
                    "date": "2024-10-10T19:51:01.260Z",
                    "_id": "67083025726e33449cbd6c46"
                }
            ]
        }
    ],
    "date": "2024-10-10T19:51:01.261Z"
},]