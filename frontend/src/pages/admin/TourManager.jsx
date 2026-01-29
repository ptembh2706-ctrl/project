import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const TourManager = () => {
    const [tours, setTours] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        description: '',
        catmaster: { categoryId: '' }, // Updated to match expected structure
        departureDate: { id: '' }
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [toursResp, catsResp] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/tours`),
                axios.get(`${BACKEND_URL}/api/categories/all`)
            ]);
            setTours(toursResp.data);
            setCategories(catsResp.data.filter(c => c.flag === true));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (!formData.catmaster.categoryId) {
                alert("Please select a category");
                return;
            }

            if (editingTour) {
                await axios.put(`${BACKEND_URL}/api/tours/${editingTour.id}`, formData);
            } else {
                await axios.post(`${BACKEND_URL}/api/tours`, formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving tour", err);
        }
    };

    const deleteTour = async (id) => {
        if (!window.confirm("Are you sure? This will delete the tour.")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/tours/${id}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting tour", err);
            alert("Failed to delete tour");
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Tour Management</h2>
                <button className="btn-primary" onClick={() => { setShowModal(true); setEditingTour(null); setFormData({ id: '', description: '', catmaster: { categoryId: '' }, departureDate: { id: '' } }) }}>
                    Add New Tour
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map(t => (
                            <tr key={t.id}>
                                <td>{t.id}</td>
                                <td>{t.catmaster?.name || 'Unknown'}</td>
                                <td>{t.description}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditingTour(t); setFormData(t); setShowModal(true); }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteTour(t.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingTour ? 'Edit Tour' : 'Add Tour'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category (Leaf nodes only)</label>
                                <select
                                    value={formData.catmaster?.categoryId || ''}
                                    onChange={e => setFormData({ ...formData, catmaster: { categoryId: e.target.value } })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(c => (
                                        <option key={c.categoryId} value={c.categoryId}>{c.name} ({c.categoryId})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    style={{ width: '100%', minHeight: '100px', padding: '0.5rem' }}
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

export default TourManager;
