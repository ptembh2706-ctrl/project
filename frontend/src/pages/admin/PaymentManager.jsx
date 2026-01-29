import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const PaymentManager = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            const resp = await axios.get(`${BACKEND_URL}/api/payments`);
            setPayments(Array.isArray(resp.data) ? resp.data : []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching payments", err);
            setLoading(false);
        }
    };

    const deletePayment = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/payments/${id}`);
            fetchPayments();
        } catch (err) {
            console.error("Error deleting payment", err);
            alert("Failed to delete payment");
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${BACKEND_URL}/api/payments/${id}/status/${status}`);
            fetchPayments();
        } catch (err) {
            console.error("Error updating payment status", err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Payment Management</h2>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Booking ID</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Status</th>
                            <th>Txn ID</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(p => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.bookingId}</td>
                                <td>₹{p.paidAmount}</td>
                                <td>{p.paymentMode}</td>
                                <td>
                                    <select
                                        value={p.paymentStatus}
                                        onChange={(e) => updateStatus(p.id, e.target.value)}
                                        className={`status-select ${p.paymentStatus?.toLowerCase()}`}
                                        style={{ padding: '0.25rem', borderRadius: '4px' }}
                                    >
                                        <option value="Paid">Paid</option>
                                        <option value="Advanced">Advanced</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Refunded">Refunded</option>
                                        <option value="Failed">Failed</option>
                                    </select>
                                </td>
                                <td>{p.transactionId}</td>
                                <td>
                                    <button className="btn-delete" onClick={() => deletePayment(p.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        {payments.length === 0 && (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No payments found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PaymentManager;
