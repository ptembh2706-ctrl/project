import React, { useState, useEffect } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        categoryId: '',
        subcategoryId: '',
        name: '',
        imagePath: '',
        flag: false
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const resp = await axios.get('/categories/all');
            // This gets main categories, we might need a separate endpoint for ALL categories for admin
            // For now, let's assume we can fetch them or we'll add a proper admin fetch
            setCategories(resp.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching categories", err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await axios.put(`${BACKEND_URL}/api/categories/${editingCategory.categoryId}`, formData);
            } else {
                await axios.post(`${BACKEND_URL}/api/categories`, formData);
            }
            setShowModal(false);
            setEditingCategory(null);
            setFormData({ categoryId: '', subcategoryId: '', name: '', imagePath: '', flag: false });
            fetchCategories();
        } catch (err) {
            console.error("Error saving category", err);
        }
    };

    const deleteCategory = async (id) => {
        if (window.confirm("Are you sure? This might affect tours linked to this category.")) {
            try {
                await axios.delete(`${BACKEND_URL}/api/categories/${id}`);
                fetchCategories();
            } catch (err) {
                alert("Cannot delete category. It might have linked data.");
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Category Management</h2>
                <button className="btn-primary" onClick={() => { setShowModal(true); setEditingCategory(null); setFormData({ categoryId: '', subcategoryId: '', name: '', imagePath: '', flag: false }) }}>
                    Add New Category
                </button>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Category ID</th>
                            <th>Parent ID</th>
                            <th>Name</th>
                            <th>Leaf Node?</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.categoryId}>
                                <td>{cat.categoryId}</td>
                                <td>{cat.subcategoryId || 'None'}</td>
                                <td>{cat.name}</td>
                                <td>{cat.flag ? 'Yes' : 'No'}</td>
                                <td>
                                    <button className="btn-edit" onClick={() => { setEditingCategory(cat); setFormData(cat); setShowModal(true); }}>Edit</button>
                                    <button className="btn-delete" onClick={() => deleteCategory(cat.categoryId)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h3>{editingCategory ? 'Edit Category' : 'Add Category'}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Category ID (e.g., C101)</label>
                                <input type="text" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} required disabled={!!editingCategory} />
                            </div>
                            <div className="form-group">
                                <label>Parent Subcategory ID (optional)</label>
                                <input type="text" value={formData.subcategoryId || ''} onChange={e => setFormData({ ...formData, subcategoryId: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Image Path</label>
                                <input type="text" value={formData.imagePath} onChange={e => setFormData({ ...formData, imagePath: e.target.value })} />
                            </div>
                            <div className="form-group checkbox">
                                <label>
                                    <input type="checkbox" checked={formData.flag} onChange={e => setFormData({ ...formData, flag: e.target.checked })} />
                                    Is leaf node? (If yes, you can attach Tours/Costs to this)
                                </label>
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

export default CategoryManager;
