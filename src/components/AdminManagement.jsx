"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { FALLBACK_CONSTANTS, VALIDATION_PATTERNS } from '@/lib/constants';

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

  // WhatsApp Settings State
  const [whatsappSettings, setWhatsappSettings] = useState({
    business_whatsapp_number: '',
    customer_support_phone: ''
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsErrors, setSettingsErrors] = useState({});
  const [showWhatsAppForm, setShowWhatsAppForm] = useState(false);
  const [isUpdatingSettings, setIsUpdatingSettings] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchAdmins();
    fetchWhatsAppSettings();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admins');
      const data = await response.json();
      
      if (response.ok) {
        setAdmins(data.admins);
        setCurrentAdmin(data.currentAdmin);
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const fetchWhatsAppSettings = async () => {
    try {
      setSettingsLoading(true);
      const response = await fetch('/api/settings?category=whatsapp');
      const data = await response.json();
      
      if (response.ok) {
        const settingsMap = {};
        data.settings.forEach(setting => {
          settingsMap[setting.key] = setting.value;
        });
        
        // Set default values if settings don't exist (use fallbacks)
        setWhatsappSettings({
          business_whatsapp_number: settingsMap.business_whatsapp_number || FALLBACK_CONSTANTS.BUSINESS_PHONE_FALLBACK,
          customer_support_phone: settingsMap.customer_support_phone || FALLBACK_CONSTANTS.SUPPORT_PHONE_FALLBACK
        });
      }
    } catch (error) {
      // Error handled silently
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleWhatsAppSettingsChange = (e) => {
    const { name, value } = e.target;
    setWhatsappSettings(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (settingsErrors[name]) {
      setSettingsErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateWhatsAppSettings = () => {
    const newErrors = {};
    
    if (!whatsappSettings.business_whatsapp_number.trim()) {
      newErrors.business_whatsapp_number = 'Business WhatsApp number is required';
    } else if (!VALIDATION_PATTERNS.INTERNATIONAL_PHONE.test(whatsappSettings.business_whatsapp_number.trim())) {
      newErrors.business_whatsapp_number = `Please enter a valid phone number with country code (e.g., ${FALLBACK_CONSTANTS.PHONE_FORMAT_EXAMPLE})`;
    }
    
    if (!whatsappSettings.customer_support_phone.trim()) {
      newErrors.customer_support_phone = 'Customer support phone is required';
    } else if (!VALIDATION_PATTERNS.INTERNATIONAL_PHONE.test(whatsappSettings.customer_support_phone.trim())) {
      newErrors.customer_support_phone = `Please enter a valid phone number with country code (e.g., ${FALLBACK_CONSTANTS.PHONE_FORMAT_EXAMPLE})`;
    }
    
    setSettingsErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleWhatsAppSettingsSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateWhatsAppSettings()) {
      return;
    }
    
    setIsUpdatingSettings(true);
    
    try {
      const settingsToUpdate = [
        {
          key: 'business_whatsapp_number',
          value: whatsappSettings.business_whatsapp_number.trim(),
          description: 'Primary WhatsApp number for business inquiries',
          category: 'whatsapp'
        },
        {
          key: 'customer_support_phone',
          value: whatsappSettings.customer_support_phone.trim(),
          description: 'Customer support phone number',
          category: 'contact'
        }
      ];

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToUpdate }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('WhatsApp settings updated successfully!');
        setShowWhatsAppForm(false);
        fetchWhatsAppSettings(); // Refresh settings
      } else {
        alert(`Failed to update settings: ${data.error}`);
      }
    } catch (error) {
      alert('Error updating settings. Please try again.');
    } finally {
      setIsUpdatingSettings(false);
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
        <div className="flex gap-3">
          <button
            onClick={() => setShowWhatsAppForm(!showWhatsAppForm)}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            {showWhatsAppForm ? 'Close' : 'WhatsApp Settings'}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#8300FF] text-white px-4 py-2 rounded-md hover:bg-[#6b00cc] transition-colors"
          >
            {showAddForm ? 'Cancel' : 'Add Admin'}
          </button>
        </div>
      </div>

      {/* WhatsApp Settings Section */}
      {showWhatsAppForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">WhatsApp Settings</h2>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              <span className="text-sm text-gray-500">Configure WhatsApp numbers for customer contact</span>
            </div>
          </div>
          
          {settingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <form onSubmit={handleWhatsAppSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business WhatsApp Number
                  </label>
                  <input
                    type="text"
                    name="business_whatsapp_number"
                    value={whatsappSettings.business_whatsapp_number}
                    onChange={handleWhatsAppSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={FALLBACK_CONSTANTS.PHONE_FORMAT_EXAMPLE}
                  />
                  {settingsErrors.business_whatsapp_number && (
                    <p className="text-red-500 text-sm mt-1">{settingsErrors.business_whatsapp_number}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Used for product inquiries and business communication</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Support Phone
                  </label>
                  <input
                    type="text"
                    name="customer_support_phone"
                    value={whatsappSettings.customer_support_phone}
                    onChange={handleWhatsAppSettingsChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder={FALLBACK_CONSTANTS.PHONE_FORMAT_EXAMPLE}
                  />
                  {settingsErrors.customer_support_phone && (
                    <p className="text-red-500 text-sm mt-1">{settingsErrors.customer_support_phone}</p>
                  )}
                  <p className="text-gray-500 text-xs mt-1">Used for customer support and general inquiries</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingSettings}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingSettings ? 'Updating...' : 'Update WhatsApp Settings'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWhatsAppForm(false);
                    setSettingsErrors({});
                    fetchWhatsAppSettings(); // Reset to original values
                  }}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

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
