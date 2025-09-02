# Happy Thoughts API

Backend API for sharing happy thoughts. Users can post thoughts, like others' thoughts, and manage their own content.

## Live Demo

**API:** [https://js-project-api-cathi.onrender.com](https://js-project-api-cathi.onrender.com)

## Tech Stack

- Node.js & Express
- MongoDB with Mongoose
- JWT authentication
- bcrypt for passwords

## API Endpoints

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user

### Thoughts
- `GET /thoughts` - Get all thoughts
- `POST /thoughts` - Create thought
- `PATCH /thoughts/:id` - Update thought (own only)
- `DELETE /thoughts/:id` - Delete thought (own only)
- `PATCH /thoughts/:id/like` - Like thought
- `PATCH /thoughts/:id/unlike` - Unlike thought

## Installation

1. Clone repo and install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
MONGO_URL=mongodb://localhost/happy-thoughts
JWT_SECRET=your-secret-key
PORT=8080
```

3. Start development server:
```bash
npm run dev
```

## Features

- ✅ Anonymous and authenticated posting
- ✅ User authentication with JWT
- ✅ CRUD operations for thoughts
- ✅ Like/unlike functionality
- ✅ Input validation and error handling
- ✅ Pagination and filtering

## Deployment

Deployed on Render with MongoDB Atlas database.
