// src/components/CustomSidebar.js
import React from "react";
import { Sidebar } from "primereact/sidebar";
import { Avatar } from "primereact/avatar";
import { Link } from "react-router-dom";
import "../../styles/CustomSidebar.css"; // Optional CSS for custom styles
import { ROUTES } from "../../utils/routes";
import { useNavigate } from "react-router-dom";

const CustomSidebar = ({ visible, onHide }) => {
  const navigate = useNavigate();

  const handleLinkClick = () => {
    onHide(); // Close the sidebar
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Sidebar visible={visible} onHide={onHide} position="left">
      <div>
        <div className="sidebar-header flex justify-content-start gap-2 align-items-center flex-row  ">
          <h3 className="sidebar-profile-name ">Admin Dashboard</h3>
        </div>
        <ul className="sidebar-links">
          <li>
            <Link to={"/"} className="sidebar-link" onClick={handleLinkClick}>
              <i className="pi pi-home"></i> Dashboard
            </Link>
          </li>
          <li>
            <Link
              to={ROUTES.USERS}
              className="sidebar-link"
              onClick={handleLinkClick}
            >
              <i className="pi pi-users"></i> Requests
            </Link>
          </li>
          <li>
            <Link to={"/"} className="sidebar-link" onClick={handleLogout}>
              <i className="pi pi-users"></i> Logout
            </Link>
          </li>
        </ul>
      </div>

      <div className=" absolute bottom-0">
        <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
        <a
          v-ripple
          className="m-3 flex align-items-center cursor-pointer p-3 gap-2 border-round text-700 hover:surface-100 transition-duration-150 transition-colors p-ripple"
        >
          <Avatar
            image="https://avatars.githubusercontent.com/u/85057779?v=4"
            shape="circle"
          />
          <span className="font-bold">Mehroz Farooq</span>
        </a>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
