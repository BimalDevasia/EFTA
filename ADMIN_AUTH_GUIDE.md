# Admin Authentication System

## Overview
The EFTA admin panel now includes a complete authentication system with user management capabilities.

## Features
- **Secure Login**: JWT-based authentication with HTTP-only cookies
- **User Management**: Create and manage admin users from within the admin panel
- **Role-Based Access**: Support for admin and super_admin roles
- **Initial Setup**: Automated first-time setup for creating the initial admin user
- **Session Management**: Automatic token verification and logout functionality

## Getting Started

### 1. Initial Setup
When accessing the admin panel for the first time:
1. Visit `/admin/login`
2. If no users exist, you'll be redirected to `/admin/setup`
3. Create the first admin user with super admin privileges
4. After setup, you'll be redirected to the login page

### 2. Default Credentials (if using setup endpoint)
- **URL**: `http://localhost:3000/admin/setup`
- Create your own admin credentials during setup

### 3. Login Process
1. Visit `/admin/login`
2. Enter your email and password
3. Upon successful login, you'll be redirected to `/admin/orders`

## User Management

### Creating New Users
1. Login to admin panel
2. Navigate to "Users" section
3. Fill in user details:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Role (Admin or Super Admin)
4. Click "Create User"

### User Roles
- **Admin**: Basic admin access to all admin functions
- **Super Admin**: Full access including user management

## Security Features

### JWT Authentication
- Tokens expire after 24 hours
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production

### Password Security
- Passwords are hashed using bcryptjs with salt rounds of 12
- Minimum password length of 6 characters
- Passwords are never stored in plain text

### Route Protection
- All admin routes protected by middleware
- Invalid tokens automatically redirect to login
- Setup and login pages are public

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token validity
- `GET /api/auth/setup` - Check if setup is needed
- `POST /api/auth/setup` - Create initial admin user

### User Management
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user (admin only)

## Environment Variables
Add to your `.env.local`:
```env
JWT_SECRET=efta_admin_jwt_secret_key_2024_secure
```

## File Structure
```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.jsx
│   │   ├── setup/page.jsx
│   │   ├── users/page.jsx
│   │   └── layout.jsx
│   └── api/
│       ├── auth/
│       │   ├── login/route.js
│       │   ├── logout/route.js
│       │   ├── verify/route.js
│       │   └── setup/route.js
│       └── users/route.js
├── components/
│   ├── AdminUsers.jsx
│   └── ...
├── lib/
│   ├── auth.js
│   └── models/user.js
└── middleware.js
```

## Usage Examples

### Creating Initial Admin User
```javascript
// Via API
POST /api/auth/setup
{
  "name": "Admin User",
  "email": "admin@efta.com", 
  "password": "secure123"
}
```

### User Login
```javascript
// Via API
POST /api/auth/login
{
  "email": "admin@efta.com",
  "password": "secure123"
}
```

### Creating New User
```javascript
// Via API (requires authentication)
POST /api/users
{
  "name": "New Admin",
  "email": "newadmin@efta.com",
  "password": "password123",
  "role": "admin"
}
```

## Troubleshooting

### Common Issues
1. **"Invalid token" errors**: Clear browser cookies and login again
2. **Setup page not showing**: Check if users already exist in database
3. **Login fails**: Verify email/password and check server logs

### Database Issues
- Ensure MongoDB connection is working
- Check that User model is properly imported
- Verify environment variables are set

### Development Tips
- Use browser dev tools to inspect cookies
- Check Network tab for API responses
- Review server logs for authentication errors

## Security Considerations
- Change default JWT secret in production
- Use HTTPS in production
- Regularly rotate JWT secrets
- Monitor login attempts and failed authentications
- Consider implementing rate limiting for login attempts
