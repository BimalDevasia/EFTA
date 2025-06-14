"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'admin'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admins');
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins);
        setCurrentAdmin(data.currentAdmin);
      } else {
        console.error('Failed to fetch admins:', data.error);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (!formData.name) newErrors.name = 'Name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Admin added successfully!');
        setFormData({ email: '', password: '', name: '', role: 'admin' });
        setShowAddForm(false);
        fetchAdmins(); // Refresh the list
      } else {
        alert(`Failed to add admin: ${data.error}`);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      alert('Error adding admin. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAdmin = async (adminId, adminEmail) => {
    if (!confirm(`Are you sure you want to delete admin: ${adminEmail}?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admins?id=${adminId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('Admin deleted successfully!');
        fetchAdmins(); // Refresh the list
      } else {
        alert(`Failed to delete admin: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      alert('Error deleting admin. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8300FF]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-[36px] text-[#8300FF] font-bold">Admin Management</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#6b00cc] transition-colors"
        >
          {showAddForm ? 'Cancel' : 'Add Admin'}
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Admin</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="Full Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="admin@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                  placeholder="Password (min 8 characters)"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8300FF] focus:border-transparent"
                >
                  <option value="admin">Admin</option>
                  <option value="super-admin">Super Admin</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#8300FF] text-white px-6 py-2 rounded-md hover:bg-[#6b00cc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Adding...' : 'Add Admin'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Current Admins</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => {
                const adminId = admin._id || admin.id; // Support both MongoDB ObjectId and old numeric id
                const currentAdminId = currentAdmin?._id || currentAdmin?.id;
                
                return (
                  <tr key={adminId} className={adminId === currentAdminId ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {admin.name}
                        {adminId === currentAdminId && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        admin.role === 'super-admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(admin.createdAt || admin.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {adminId !== currentAdminId && (
                        <button
                          onClick={() => handleDeleteAdmin(adminId, admin.email)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminManagement;
