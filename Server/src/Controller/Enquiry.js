import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Enquiry } from "../Model/Enquiry.js";

dotenv.config();

// Create new enquiry
export const createEnquiry = async (req, res) => {
try {
const { name, email, phone, message } = req.body;

if (!name || !email || !phone || !message) {
return res.status(400).json({ error: "Please fill all fields" });
}

const enquiry = new Enquiry({ name, email, phone, message });
await enquiry.save();

// Prepare mailer
const transporter = nodemailer.createTransport({
host: process.env.SMTP_HOST,
port: Number(process.env.SMTP_PORT || 587),
secure: Number(process.env.SMTP_PORT) === 465,
auth: {
user: process.env.SMTP_USER,
pass: process.env.SMTP_PASS,
},
tls: {
// allow self-signed certs in non-production
rejectUnauthorized: process.env.NODE_ENV === "production",
},
});

const mailOptions = {
from: email,
to: process.env.NOTIFY_EMAIL || "kalimatagroup908@gmail.com",
subject: `New Enquiry Received from ${name}`,
html: `
<h3>Enquiry Details</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Message:</strong> ${message}</p>
`,
};

// attempt to send email but don't fail the request if email fails
try {
await transporter.sendMail(mailOptions);
} catch (mailErr) {
console.error("Enquiry email send failed (non-fatal):", mailErr);
}

return res.status(201).json({
message: "Enquiry created and email (attempted) successfully",
enquiry,
});
} catch (err) {
console.error("createEnquiry error:", err);
return res.status(500).json({ error: err.message || "Internal Server Error" });
}
};

// Get all enquiries
export const getAllEnquiries = async (req, res) => {
try {
const enquiries = await Enquiry.find().sort({ createdAt: -1 });
return res.status(200).json({
success: true,
count: enquiries.length,
data: enquiries,
message: "Enquiry data fetched successfully",
});
} catch (err) {
console.error("getAllEnquiries error:", err);
return res.status(500).json({ success: false, error: err.message });
}
};