import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url';
// import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// 📌 Step 1: Convert JSON to Excel
const exportJsonToExcel = (data, filePath) => {
    const ws = XLSX.utils.json_to_sheet(data); // Convert JSON to sheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Shops"); // Add sheet to workbook
    XLSX.writeFile(wb, filePath); // Save file
};

// 📌 Step 2: Send Excel via Email
const sendEmailWithExcel = async (toEmail, filePath) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.ethereal.email",
  port: 587,
  secure: false,
        auth: {
            user: "manishmaurya11365@gmail.com", // 🔴 Replace with your email
            pass: "mspzkmxexkojxdbu", // 🔴 Use App Password (not your real password)
        },
    });

    let mailOptions = {
        from: "manishmaurya11365@gmail.com",
        to: toEmail,
        subject: "Shop Details Report",
        text: "Please find the attached Excel report.",
        attachments: [
            {
                filename: "shop_report.xlsx",
                path: filePath,
            },
        ],
    };

    try {
        let info = await transporter.sendMail(mailOptions);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
            } else {
                console.log("File deleted successfully:", filePath);
            }
        });
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

// 📌 Step 3: Get Data from DB, Convert & Send Email
 export const exportAndSendEmail = async (senderGmail,data) => {
    try {

        const filePath = path.join(__dirname, "shop_report.xlsx");
        exportJsonToExcel(data, filePath); // Convert JSON to Excel
        await sendEmailWithExcel(senderGmail, filePath); // Send Email

        return true
    } catch (error) {
        console.error("Error: ", error);
        return error
    }
};

