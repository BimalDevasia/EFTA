# Simplified Admin Authentication System

## Overview
The EFTA admin authentication system has been simplified to use hardcoded credentials instead of a complex user management system. This provides a clean, secure, and easy-to-maintain authentication solution for the admin panel.

## Authentication Details

### Admin Credentials
- **Email:** bimaldevasia@gmail.com
- **Password:** 12345678

### System Components

#### 1. Login API (`/src/app/api/auth/login/route.js`)
- Uses hardcoded credentials for authentication
- Creates JWT tokens for session management
- Sets HTTP-only cookies for security
- Returns user information on successful login

#### 2. Verification API (`/src/app/api/auth/verify/route.js`)
- Verifies JWT tokens from cookies
- Returns admin user information if token is valid
- Used by the frontend to check authentication status

#### 3. Logout API (`/src/app/api/auth/logout/route.js`)
- Clears authentication cookies
- Handles logout functionality

#### 4. Authentication Context (`/src/lib/auth.js`)
- Provides authentication state management
- Handles login, logout, and token verification
- Used throughout the admin interface

#### 5. Admin Layout Protection (`/src/app/admin/layout.jsx`)
- Implements AuthGuard component for route protection
- Automatically redirects unauthenticated users to login
- Shows loading states during authentication checks

## How It Works

### Authentication Flow
1. User accesses any `/admin/*` route
2. AuthGuard component checks authentication status
3. If not authenticated, user is redirected to `/admin/login`
4. User enters hardcoded credentials
5. System validates credentials and creates JWT token
6. Token is stored in HTTP-only cookie
7. User gains access to admin panel

### Route Protection
All admin routes are protected by the AuthGuard component:
- `/admin/orders` - Order management
- `/admin/product/*` - Product management
- `/admin/banners` - Banner management
- All other admin routes

### Security Features
- JWT tokens with 24-hour expiration
- HTTP-only cookies (prevent XSS attacks)
- Secure cookie settings in production
- Automatic token verification on each request

## Usage

### Accessing Admin Panel
1. Navigate to any admin URL (e.g., `http://localhost:3000/admin/orders`)
2. You'll be redirected to the login page
3. Enter the hardcoded credentials:
   - Email: bimaldevasia@gmail.com
   - Password: 12345678
4. Click "Sign in"
5. You'll be redirected to the admin panel

### Logging Out
- Click the "Logout" button in the admin sidebar
- You'll be redirected to the login page
- All authentication cookies will be cleared

## Files Modified/Created

### API Routes
- `/src/app/api/auth/login/route.js` - Simplified login with hardcoded credentials
- `/src/app/api/auth/verify/route.js` - Simplified token verification
- `/src/app/api/auth/logout/route.js` - Logout functionality

### Components
- `/src/app/admin/layout.jsx` - Added AuthGuard for route protection
- `/src/app/admin/login/page.jsx` - Clean login interface with credentials display
- `/src/lib/auth.js` - Authentication context provider

### Removed Files
- Complex user management system
- Setup/initialization flows
- Database-dependent user authentication

## Environment Variables
Make sure you have the following in your `.env.local` file:
```
JWT_SECRET=your-jwt-secret-key
```

## Benefits of This Approach
1. **Simplicity**: No complex user management
2. **Security**: JWT tokens with HTTP-only cookies
3. **Maintainability**: Easy to understand and modify
4. **Performance**: No database queries for authentication
5. **Reliability**: No dependency on user management system

## Future Enhancements
If you need to expand the system later, you can:
1. Add more admin users by modifying the credentials check
2. Implement role-based access control
3. Add password reset functionality
4. Integrate with external authentication providers

The current system provides a solid foundation for admin authentication while keeping things simple and secure.
