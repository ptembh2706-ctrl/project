import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const CostManager = () => {
    const [costs, setCosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCost, setEditingCost] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        baseCost: '',
        singlePersonCost: '',
        extraPersonCost: '',
        childWithBedCost: '',
        childWithoutBedCost: '',
        validFromDate: '',
        validToDate: '',
        catmaster: { categoryId: '' }
    });

    // ... inside map
    {
        costs.map(c => (
            <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.catmaster?.name || 'Unknown'}</td>
                <td>₹{c.baseCost}</td>
                <td>{c.validFromDate} to {c.validToDate}</td>
                <td>
                    <button className="btn-edit" onClick={() => { setEditingCost(c); setFormData(c); setShowModal(true); }}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteCost(c.id)}>Delete</button>
                </td>
            </tr>
        ))
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [costResp, catResp] = await Promise.all([
                axios.get(`${BACKEND_URL}/api/costs`),
                axios.get(`${BACKEND_URL}/api/categories/all`)
            ]);
            setCosts(costResp.data);
            setCategories(catResp.data.filter(c => c.flag === true));
            setLoading(false);
        } catch (err) {
            console.error("Error fetching data", err);
            setLoading(false);
        }
    };

    const deleteCost = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${BACKEND_URL}/api/costs/${id}`);
            fetchData();
        } catch (err) {
            console.error("Error deleting cost", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCost) {
                await axios.put(`${BACKEND_URL}/api/costs/${editingCost.id}`, formData);
            } else {
                await axios.post(`${BACKEND_URL}/api/costs`, formData);
            }
            setShowModal(false);
            fetchData();
        } catch (err) {
            console.error("Error saving cost", err);
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Cost Management</h2>
                <button className="btn-primary" onClick={() => {
                    setShowModal(true); setEditingCost(null); setFormData({
                        id: '',
                        baseCost: '',
                        singlePersonCost: '',
                        extraPersonCost: '',
                        childWithBedCost: '',
                        childWithoutBedCost: '',
                        validFromDate: '',
                        validToDate: '',
                        catmaster: { categoryId: '' }
                    })
                }}>
                    Add New Pricing
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Base Cost</th>
                            <th>Validity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {costs.map(c => (
                            <tr key={c.costId}>
                                <td>{c.costId}</td>
                                <td>{c.catmaster?.name || 'Unknown'}</td>
                                <td>₹{c.baseCost}</td>
                                <td>{c.validFromDate} to {c.validToDate}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditingCost(c); setFormData(c); setShowModal(true); }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteCost(c.costId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal" style={{ width: '600px' }}>
                        <h3>{editingCost ? 'Edit Pricing' : 'Add Pricing'}</h3>
                        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div className="form-group" style={{ gridColumn: 'span 2' }}>
                                <label>Category</label>
                                <select
                                    value={formData.catmaster?.categoryId || ''}
                                    onChange={e => setFormData({ ...formData, catmaster: { categoryId: e.target.value } })}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Base Cost</label>
                                <input type="number" value={formData.baseCost} onChange={e => setFormData({ ...formData, baseCost: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Single Person Cost</label>
                                <input type="number" value={formData.singlePersonCost} onChange={e => setFormData({ ...formData, singlePersonCost: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Extra Person Cost</label>
                                <input type="number" value={formData.extraPersonCost} onChange={e => setFormData({ ...formData, extraPersonCost: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Child With Bed</label>
                                <input type="number" value={formData.childWithBedCost} onChange={e => setFormData({ ...formData, childWithBedCost: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Child Without Bed</label>
                                <input type="number" value={formData.childWithoutBedCost} onChange={e => setFormData({ ...formData, childWithoutBedCost: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Valid From</label>
                                <input type="date" value={formData.validFromDate} onChange={e => setFormData({ ...formData, validFromDate: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Valid To</label>
                                <input type="date" value={formData.validToDate} onChange={e => setFormData({ ...formData, validToDate: e.target.value })} required />
                            </div>
                            <div className="modal-actions" style={{ gridColumn: 'span 2' }}>
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

export default CostManager;
