import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const DepartureManager = () => {
    const [departures, setDepartures] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingDeparture, setEditingDeparture] = useState(null);
    const [formData, setFormData] = useState({
        departure_date_id: '',
        departure_date: '',
        end_date: '',
        number_of_days: '',
        catmaster: { categoryId: '' }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [depResp, catResp] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/departures`),
                axios.get(`${BACKEND_URL}/api/categories/all`)
            ]);
            setDepartures(depResp.data);
            setCategories(catResp.data.filter(c => c.flag === true));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    const deleteDeparture = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/departures/delete/${id}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting departure", err);
            alert("Failed to delete departure");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure format matches backend expectation
        const payload = {
            ...formData,
            // Ensure dates are just YYYY-MM-DD string if needed, or DateOnly handled by JSON
        };

        try {
            if (editingDeparture) {
                // Endpoint: PUT /api/departures/update
                await axios.put(`${BACKEND_URL}/api/departures/update`, payload);
            } else {
                // Endpoint: POST /api/departures/add
                await axios.post(`${BACKEND_URL}/api/departures/add`, payload);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving departure", err);
            alert("Failed to save departure. Check console.");
        }
    };

    // Calculate End Date / Days Logic (Optional helper)
    const handleDateChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-calculate logic if needed
            if (newData.departure_date && newData.end_date) {
                const start = new Date(newData.departure_date);
                const end = new Date(newData.end_date);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                newData.number_of_days = diffDays;
            }
            return newData;
        });
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Departure Management</h2>
                <button className="btn-primary" onClick={() => {
                    setShowModal(true);
                    setEditingDeparture(null);
                    setFormData({ departure_date_id: 0, departure_date: '', end_date: '', number_of_days: '', catmaster: { categoryId: '' } })
                }}>
                    Schedule Departure
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Days</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {departures.map(d => (
                            <tr key={d.departure_date_id}>
                                <td>{d.departure_date_id}</td>
                                <td>{d.catmaster?.name || 'Unknown'}</td>
                                <td>{d.departure_date}</td>
                                <td>{d.end_date}</td>
                                <td>{d.number_of_days}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => {
                                        setEditingDeparture(d);
                                        setFormData(d);
                                        setShowModal(true);
                                    }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteDeparture(d.departure_date_id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingDeparture ? 'Edit Departure' : 'Schedule Departure'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    value={formData.catmaster?.categoryId || ''}
                                    onChange={e => setFormData({ ...formData, catmaster: { categoryId: e.target.value } })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.category_id || c.categoryId} value={c.category_id || c.categoryId}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={formData.departure_date}
                                    onChange={e => handleDateChange('departure_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={e => handleDateChange('end_date', e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Number of Days (Auto)</label>
                                <input
                                    type="number"
                                    value={formData.number_of_days}
                                    readOnly
                                    className="bg-gray-100"
                                />
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

export default DepartureManager;
