import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
const cloudnaryConfig = () => {
    console.log(process.env.CLOUDNARY_NAME, process.env.CLOUDNARY_SECRETKEY, process.env.CLOUDNARY_APIKEY);

    cloudinary.config({
        cloud_name: process.env.CLOUDNARY_NAME,
        api_key: process.env.CLOUDNARY_APIKEY,
        api_secret: process.env.CLOUDNARY_SECRETKEY
    });
}
export const imageUploader = async (bufferImg) => {

    try {
        cloudnaryConfig();
        return await cloudinary.uploader.upload(bufferImg).then(res => {
            return res.secure_url;
        }).catch(err => {
            console.log(err);
            return false
        })
        // console.log(result)
        // return result.secure_url
    } catch (error) {

        console.log(error.code);
    }


}