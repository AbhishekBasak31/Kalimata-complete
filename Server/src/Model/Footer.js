// models/Footer.js
import mongoose from "mongoose";
import { SCHEMA } from "../Utils/Constant.js";

const FooterSchema = new SCHEMA(
  {
    SocialLink1: { type: String, required: true },
    SocialLink2: { type: String, required: true },
    SocialLink3: { type: String, required: true },
    SocialLink4: { type: String, required: true },
    SocialLink5: { type: String, required: false },
    SocialLink6: { type: String, required: false },
    SocialLink7: { type: String, required: false },
    copyrightText: { type: String, required: true, trim: true },
    // contact fields are optional — can be cleared by admin
    contactno: { type: String, required: false },
    mailId:    { type: String, required: false },
    address:   { type: String, required: false },
    factoryaddress: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Factaddress",
    }],
  },
  { timestamps: true }
);

export const Footer = mongoose.model("Footer", FooterSchema);
export default Footer;
