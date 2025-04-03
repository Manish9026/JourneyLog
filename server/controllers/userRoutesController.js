import { badRes, convertToTimeZone, endingDate, goodRes, isNotEmpty, startingDate } from "./index.js";
import { userRouteModel } from "../models/userRoutesModel.js"
import { placeModel } from "../models/placesModel.js";
import { userModel } from "../models/authModel.js";
import mongoose from "mongoose";

export class UserRoutes {





    static dateDiff = (startDate, endDate) => {
        console.log(startDate, endDate);

        let Difference_In_Time =
            new Date(startDate) - new Date(endDate)

        // Calculating the no. of days between
        // two dates

        return (Math.abs(Math.floor(Difference_In_Time / (1000 * 3600 * 24))))
    }
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

            const { whereTo, whereFrom, amount, travelBy, company, date: { dateValue , type } } = req.body;
            console.log(dateValue, type,company);


            let chooseDate = dateValue !== null && dateValue ? new Date(dateValue) : new Date();



            // chooseDate.setTime(chooseDate.getTime() + chooseDate.getTimezoneOffset() * 60 * 1000); // Adjust for timezone offset
            // console.log(chooseDate,startingDate(chooseDate), endingDate(chooseDate));


            if (whereTo && whereFrom && amount && travelBy && userId || type == "new") {
                await this.addPlace(whereFrom, whereTo);
                this.setRecentCmp(userId, company?.cmpName)

                // validate existing routes is available or not 
                const existTravelRoute = await userRouteModel.findOne({ $and: [{ createdAt: { $lte: endingDate(chooseDate) } }, { createdAt: { $gte: startingDate(chooseDate) } }, { userId }, { "company.cmpId": company?.cmpId }] })
                console.log(existTravelRoute);

                if (existTravelRoute) {
                    existTravelRoute?.travel?.push({ whereTo, whereFrom, amount, travelBy, date: chooseDate })
                    if (existTravelRoute.save()) {
                        return goodRes({ res, data: existTravelRoute, message: "Record added" })
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
                        return goodRes({ res, data: result, message: "record added" })
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
            const { cmpId, routeId, date, deleteFrom, parentId } = req.body;
            const userId = req.user._id;

            if (isNotEmpty(cmpId) && isNotEmpty(routeId) && isNotEmpty(userId) && isNotEmpty(parentId)) {
                const existTravelRoute = await userRouteModel.findOneAndUpdate(
                    { $and: [{ _id: parentId }, { userId }, { "company.cmpId": cmpId }] },
                    { $pull: { travel: { _id: routeId } } },
                    { new: true } // To return the updated document
                )
                if (existTravelRoute) {
                    if (existTravelRoute && existTravelRoute?.travel?.length == 0) {
                        await userRouteModel.deleteOne({ _id: parentId })
                    }

                    return goodRes({ res, data: { existTravelRoute, deleteFrom }, message: "removed", })
                } else {
                    return badRes({ res, data: [], message: "already removed" })
                }
            }





        } catch (error) {
            return badRes({ res, data: [], message: "internal  error" })
        }
    }
    static updateTravelRoute = async (req, res) => {

        const { whereFrom, whereTo, travelBy, parentId, cmpId, _id, amount, editFrom, payStatus } = req.body;
        const userId = req.user._id;
        console.log(payStatus == "false" ? false : true, payStatus);


        try {
            if (isNotEmpty(parentId) && isNotEmpty(cmpId) && isNotEmpty(userId)) {
                const updatedDocument = await userRouteModel.findOneAndUpdate(
                    { _id: parentId, userId, "travel._id": _id, "company.cmpId": cmpId },  // Match the document and specific travel item
                    { $set: { "travel.$.whereFrom": whereFrom, "travel.$.whereTo": whereTo, "travel.$.amount": amount, "travel.$.travelBy": travelBy, "travel.$.payStatus": payStatus == "true" ? true : false } },         // Use the positional operator "$" to update the specific element
                    { new: true, runValidators: true }            // Return the updated document and run validation
                );
                if (updatedDocument)
                    goodRes({ res, data: { editFrom, message: "updated" } })
            }
            else {
                goodRes({ res, message: "please choose correct option" })
            }


        } catch (err) {
            badRes({ res, message: "internal error" })
            console.error("Error updating travel:", err);
        }
    };


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
                        $match: { userId } // Match by userId
                    },
                    {
                        $unwind: "$travel" // Unwind the travel array
                    },
                    {
                        $addFields: {
                            travelDate: {
                                $dateToString: { format: "%Y-%m-%d", date: "$travel.date", "timezone": "+05:30" } // Format the date
                            }
                        }
                    },
                    {
                        $match: { "company.cmpName": { $in: company } } // Match documents by company names
                    },
                    {
                        $group: {
                            _id: {
                                travelDate: "$travelDate",
                                company: "$company.cmpName",
                                cmpId: "$company.cmpId"
                            },
                            travelDetails: {
                                $push: {
                                    whereTo: "$travel.whereTo",
                                    whereFrom: "$travel.whereFrom",
                                    travelBy: "$travel.travelBy",
                                    amount: "$travel.amount",
                                    date: "$travel.date",
                                    _id: "$travel._id"
                                }
                            },
                            // Store the original document's _id for later use
                            routeId: { $first: "$_id" } // Use $first to get the _id from the first document in the group
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.travelDate", // Group by travel date
                            routeId: { $first: "$routeId" }, // Retain the routeId
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
                            _id: 0, // Exclude default _id
                            date: "$_id", // Rename the grouped _id to "date"
                            companies: 1,
                            routeId: 1 // Include the routeId
                        }
                    },
                    {
                        $sort: { date: -1 } // Sort by date descending
                    },
                    {
                        $limit: 3 // Limit the output to 3 documents
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


        let filterOption = {
            travelArray: {
                $filter: {
                    input: "$travel",
                    as: "travelItem",
                    cond: {
                        $and: [
                            // Filter for amount <= maxAmount
                        ]
                    } // Filter travel records where amount > 40
                }
            }, limit: 0
        };
        try {
            if (!isNotEmpty(filterData)) return {}
            const { date, amount, paymentStatus } = filterData;
            // console.log(date);

            if (isNotEmpty(date)) {
                if (Object.keys(date).includes("range") && isNotEmpty(date.range)) {
                    let { startDate, endDate } = date.range;
                    if (startDate && endDate)
                        filterOption.createdAt = {
                            $gte: startingDate(startDate),
                            $lte: endingDate(endDate)
                        }
                    filterOption.limit = this.dateDiff(startDate, endDate) + 1;


                }
                else if (Object.keys(date).includes("today")) {
                    filterOption.createdAt = {
                        $gte: startingDate(new Date().toISOString()),
                        $lte: endingDate(new Date().toISOString())
                    }
                } else if (Object.keys(date).includes("yesterday")) {
                    let y = new Date();
                    y.setUTCDate(new Date().getUTCDate() - 1)
                    filterOption.createdAt = {
                        $gte: startingDate(y),
                        $lte: endingDate(y)
                    }
                }
                // console.log(date,);       
            }
            if (isNotEmpty(amount)) {
                const { min, max } = amount;
                if (min && max)
                    filterOption.travelArray.$filter.cond.$and.push({ $gte: ["$$travelItem.amount", parseInt(min)] },
                        { $lte: ["$$travelItem.amount", parseInt(max)] })
            }
            if (isNotEmpty(paymentStatus)) {
                console.log(paymentStatus);
                const { paid, unpaid } = paymentStatus
                if (paid) {
                    filterOption.travelArray.$filter.cond.$and.push({ $eq: ["$$travelItem.payStatus", true] })
                }
                if (unpaid) {
                    filterOption.travelArray.$filter.cond.$and.push({ $eq: ["$$travelItem.payStatus", false] })
                }
            }


            return filterOption

        } catch (error) {
            console.log(error);
            return {}

        }
    }

    static getRandomRoutes = async (req, res) => {
        const { next, skip, company, getType } = req.query;
        const userId = req?.user?._id
        const { recentCompany } = req.user;
        let cmpName = isNotEmpty(company) ? company : recentCompany;
        const filterOption = await this.getFilterOption(req.body.filter)
        console.log(req.query);

        console.log(filterOption);


        try {
            const travelRoute = await userRouteModel.aggregate([
                { $match: { $expr: { $eq: ['$userId', { $toObjectId: userId }] }, createdAt: filterOption?.createdAt || { $lte: new Date() }, "company.cmpName": cmpName.trim() } },
                {
                    $sort: {
                        createdAt: -1 // Sort by createdAt in descending order
                    }
                },
                // {
                //     $limit: filterOption.limit || 5, // Limit the,
                //     // $ results to 5 documents
                //     // $skip: parseInt(skip) || 0
                // },
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
                {
                    $skip: parseInt(skip) || 0, // Skip documents based on pagination
                  },
                  {
                    $limit: parseInt(next) || 10, // Limit the number of documents per page
                  },
            ])
            if (travelRoute.length != 0) {
                if (getType == "home") {
                    const result = await this.getCombinedTotal(userId, cmpName)
                    console.log(result, "result");

                    goodRes({ res, data: { travelDetail: travelRoute, utilAmount: result } })
                } else {
                    goodRes({ res, data: {travelRoute:travelRoute || [],skip:parseInt(next),next:(parseInt(5))} })
                }
            }
            else badRes({ res, message: "not found",data:[] })


        } catch (error) {
            console.log(error);
            badRes({ res, })
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

    // home page 

    // Combined query to get total unpaid and today's total travel amount
    static getCombinedTotal = async (userId, cmpName) => {
        try {

            // const result = await userRouteModel.aggregate([
            //     { $unwind: "$travel" }, // Unwind the travel array
            //     {
            //         $match:{$expr : { $eq: [ '$userId' , { $toObjectId: userId } ] },"company.cmpName":cmpName.trim()}
            //     },
            //     // Project fields for both conditions
            //     {
            //         $project: {
            //             unpaidAmount: {
            //                 $cond: [{ $eq: ["$travel.payStatus", false] }, "$travel.amount", 0] // Only unpaid amounts
            //             },
            //             todayAmount: {
            //                 $cond: [
            //                     {
            //                         $and: [
            //                             { $gte: ["$createdAt", startingDate(new Date())] }, // Check if date is today
            //                             { $lte: ["$createdAt", endingDate(new Date())] }
            //                         ]
            //                     },
            //                     "$travel.amount", // If the condition matches, include the amount
            //                     0 // Otherwise, set it to 0
            //                 ]
            //             }
            //         }
            //     },

            //     // Group to sum both unpaid and today's amounts
            //     {
            //         $group: {
            //             _id: null,
            //             totalUnpaid: { $sum: "$unpaidAmount" }, // Sum unpaid amounts
            //             todayTotal: { $sum: "$todayAmount" } // Sum today's amounts
            //         }
            //     }
            // ]);
            const result = await userRouteModel.aggregate([
                { $unwind: "$travel" }, // Unwind the travel array
                {
                    $match: {
                        $expr: {
                            $eq: ['$userId', { $toObjectId: userId }]
                        },
                        "company.cmpName": cmpName.trim()
                    }
                },
                // Project fields for amount and payment status
                {
                    $project: {
                        amount: "$travel.amount", // Include the amount (both paid and unpaid)
                        payStatus: "$travel.payStatus", // Include payment status
                        createdAt: "$createdAt" // Include the createdAt date
                    }
                },
                // Group to sum amounts and find min/max dates conditionally
                {
                    $group: {
                        _id: null, // Group all documents together
                        totalUnpaid: {
                            $sum: {
                                $cond: [{ $eq: ["$payStatus", false] }, "$amount", 0] // Sum unpaid amounts
                            }
                        },
                        totalPaid: {
                            $sum: {
                                $cond: [{ $eq: ["$payStatus", true] }, "$amount", 0] // Sum paid amounts
                            }
                        },
                        todayTotalUnpaid: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$createdAt", startingDate(new Date())] }, // Check if date is today
                                            { $lte: ["$createdAt", endingDate(new Date())] }
                                        ]
                                    },
                                    {
                                        $cond: [{ $eq: ["$payStatus", false] }, "$amount", 0] // Include only unpaid amounts for today
                                    },
                                    0 // Otherwise, add 0
                                ]
                            }
                        },
                        todayTotalPaid: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $gte: ["$createdAt", startingDate(new Date())] }, // Check if date is today
                                            { $lte: ["$createdAt", endingDate(new Date())] }
                                        ]
                                    },
                                    {
                                        $cond: [{ $eq: ["$payStatus", true] }, "$amount", 0] // Include only paid amounts for today
                                    },
                                    0 // Otherwise, add 0
                                ]
                            }
                        },
                        unpaidMinDate: {
                            $min: {
                                $cond: [{ $eq: ["$payStatus", false] }, "$createdAt", null] // Find min date only if unpaid
                            }
                        },
                        unpaidMaxDate: {
                            $max: {
                                $cond: [{ $eq: ["$payStatus", false] }, "$createdAt", null] // Find max date only if unpaid
                            }
                        }
                    }
                }
            ]);


            // Prepare the output message


            console.log(result);



            return result[0];
        } catch (err) {
            console.error(err);
            return []

        }
    };

    static deleteTravelRecordsForCompany = async (req,res
      ) => {

        
        try {
            const userId = req?.user?._id || null
            const { company: { cmpId },date: {startDate, endDate }} = req.body;

            if(!isNotEmpty(cmpId))
                 return badRes({ res, message: `please choose company!` });
            if(!(isNotEmpty(startDate) && isNotEmpty(endDate)))
                return badRes({ res, message: `date not entered yet` });

          const result = await userRouteModel.deleteMany(
            { $and: [ { userId }, { "company.cmpId": cmpId },{ createdAt: { $gte: startingDate(startDate), $lte: endingDate(endDate) }}] }, 
          );

            if (result.deletedCount > 0) {
                return goodRes({ res, message: `${result?.deletedCount} record deleted` });
            } else {
                return badRes({ res, message: "no records found" });
            }

        } catch (error) {
            console.error("Error deleting records:", error);
            return badRes({ res, message: "try after sometime" });

        }
      };

    static getTravelRecords = async (req, res) => {

        try {
            const userId = req?.user?._id || null
            const { company: { cmpId }} = req.query;


            if(!isNotEmpty(cmpId))
                return goodRes({ res, message: `please choose company!` });
            const result = await userRouteModel.aggregate([
                {
                  $match: {
                    userId: new mongoose.Types.ObjectId(userId), // Filter by userId
                    "company.cmpId": cmpId, // Filter by companyId
                  },
                },
                { $unwind: "$travel" }, // Split travel array into separate documents
                {
                    $group: {
                      _id: "$travel.payStatus", // Group by payment status (true/
                      minDate: { $min: "$travel.date" }, // Get earliest date
                      maxDate: { $max: "$travel.date" }, // Get latest date
                    },
                  },
              ]);
              const paid = result.find((r) => r._id === true) || { minDate: null, maxDate: null };
              const unpaid = result.find((r) => r._id === false) || { minDate: null, maxDate: null };

              return goodRes({ res, message: `please choose company!`,data:{paid,unpaid} });

            
        } catch (error) {

            console.log(error);
            return badRes({ res, message: "internal error" })
        }

    }  


    // static updateUserIdByCompany = async (companyId, newUserId) => {
    //     try {
    //       const result = await userRouteModel.updateMany(
    //         { "company.cmpId": companyId }, // Find documents where company.cmpId matches
    //         { $set: { userId: new mongoose.Types.ObjectId(newUserId) } } // Update userId
    //       );
      
    //       console.log("Update result:", result);
    //       return result;
    //     } catch (error) {
    //       console.error("Error updating userId:", error);
    //     }
    //   };
    
}

