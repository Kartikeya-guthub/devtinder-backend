# DevTinder Backend

DevTinder is a backend API for a developer connection platform, similar to a social network for developers. It allows users to sign up, create profiles, send and respond to connection requests, and discover other developers.

## Features
- User authentication (signup, login, logout) with JWT and cookies
- Profile management (view, edit, change password)
- Connection requests (send, respond, view received)
- User discovery feed
- MongoDB database integration
- Password and email validation

## Folder Structure
```
src/
  app.js                # Main Express app entry point
  config/
    database.js         # MongoDB connection setup
  middlewares/
    auth.js             # JWT authentication middleware
  models/
    user.js             # User schema and methods
    connectionRequest.js# Connection request schema
  router/
    auth.js             # Auth routes (signup, login, logout)
    profile.js          # Profile routes (view, edit, password)
    request.js          # Connection request routes
    user.js             # User routes (requests, connections, feed)
  utils/
    validation.js       # Data validation utilities
```

## Setup & Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure MongoDB connection in `src/config/database.js`
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server runs on port 3000 by default.

## API Endpoints
### Auth
- `POST /signup` — Register a new user
- `POST /login` — Login and receive JWT token
- `POST /logout` — Logout user

### Profile
- `GET /profile/view` — View logged-in user's profile
- `PATCH /profile/edit` — Edit profile fields
- `PATCH /profile/password` — Change password (note: new password is not hashed, security issue)

### Connection Requests
- `POST /request/send/:status/:toUserId` — Send a connection request (`status`: Ignore or Interested)
- `POST /request/respond/:status/:requestId` — Respond to a request (`status`: Accepted or Rejected)

### User
- `GET /user/requests/received` — List received connection requests
- `GET /user/connections` — List accepted connections
- `GET /feed` — Discover new users (paginated)

## Models
- **User**: firstName, lastName, emailId, password, age, gender, skills, bio, photoUrl
- **ConnectionRequest**: fromUserId, toUserId, status (Ignore, Accepted, Rejected, Interested)

## Middleware
- **userAuth**: Verifies JWT from cookies, attaches user to request

## Utils
- **validateSignupData**: Validates signup fields
- **validateEditProfileData**: Validates editable profile fields

## Author
Kartikeya Sharma

## License
ISC
