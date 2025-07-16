import React, { useState } from 'react';
import { X, Upload, User, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AddUserModal = ({ isOpen, onClose, onCreateUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    commission_structure: '',
    rep_code: '',
    avatar: null
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, avatar: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
    setAvatarPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.role) newErrors.role = 'Role is required';
    if (!formData.commission_structure) newErrors.commission_structure = 'Commission structure is required';
    if (!formData.rep_code.trim()) newErrors.rep_code = 'Rep code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newUser = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        commission_structure: formData.commission_structure,
        rep_code: formData.rep_code,
        avatar: avatarPreview,
        active: true,
        monthly_submissions: 0,
        active_this_month: 0,
        total_volume: 0,
        total_commissions: 0,
        created_at: new Date().toISOString()
      };

      onCreateUser(newUser);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        commission_structure: '',
        rep_code: '',
        avatar: null
      });
      setAvatarPreview(null);
      setErrors({});
      setIsSubmitting(false);
      onClose();
      
      // Show success message
      alert('User created successfully!');
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: '',
      commission_structure: '',
      rep_code: '',
      avatar: null
    });
    setAvatarPreview(null);
    setErrors({});
    onClose();
  };

  const isFormValid = formData.name && formData.email && formData.role && 
                     formData.commission_structure && formData.rep_code;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
              <p className="text-sm text-gray-600">Create a new user for the partner portal</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter full name"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Enter email address"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Role Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange('role', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.role ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a role</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Senior Sales Rep">Senior Sales Rep</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Account Manager">Account Manager</option>
              <option value="Admin">Admin</option>
            </select>
            {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role}</p>}
          </div>

          {/* Commission Structure Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Structure *
            </label>
            <select
              value={formData.commission_structure}
              onChange={(e) => handleInputChange('commission_structure', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.commission_structure ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select commission structure</option>
              <option value="High Residual">High Residual</option>
              <option value="Upfronts">Upfronts</option>
            </select>
            {errors.commission_structure && <p className="text-red-500 text-xs mt-1">{errors.commission_structure}</p>}
          </div>

          {/* Rep Code Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rep Code *
            </label>
            <input
              type="text"
              value={formData.rep_code}
              onChange={(e) => handleInputChange('rep_code', e.target.value.toUpperCase())}
              placeholder="Enter rep code (e.g., SJ001)"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.rep_code ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.rep_code && <p className="text-red-500 text-xs mt-1">{errors.rep_code}</p>}
          </div>

          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar
            </label>
            
            {avatarPreview ? (
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">Avatar uploaded successfully</p>
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Remove Avatar
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  Click to upload avatar
                </p>
                <p className="text-xs text-gray-500">
                  JPG, PNG up to 5MB
                </p>
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleAvatarUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <p className="text-sm text-gray-600">
            {isFormValid ? 'Ready to create user' : 'Please fill in all required fields'}
          </p>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
