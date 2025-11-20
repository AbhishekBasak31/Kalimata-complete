// src/pages/Admin/DetailsRouter.tsx
import React from "react";
import { useParams } from "react-router-dom";


import FooterDetails from "./Global/FooterDetails";

import EnquiryDetails from "./Global/EnquiryDetails";
import ContactDetails from "./Global/ContactDetails";
import CatagoryDetails from "./Product/Catagory";
import SubcatagoryDetails from "./Product/Subcatagory";
import ProductDetails from "./Product/Product";


const COMPONENT_MAP: Record<string, React.ReactNode> = {
 
  footer: <FooterDetails />,
  enquiry: <EnquiryDetails />,
  contact: <ContactDetails/>,
  catagory:<CatagoryDetails/>,
  subcatagory:<SubcatagoryDetails/>,
  product:<ProductDetails/>,

};

const DetailsRouter: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const key = (type ?? "").toLowerCase();
  const Comp = COMPONENT_MAP[key];

  if (!Comp) {
    return (
      <div className="text-center text-yellow-400 mt-10">
        No detail view found for: {type}
      </div>
    );
  }

  return <>{Comp}</>;
};

export default DetailsRouter;
