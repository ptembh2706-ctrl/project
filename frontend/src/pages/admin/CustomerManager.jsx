import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const CustomerManager = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const resp = await axios.get(`${BACKEND_URL}/api/customers`);
            setCustomers(resp.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching customers", err);
            setLoading(false);
        }
    };

    const [showModal, setShowModal] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [formData, setFormData] = useState({
        customerId: '',
        name: '',
        email: '',
        mobileNumber: '',
        password: '', // Should be handled carefully
        address: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCustomer) {
                await axios.put(`${BACKEND_URL}/api/customers/${editingCustomer.customerId}`, formData);
            }
            setShowModal(false);
            fetchCustomers();
        } catch (err) {
            console.error("Error saving customer", err);
            alert("Failed to save customer");
        }
    };

    const deleteCustomer = async (id) => {
        if (window.confirm("Are you sure? This might fail if they have bookings.")) {
            try {
                await axios.delete(`${BACKEND_URL}/api/customers/${id}`);
                fetchCustomers();
            } catch (err) {
                alert("Cannot delete customer. They might have active bookings.");
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Customer Management</h2>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(cust => (
                            <tr key={cust.customerId}>
                                <td>{cust.customerId}</td>
                                <td>{cust.name}</td>
                                <td>{cust.email}</td>
                                <td>{cust.mobileNumber}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => {
                                        setEditingCustomer(cust);
                                        setFormData({
                                            customerId: cust.customerId,
                                            name: cust.name,
                                            email: cust.email,
                                            mobileNumber: cust.mobileNumber,
                                            address: cust.address,
                                            password: cust.password // Keep existing password or handle reset separately
                                        });
                                        setShowModal(true);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteCustomer(cust.customerId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>Edit Customer</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Mobile Number</label>
                                <input type="text" value={formData.mobileNumber} onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <textarea value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn-primary">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerManager;
