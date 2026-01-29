import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <h3>E-Tour Admin</h3>
            </div>
            <nav className="sidebar-nav">
                <NavLink to="/admin" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Dashboard
                </NavLink>
                <NavLink to="/admin/categories" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Categories
                </NavLink>
                <NavLink to="/admin/tours" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Tours
                </NavLink>
                <NavLink to="/admin/costs" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Costs
                </NavLink>
                <NavLink to="/admin/itineraries" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Itineraries
                </NavLink>
                <NavLink to="/admin/customers" end className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Customers
                </NavLink>
                <NavLink to="/admin/customers/upload" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Upload Excel
                </NavLink>
                <NavLink to="/admin/payments" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    Payments
                </NavLink>
                <NavLink to="/" className="nav-item back-home">
                    Back to Site
                </NavLink>
            </nav>
        </div>
    );
};

export default AdminSidebar;
