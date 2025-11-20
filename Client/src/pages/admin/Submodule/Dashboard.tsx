// src/pages/Admin/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaComments,
  FaRegNewspaper,
  FaUsers,
  FaChartPie,
  FaChartBar,
  FaSignOutAlt,
} from "react-icons/fa";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { userApi } from "../../../Backend"; // adjust path if needed

import { clearAuthError, logoutUser } from "@/Store/AuthSlice";
import { useAppDispatch } from "@/Store/Hook";
import type { AppDispatch } from "../../../Store/Store";
type AnyObject = Record<string, any>;

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ElementType;
  bgClass?: string;
  accent?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon: Icon, bgClass = "bg-bamboo-600", accent = "text-bamboo-700" }) => (
  <div className="flex flex-col justify-between p-5 shadow-lg rounded-2xl bg-white/5 border border-white/5">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-full ${bgClass} text-white text-xl`}>
        <Icon />
      </div>
      <div>
        <p className="text-sm text-gray-300 font-medium">{title}</p>
        <h2 className="text-2xl font-bold text-black">
          <CountUp end={count} duration={1.2} separator="," />
        </h2>
      </div>
    </div>
  </div>
);

// Bamboo + light-green palette
const COLORS = ["#7BBF6A", "#9AE6B4", "#57A773", "#CFFFD6", "#14B8A6", "#A3E635"];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch() as AppDispatch;
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Record<string, any[]>>({});

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboard = async () => {
    dispatch(clearAuthError());
    setLoading(true);
    setError(null);
    try {
      const res = await userApi.dashboard();
      const payload = res.data?.data ?? res.data ?? {};
      setData(payload);
    } catch (err: any) {
      console.error("fetchDashboard failed:", err);
      setError(err?.response?.data?.message ?? err.message ?? "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser()).unwrap();
      if (res) {
        navigate("/auth");
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-green-600 text-xl">
        Loading Dashboard...
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center mt-10 text-xl">
        Error loading dashboard: {error}
      </div>
    );

  // safe counter
  const countFor = (key: string) => {
    const arr = (data as AnyObject)[key];
    if (!arr) return 0;
    if (Array.isArray(arr)) return arr.length;
    return 1;
  };

  // New data points (from your API output)
  const footerCount = countFor("Footer");
  const enquiryCount = countFor("Enquiry");
  const contactCount = countFor("Contact");
  const categoryCount = countFor("Catagory");
  const productCount = countFor("Product");
  const subcategoryCount = countFor("Subcatagory");
  const homeAboutCount = countFor("HomeAbout");
  const homeBannerCount = countFor("HomeBanner");
  const homeDirectorCount = countFor("HomeDirector");
  const homeGrowthCount = countFor("HomeGrowth");
  const blogCount = countFor("Blog");
  const ourValueCount = countFor("Ourvalue");
  const bdirectorCount = countFor("Bdirector");
  const cprofileCount = countFor("CProfile");
  const csrCount = countFor("CSR");
  const mandvCount = countFor("MandV");

  // Keep original stat names but use real points - change these four if you prefer other items
  const stat1Count = productCount; // Services -> Products
  const stat2Count = categoryCount; // Reviews -> Categories
  const stat3Count = subcategoryCount; // Our Stories -> Subcategories
  const stat4Count = blogCount; // Enquiries -> Blogs

  const barData = [
    { name: "Products", value: productCount },
    { name: "Categories", value: categoryCount },
    { name: "Subcats", value: subcategoryCount },
    { name: "HomeBanners", value: homeBannerCount },
    { name: "HomeDirectors", value: homeDirectorCount },
    { name: "Blogs", value: blogCount },
  ];

  const pieData = [
    { name: "Products", value: productCount },
    { name: "Categories", value: categoryCount },
    { name: "HomeBanners", value: homeBannerCount },
    { name: "Blogs", value: blogCount },
  ];

  // preview lists - keep similar UI but using real collections
  const latestProducts = (data.Product ?? []).slice(0, 6);
  const latestCategories = (data.Catagory ?? []).slice(0, 6);
  const latestBlogs = (data.Blog ?? []).slice(0, 6);

  return (
    <div
      className="flex py-8 min-h-screen text-white my-36"
      style={{
        background: "linear-gradient(90deg, #F7FFF7 0%, #E8FDE8 35%, #E6FFEF 100%)",
      }}
    >
 
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 style={{ color: "#2F6B3A" }} className="text-4xl font-extrabold">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboard()}
              className="px-4 py-2 rounded-lg font-semibold"
              style={{
                background: "#CFFFD6",
                color: "#0f5132",
                border: "1px solid rgba(0,0,0,0.04)",
              }}
            >
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold"
              style={{
                background: "#7BBF6A",
                color: "white",
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </div>

        <Outlet />

        {/* Stat Cards (kept look same, but changed data) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Products" count={stat1Count} icon={FaBoxOpen} bgClass="bg-green-600" />
          <StatCard title="Categories" count={stat2Count} icon={FaComments} bgClass="bg-emerald-500" />
          <StatCard title="Subcategories" count={stat3Count} icon={FaRegNewspaper} bgClass="bg-lime-600" />
          <StatCard title="Blogs" count={stat4Count} icon={FaUsers} bgClass="bg-teal-500" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="rounded-2xl p-6 shadow-md" style={{ background: "rgba(47, 107, 58, 0.06)" }}>
            <div className="flex items-center mb-4">
              <FaChartBar className="text-green-700 text-2xl mr-3" />
              <h2 style={{ color: "#235A34" }} className="text-2xl font-bold">
                Content Overview
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#2b6b35" />
                <YAxis stroke="#2b6b35" />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {barData.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl p-6 shadow-md" style={{ background: "rgba(47, 107, 58, 0.04)" }}>
            <div className="flex items-center mb-4">
              <FaChartPie className="text-green-700 text-2xl mr-3" />
              <h2 style={{ color: "#235A34" }} className="text-2xl font-bold">
                Distribution
              </h2>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label>
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Preview lists */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="p-4 rounded-lg shadow-md" style={{ background: "rgba(59, 130, 46, 0.04)" }}>
            <h3 style={{ color: "#1f6b33" }} className="text-lg font-semibold mb-3">
              Latest Products
            </h3>
            <ul className="space-y-3 max-h-56 overflow-auto">
              {latestProducts.map((p: AnyObject) => (
                <li key={p._id} className="flex gap-3 items-center p-2 rounded-md hover:bg-white/5 transition">
                  <img
                    src={p.Img1 ?? p.Img2 ?? p.Img3 ?? ""}
                    alt={p.Name ?? "Product"}
                    className="h-12 w-12 object-cover rounded-md border border-white/10"
                  />
                  <div>
                    <div className="font-medium" style={{ color: "#14391f" }}>
                      {p.Name ?? "Unnamed Product"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.CatagoryId?.Name ?? p.CatagoryId?.name ?? "—"}{" "}
                      {p.SubcatagoryId ? `· ${p.SubcatagoryId?.Name ?? p.SubcatagoryId?.name}` : ""}
                    </div>
                  </div>
                </li>
              ))}
              {latestProducts.length === 0 && <li className="text-sm text-gray-500">No products yet</li>}
            </ul>
          </div>

          {/* Categories */}
          <div className="p-4 rounded-lg shadow-md" style={{ background: "rgba(59, 130, 46, 0.03)" }}>
            <h3 style={{ color: "#1f6b33" }} className="text-lg font-semibold mb-3">
              Latest Categories
            </h3>
            <ul className="space-y-3 max-h-56 overflow-auto">
              {latestCategories.map((c: AnyObject) => (
                <li key={c._id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 transition">
                  {c.Img ? (
                    <img src={c.Img} alt={c.Name} className="h-10 w-10 object-contain rounded" />
                  ) : (
                    <div className="h-10 w-10 bg-gray-200 rounded" />
                  )}
                  <div>
                    <div className="font-medium" style={{ color: "#14391f" }}>
                      {c.Name ?? "Unnamed Category"}
                    </div>
                    <div className="text-xs text-gray-500">Added: {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "—"}</div>
                  </div>
                </li>
              ))}
              {latestCategories.length === 0 && <li className="text-sm text-gray-500">No categories yet</li>}
            </ul>
          </div>

          {/* Blogs */}
          <div className="p-4 rounded-lg shadow-md" style={{ background: "rgba(59, 130, 46, 0.02)" }}>
            <h3 style={{ color: "#1f6b33" }} className="text-lg font-semibold mb-3">
              Latest Blogs
            </h3>
            <ul className="space-y-3 max-h-56 overflow-auto">
              {latestBlogs.map((b: AnyObject) => (
                <li key={b._id} className="p-2 rounded-md hover:bg-white/5 transition">
                  <div className="flex gap-3 items-start">
                    {b.Img ? (
                      <img src={b.Img} alt={b.Htext ?? "Blog"} className="h-12 w-12 object-cover rounded-md" />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-md" />
                    )}
                    <div>
                      <div className="font-medium" style={{ color: "#14391f" }}>
                        {b.Htext ?? "Untitled"}
                      </div>
                      <div className="text-xs text-gray-600">{b.Dtext ?? ""}</div>
                      <div className="text-xs text-gray-400 mt-1">{b.Adress ?? ""}</div>
                    </div>
                  </div>
                </li>
              ))}
              {latestBlogs.length === 0 && <li className="text-sm text-gray-500">No blogs yet</li>}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
