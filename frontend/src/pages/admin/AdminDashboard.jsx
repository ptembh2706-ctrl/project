import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalCategories: 0,
        totalTours: 0,
        totalCustomers: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const resp = await axios.get(`${BACKEND_URL}/api/admin/stats`);
            setStats(resp.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching admin stats", err);
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Admin Dashboard</h2>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#7f8c8d' }}>Total Categories</h4>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>{loading ? '--' : stats.totalCategories}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#7f8c8d' }}>Active Tours</h4>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>{loading ? '--' : stats.totalTours}</p>
                </div>
                <div className="stat-card" style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                    <h4 style={{ margin: '0 0 1rem 0', color: '#7f8c8d' }}>Total Customers</h4>
                    <p style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>{loading ? '--' : stats.totalCustomers}</p>
                </div>
            </div>

            <div className="welcome-section" style={{ background: '#3498db', color: 'white', padding: '2rem', borderRadius: '12px' }}>
                <h3>Welcome to E-Tour Admin Panel</h3>
                <p>Use the sidebar to manage your application data. Ensure you follow the correct sequence for new tours:</p>
                <ol>
                    <li>Create a Category (ensure Flag is checked for leaf nodes)</li>
                    <li>Add Tour details for that Category</li>
                    <li>Add Pricing in Cost Management</li>
                    <li>Define Day-wise Itineraries</li>
                </ol>
            </div>
        </div>
    );
};

export default AdminDashboard;
