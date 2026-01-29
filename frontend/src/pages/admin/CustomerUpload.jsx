import React, { useState } from 'react';
import axios from '../../api/client';
import { BACKEND_URL } from '../../config';
import './AdminTable.css';

const CustomerUpload = () => {
    const [loading, setLoading] = useState(false);
    const [uploadedCustomers, setUploadedCustomers] = useState([]);

    const handleFileUpload = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            try {
                setLoading(true);
                const response = await axios.post(`${BACKEND_URL}/api/customers/uploadData`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                alert("File uploaded successfully! Customers have been added.");
                setUploadedCustomers(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Upload failed", err);
                alert("Upload failed: " + (err.response?.data?.message || err.message));
                setLoading(false);
            }
        }
    };

    return (
        <div className="admin-page">
            <div className="page-header">
                <h2>Upload Customer Data</h2>
            </div>

            <div className="table-container" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <svg className="w-16 h-16 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <h3 className="text-xl font-semibold mb-2">Select Excel File</h3>
                    <p className="text-gray-500 mb-6">Upload a .xlsx or .xls file containing customer records.</p>
                </div>

                <div className="upload-area">
                    <input
                        type="file"
                        id="file-upload"
                        accept=".xlsx, .xls"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={loading}
                    />
                    <label
                        htmlFor="file-upload"
                        className="btn-primary"
                        style={{ display: 'inline-block', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? 'Uploading...' : 'Choose File'}
                    </label>
                </div>

                {uploadedCustomers.length > 0 && (
                    <div style={{ marginTop: '3rem', textAlign: 'left' }}>
                        <h3 className="text-lg font-bold mb-4">Uploaded Customers ({uploadedCustomers.length})</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>City</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {uploadedCustomers.map((cust, index) => (
                                        <tr key={index}>
                                            <td>{cust.name || cust.firstName + ' ' + cust.lastName}</td>
                                            <td>{cust.email}</td>
                                            <td>{cust.mobileNumber || cust.phoneNumber}</td>
                                            <td>{cust.city}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'left', background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <strong>Expected Format:</strong>
                    <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem', color: '#666' }}>
                        <li>Row 1: Header (ignored)</li>
                        <li>Column A: Name</li>
                        <li>Column B: Email</li>
                        <li>Column C: Mobile Number</li>
                        <li>Column D: Password</li>
                        <li>Column E: Address</li>
                        <li>Column F: City</li>
                        <li>Column G: State</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerUpload;
