// server.js
import os from "os";
import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import DB_Connection from "./src/DB/DB.js";

import UserRouter from "./src/Route/User.js";
import EnquiryRouter from "./src/Route/Enquiry.js";
import ContactRouter from "./src/Route/Contact.js"; // <-- fixed import
import FooterRouter from "./src/Route/Footer.js";
import FactAddRouter from "./src/Route/FactAddress.js";
import Catagoryrouter from "./src/Route/Product/Catagory.js";
import SubCatagoryRouter from "./src/Route/Product/Subcatagory.js";
import ProductRouter from "./src/Route/Product/Product.js";
import BlogRouter from "./src/Route/Blog/Blog.js";
import OurValueRouter from "./src/Route/Blog/OurValue.js";
import BDirectorRouter from "./src/Route/Aboutus/BDirectors.js";
import CProfileRouter from "./src/Route/Aboutus/CProfile.js";
import CSRRouter from "./src/Route/Aboutus/CSR.js";
import MAndVRouter from "./src/Route/Aboutus/MAndV.js";
import HomeAboutrouter from "./src/Route/Home/About.js";
import HomeBannerRouter from "./src/Route/Home/Banner.js";
import HomeDirectorRouter from "./src/Route/Home/Directors.js";
import HomeGrowthRouter from "./src/Route/Home/Growth.js";
import HomeMilestoneRouter from "./src/Route/Home/Milestone.js";
// If you have a separate Home M&V router, import it here:
// import HomeMAndVRouter from "./src/Route/Home/MAndV.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

function getLocalIP() {
  try {
    const networkInterfaces = os.networkInterfaces();
    for (const name in networkInterfaces) {
      const addrs = networkInterfaces[name];
      if (!Array.isArray(addrs)) continue;
      for (const iface of addrs) {
        if ((iface.family === "IPv4" || iface.family === 4) && !iface.internal) {
          return iface.address;
        }
      }
    }
  } catch (err) {
    console.warn("getLocalIP failed:", err);
  }
  return "127.0.0.1";
}

const localIP = getLocalIP();

// CORS - dev-friendly list; add production FRONTEND_URL to env and it'll be included
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:8080",
  "http://localhost:8086",
  `http://${localIP}:5173`,
  `http://${localIP}:5174`,
  `http://${localIP}:8080`,
  `http://${localIP}:8086`,
];

if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser requests (Postman, curl) that have no origin
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("❌ CORS: Not allowed by server"));
    },
    credentials: true,
  })
);

app.use(cookieParser());

// Use built-in body parsers instead of body-parser package
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount routers
app.use("/api/v1/user", UserRouter);
app.use("/api/v1/enquiry", EnquiryRouter);
app.use("/api/v1/contact", ContactRouter);
app.use("/api/v1/footer", FooterRouter);
app.use("/api/v1/factAdd", FactAddRouter);
app.use("/api/v1/product/catagory", Catagoryrouter);
app.use("/api/v1/product/subcatagory", SubCatagoryRouter);
app.use("/api/v1/product", ProductRouter);
app.use("/api/v1/blog", BlogRouter);
app.use("/api/v1/blog/ourvalue", OurValueRouter);
app.use("/api/v1/about/bdirector", BDirectorRouter);
app.use("/api/v1/about/cprofile", CProfileRouter);
app.use("/api/v1/about/csr", CSRRouter);
app.use("/api/v1/about/mandv", MAndVRouter);

app.use("/api/v1/home/about", HomeAboutrouter);
app.use("/api/v1/home/banner", HomeBannerRouter);
app.use("/api/v1/home/director", HomeDirectorRouter);
app.use("/api/v1/home/growth", HomeGrowthRouter);
app.use("/api/v1/home/milestone", HomeMilestoneRouter);

// If there is a separate home mandv router, mount it instead of re-using MAndVRouter:
// app.use("/api/v1/home/mandv", HomeMAndVRouter);

DB_Connection(process.env.DB_URI, process.env.DB_NAME)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(` ✅  Local:   http://localhost:${PORT}`);
      console.log(` ✅ Server is running at http://${localIP}:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});