import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const ItineraryManager = () => {
    const [itineraries, setItineraries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItinerary, setEditingItinerary] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        dayNumber: '',
        itineraryDetails: '',
        catmaster: { categoryId: '' }
    });

    // ... inside map
    {
        itineraries.map(itin => (
            <tr key={itin.id}>
                <td>{itin.id}</td>
                <td>{itin.catmaster?.name || 'Unknown'}</td>
                <td>Day {itin.dayNumber}</td>
                <td>{itin.itineraryDetails.substring(0, 50)}...</td>
                <td>
                    <button className="btn-edit" onClick={() => { setEditingItinerary(itin); setFormData(itin); setShowModal(true); }}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteItinerary(itin.id)}>Delete</button>
                </td>
            </tr>
        ))
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [itinResp, catResp] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/itineraries`),
                axios.get(`${BACKEND_URL}/api/categories/all`)
            ]);
            setItineraries(itinResp.data);
            setCategories(catResp.data.filter(c => c.flag === true));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    const deleteItinerary = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/itineraries/${id}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting itinerary", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItinerary) {
                await axios.put(`${BACKEND_URL}/api/itineraries/${editingItinerary.id}`, formData);
            } else {
                await axios.post(`${BACKEND_URL}/api/itineraries`, formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving itinerary", err);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Itinerary Management</h2>
                <button className="btn-primary" onClick={() => { setShowModal(true); setEditingItinerary(null); setFormData({ id: '', dayNumber: '', itineraryDetails: '', catmaster: { categoryId: '' } }) }}>
                    Add Day
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Day</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {itineraries.map(itin => (
                            <tr key={itin.itineraryId}>
                                <td>{itin.itineraryId}</td>
                                <td>{itin.catmaster?.name || 'Unknown'}</td>
                                <td>Day {itin.dayNumber}</td>
                                <td>{itin.itineraryDetails.substring(0, 50)}...</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditingItinerary(itin); setFormData(itin); setShowModal(true); }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteItinerary(itin.itineraryId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingItinerary ? 'Edit Day' : 'Add Day'}</h3>
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
                                        <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Day Number</label>
                                <input type="number" value={formData.dayNumber} onChange={e => setFormData({ ...formData, dayNumber: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Itinerary Details</label>
                                <textarea
                                    value={formData.itineraryDetails}
                                    onChange={e => setFormData({ ...formData, itineraryDetails: e.target.value })}
                                    required
                                    style={{ width: '100%', minHeight: '150px', padding: '0.5rem' }}
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

export default ItineraryManager;
