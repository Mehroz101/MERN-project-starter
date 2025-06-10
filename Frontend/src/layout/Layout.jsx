import { Link, Outlet } from "react-router-dom";
const Layout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // Redirect to login page
  };
  return (
    <>
      {/* <div className="main_container">
        <CustomSidebar visible={visible} onHide={() => setVisible(false)} />
        <Outlet />
      </div> */}
      <div className="navbar bg-gray-100 p-2 flex justify-content-between align-items-center">
          <Link className="text-3xl">TODO</Link>
          <button onClick={handleLogout} className=" cursor-pointer bg-red-400 text-lg text-white border-none p-2 ">Logout</button>
      </div>
      <div className="sidebar_components">
        <div className="p-5">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
