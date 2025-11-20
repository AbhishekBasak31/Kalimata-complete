import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EnquiryModalProps {
productId: string;
productName: string;
onClose: () => void;
}

const EnquiryModal: React.FC<EnquiryModalProps> = ({
productId,
productName,
onClose,
}) => {
const [formData, setFormData] = useState({
firstName: "",
lastName: "",
email: "",
phone: "",
message: `I am interested in ${productName}. Please provide more details.`,
});

const [loading, setLoading] = useState(false);

const handleChange = (
e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
setFormData({ ...formData, [e.target.name]: e.target.value });
};

const resetForm = () => {
setFormData({
firstName: "",
lastName: "",
email: "",
phone: "",
message: `I am interested in ${productName}. Please provide more details.`,
});
};

const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();

if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.message.trim()) {
alert("Please fill all required fields (First name, Email, Phone, Message).");
return;
}

const payload = {
name: `${formData.firstName.trim()} ${formData.lastName.trim()}.trim()`,
email: formData.email.trim(),
phone: formData.phone.trim(),
message: formData.message.trim(),
productId,
};

setLoading(true);

try {
const VITE_URL =
typeof import.meta !== "undefined" && (import.meta as any).env
? (import.meta as any).env.VITE_API_URL
: "";

const BACKEND = VITE_URL || "";
const url = BACKEND
? `${BACKEND.replace(/\/$/, "")}/api/v1/enquiry`
: "/api/v1/enquiry";

const res = await fetch(url, {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(payload),
});

if (!res.ok) {
const text = await res.text().catch(() => "");
let errMsg = `Error ${res.status}`;

try {
const json = JSON.parse(text || "{}");
errMsg = json?.error || json?.message || errMsg;
} catch {
if (text) errMsg = text;
}

throw new Error(errMsg);
}

const data = await res.json().catch(() => ({}));
alert(data?.message || "Your enquiry has been sent successfully!");

resetForm();
onClose();
} catch (err: any) {
console.error("Enquiry submit error:", err);
alert(`Error: ${err?.message || "Failed to send enquiry."}`);
} finally {
setLoading(false);
}
};

return (
<AnimatePresence>
<motion.div
className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
onClick={onClose}
>
<motion.div
className="bg-white/90 backdrop-blur-md rounded-3xl w-full max-w-lg p-8 relative shadow-xl"
initial={{ scale: 0.9, opacity: 0 }}
animate={{ scale: 1, opacity: 1 }}
exit={{ scale: 0.9, opacity: 0 }}
onClick={(e) => e.stopPropagation()}
>
{/* Close button */}
<button
className="absolute top-4 right-4 text-gray-700 font-bold text-2xl hover:text-primary transition"
onClick={onClose}
>
&times;
</button>

{/* Modal Header */}
<h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
Send an <span className="text-primary">Enquiry</span>
</h2>

{/* Enquiry Form */}
<form onSubmit={handleSubmit} className="flex flex-col gap-4">
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<Input
type="text"
name="firstName"
placeholder="First Name"
value={formData.firstName}
onChange={handleChange}
className="text-gray-800 focus:border-primary"
required
/>
<Input
type="text"
name="lastName"
placeholder="Last Name"
value={formData.lastName}
onChange={handleChange}
className="text-gray-800 focus:border-primary"
/>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
<Input
type="email"
name="email"
placeholder="Email"
value={formData.email}
onChange={handleChange}
className="text-gray-800 focus:border-primary"
required
/>
<Input
type="tel"
name="phone"
placeholder="Phone Number"
value={formData.phone}
onChange={handleChange}
className="text-gray-800 focus:border-primary"
required
/>
</div>

<Textarea
name="message"
placeholder="Your Message"
value={formData.message}
onChange={handleChange}
className="text-gray-800 focus:border-primary min-h-[120px]"
required
/>

{/* Hidden product ID */}
<input type="hidden" name="productId" value={productId} />

{/* Submit Button */}
<Button
type="submit"
size="lg"
disabled={loading}
className="bg-primary hover:bg-primary/90 text-white shadow-lg transition-all duration-300 mt-2"
>
{loading ? "Sending..." : "Send Enquiry"}
</Button>
</form>
</motion.div>
</motion.div>
</AnimatePresence>
);
};

export default EnquiryModal;