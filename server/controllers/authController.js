
import formidable from 'formidable'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
import { imageUploader } from "../utils/imageUploader.js"
import { userModel } from '../models/authModel.js';


export class AuthTools {

    static hashPass = async (pass) => {
        const passwordKey = "manish", saltRounds = 15;


        return await bcrypt.hash(pass, saltRounds).then(hash => hash).catch(err => console.log(err))



    }
    static bycriptPass = (checkPass, hash) => {
        return bcrypt.compare(checkPass, hash).then(res => res).catch(err => console.log(err));
    }

    static genJWT_Token = async (userEmail, userId, authType) => {
        console.log(userEmail, userId);
        return await jwt.sign({ userEmail, userId, authType }, process.env.SECRET_KEY)


    }
    static tokenVerifier = async (token) => {

        return await jwt.verify(token, process.env.SECRET_KEY)


    }

    static getUserId = async (req) => {

        const { uid } = req.cookies
        if (uid)
            return await this.tokenVerifier(uid)
        else
            return { userId: undefined }

    }
    static getFormData = async (req) => {
        try {
            let formData;
            const form = formidable();
            form.parse(req, (err, fields, files) => {
                if (err) {
                    console.error('Error parsing form data:', err);
                    return
                }

                const file = files.file[0];
                //   const response=await imageUploader("C:\\Users\\manis\\AppData\\Local\\Temp\\d703c3da3ceeb867286c48d01")

                // console.log(file.filepath, fields);
                formData = {
                    filePath: file.filepath,
                    fields: fields
                }

            })

            // console.log(formData);
            return formData;
        } catch (error) {
            console.log(error);
        }
    }
}
export class Auth extends AuthTools {
    static login = async (req, res) => {
        try {

            console.log(req.body);

            let { userEmail, password, tc, } = req.body;
            userEmail = userEmail.toLowerCase();
            console.log(userEmail);
            if (userEmail && password) {
                let match = await userModel.findOne({ userEmail })
                console.log(match);
                if (match) {
                    if (await this.bycriptPass(password, match.password)) {

                        const loginToken = await this.genJWT_Token(match.userEmail, match._id)
                        console.log(loginToken);
                        //  delete match['password']
                        res.cookie("uid", loginToken, {
                            sameSite: process.env.DEPLOYMENT_TYPE == "local" ? 'Strict' : "None",
                            secure: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
                            httpOnly: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
                        }).json({
                            message: "successfully login",
                            status: true,
                            data: []
                        })
                    } else {
                        res.json({
                            message: "password not matched",
                            status: 0,
                            data: []
                        })
                    }
                }
                else {
                    res.json({
                        message: " Email not registered",
                        status: 0
                    })
                }


            } else {
                res.json({
                    message: "all fields are required",
                    status: false,

                })
            }





        }
        catch (error) {

            console.log(error);
        }




    }

    static register = async (req, res) => {
        try {
            const form = formidable();
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    console.log(err);
                    return
                }
                else {

                    if (files.file) {




                        const file = files.file[0]
                        const { filepath } = file;
                        let { userName, userEmail, password, mobileNo } = fields
                        userName = String(userName).toLowerCase();
                        userEmail = String(userEmail).toLowerCase();
                        password = String(password),
                            mobileNo = Number(mobileNo)

                        // console.log(fields,files);

                        // const imageUrl=await imageUploader(filepath)

                        console.log(userName, userEmail, mobileNo, password, filepath);

                        if (userEmail && userName && password) {
                            console.log("sadbhsd");
                            let hashedPass = await this.hashPass(password)
                            // console.log(hashedPass)
                            const match = await userModel.findOne({ userEmail })

                            if (!match) {
                                const imageUrl = await imageUploader(filepath)

                                console.log("hggff");
                                const userDetail = await userModel({

                                    userName,
                                    userEmail,
                                    password: hashedPass,
                                    // userProfile:""/
                                })


                                userDetail.userId = userDetail._id;
                                userDetail.profileImage = imageUrl;
                                const loginToken = await this.genJWT_Token(userDetail.userEmail, userDetail._id)
                                console.log(loginToken);
                                userDetail.userToken = loginToken;



                                if (await userDetail.save()) {

                                    res.cookie("uid", loginToken, {
                                        sameSite: 'None',
                                        secure: true,
                                        expires: new Date(Date.now() + 3600000)
                                    }).status(200).json({
                                        message: "successfully register",
                                        status: true
                                    })
                                } else {
                                    res.status(404).json({
                                        message: "try after some time",
                                        status: false
                                    })
                                }
                            }
                            else {
                                res.status(200).json({
                                    message: "all ready exist emailid please enter another one",
                                    status: false
                                })
                            }

                        }
                        else {
                            res.status(201).json({
                                message: "all fields are required",
                                status: false
                            })
                        }

                    } else {
                        res.status(201).json({
                            message: "all Fields are required",
                            status: false
                        })

                    }
                }


            })



        } catch (error) {

            console.log(error);
        }
    }


    static verify = async (req, res) => {
        console.log("sdndfh");

        try {
            const { user } = req;
            if (user) {
                res.status(200).json({
                    status: true,
                    data: user
                })
            }
            else {
                res.status(201).json({
                    status: false,
                    data: []
                })
            }
        } catch (error) {

        }
    }

    static logout = async (req, res) => {
        try {

            res.clearCookie('uid', {
                sameSite: process.env.DEPLOYMENT_TYPE == "local" ? 'Strict' : "None",
                secure: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
                httpOnly: process.env.DEPLOYMENT_TYPE == "local" ? false : true,
            });

            res.send({
                message: "logout successfully",
                status: true
            })


        } catch (error) {

        }
    }
}