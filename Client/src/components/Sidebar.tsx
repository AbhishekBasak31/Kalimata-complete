import { Link, useLocation } from "react-router-dom";
import { FaChartBar, FaListAlt } from "react-icons/fa";


const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <FaChartBar /> },
    { name: "Footer", path: "/admin/details/footer" },
    { name: "Enquiry", path: "/admin/details/enquiry" },
    { name: "Contact", path: "/admin/details/contact" },
    { name: "Catagory", path: "/admin/details/catagory" },
    { name: "SubCatagory", path: "/admin/details/subcatagory" },
    { name: "Product", path: "/admin/details/product" },



  ];

  return (
    <>

    <div style={{
        background: "linear-gradient(90deg, #F7FFF7 0%, #E8FDE8 35%, #E6FFEF 100%)",
      }} className="my-32 w-64  text-green-800 h-screen p-5 fixed left-0 top-0 flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-green-400 text-center">
        Admin Panel
      </h2>
      <nav className="flex flex-col gap-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 ${
              location.pathname === item.path
                ? "bg-green-700 text-black font-semibold"
                : "hover:bg-green-500/20"
            }`}
          >
            {item.icon || <FaListAlt />}
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
    </>
  );
};

export default Sidebar;
