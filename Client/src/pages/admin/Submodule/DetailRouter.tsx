// src/pages/Admin/DetailsRouter.tsx
import React from "react";
import { useParams } from "react-router-dom";


import FooterDetails from "./Global/FooterDetails";

import EnquiryDetails from "./Global/EnquiryDetails";
import ContactDetails from "./Global/ContactDetails";
import CatagoryDetails from "./Product/Catagory";
import SubcatagoryDetails from "./Product/Subcatagory";
import ProductDetails from "./Product/Product";
import BlogDetails from "./Blog/Blog";
import OurValueDetails from "./Blog/OurValue";
import BDirectorDetails from "./Aboutus/BDirector";
import CProfileDetails from "./Aboutus/CProfile";
import CSRDetails from "./Aboutus/CSR";
import MAndVDetails from "./Aboutus/MAndV";
import HomeAboutDetails from "./Home/HomeAbout"
import HomeBannerDetails from "./Home/HomeBanner";
import HomeDirectorDetails from "./Home/HomeDirector";
import HomeGrowthDetails from "./Home/HomeGrowth";
import HomeMilestoneDetails from "./Home/HomeMilestone";

const COMPONENT_MAP: Record<string, React.ReactNode> = {
 
  footer: <FooterDetails />,
  enquiry: <EnquiryDetails />,
  contact: <ContactDetails/>,
  catagory:<CatagoryDetails/>,
  subcatagory:<SubcatagoryDetails/>,
  product:<ProductDetails/>,
  blog:<BlogDetails/>,
  ourvalue:<OurValueDetails/>,
  bdirector:<BDirectorDetails/>,
  cprofile:<CProfileDetails/>,
  csr:<CSRDetails/>,
  mandv:<MAndVDetails/>,
  habout:<HomeAboutDetails/>,
  hbanner:<HomeBannerDetails/>,
  hdirector:<HomeDirectorDetails/>,
  hgrowth:<HomeGrowthDetails/>,
  hmilestone:<HomeMilestoneDetails/>
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
