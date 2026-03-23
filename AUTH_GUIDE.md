# HireIQ Authentication Guide

## Login Credentials

Both HR and Employee logins use the same credentials:

```
Email: likhitha1112@outlook.com
Password: 12345678
```

## Authentication Flow

### 1. Login Page (`/login`)
- Two login type options:
  - **HR Login** (👔): For recruiters managing candidates
  - **Employee Login** (👤): For candidates taking voice assessments

### 2. After Login
- Credentials are validated against the hardcoded credentials
- On successful login:
  - User data is stored in `AuthContext` (email, role, login time)
  - Redirect to Dashboard (`/`)
  
### 3. Dashboard
- Protected route - requires authentication
- User info displayed in header:
  - Email address
  - Login role (HR/Employee)
- Logout button in header to clear session

### 4. Voice Assessment (`/assess/:assessmentId`)
- Protected route - requires authentication
- Only accessible after login

## File Structure

```
src/
├── context/
│   └── AuthContext.jsx          # Authentication state management
├── pages/
│   ├── Login.jsx                # Login page with two login types
│   ├── Dashboard.jsx            # Protected dashboard with logout
│   └── VoiceBot.jsx             # Protected voice assessment
├── components/
│   └── ProtectedRoute.jsx       # Route protection wrapper
├── styles/
│   └── Login.css                # Login page styling
└── index.css                    # Global styles
```

## Key Features

✓ Two login type options (HR/Employee)  
✓ Authentication context for state management  
✓ Protected routes - redirects to login if not authenticated  
✓ User session display in dashboard header  
✓ Logout functionality  
✓ Modern, responsive design  

## Implementation Details

### AuthContext
- Manages `user` object containing: `email`, `role`, `loginTime`
- Provides `login()` and `logout()` functions
- Tracks `isAuthenticated` boolean

### ProtectedRoute Component
- Wraps protected routes
- Checks `isAuthenticated` status
- Redirects to `/login` if not authenticated

### Login Page
- Split UI for two login types
- Validation against hardcoded credentials
- Demo credentials displayed for reference
- Loading state during submission
- Error handling with visual feedback

## Testing

1. Navigate to `/login`
2. Choose login type (HR or Employee)
3. Enter credentials:
   - Email: `likhitha1112@outlook.com`
   - Password: `12345678`
4. Click login
5. Redirected to dashboard
6. User info visible in header
7. Click logout to return to login page
