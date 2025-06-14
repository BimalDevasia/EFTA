import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email address'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ deletedAt: 1 });

// Pre-save hook to hash password
adminSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
adminSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Static method to find active admins only
adminSchema.statics.findActive = function(filter = {}) {
  return this.find({ 
    ...filter, 
    isActive: true, 
    deletedAt: null 
  });
};

// Static method to soft delete admin
adminSchema.statics.softDelete = function(id) {
  return this.findByIdAndUpdate(
    id, 
    { 
      isActive: false, 
      deletedAt: new Date() 
    }, 
    { new: true }
  );
};

// Transform output to remove sensitive data
adminSchema.methods.toSafeObject = function() {
  const adminObject = this.toObject();
  delete adminObject.password;
  delete adminObject.deletedAt;
  delete adminObject.__v;
  return adminObject;
};

// Create default super admin if none exists
adminSchema.statics.createDefaultAdmin = async function() {
  try {
    const existingAdmin = await this.findOne({ role: 'super-admin', isActive: true });
    
    if (!existingAdmin) {
      console.log('Creating default super admin...');
      const defaultAdmin = new this({
        email: 'bimaldevasia@gmail.com',
        password: '12345678', // Will be hashed by pre-save hook
        name: 'Bimal Devasia',
        role: 'super-admin'
      });
      
      await defaultAdmin.save();
      console.log('Default super admin created successfully');
      return defaultAdmin;
    }
    
    return existingAdmin;
  } catch (error) {
    console.error('Error creating default admin:', error);
    throw error;
  }
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
