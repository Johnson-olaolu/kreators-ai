# Kreators AI Backend

This is a robust Node.js/Express backend application built with TypeScript. The application provides a complete authentication system with user management capabilities.

## Key Features

- User authentication with JWT and Passport
- Email verification system
- Profile picture upload functionality
- MongoDB integration
- Redis support
- Docker configuration for development
- TypeScript for type safety
- Express middleware for validation and error handling

## Tech Stack

- Node.js/Express
- TypeScript
- MongoDB
- Redis
- Docker
- Passport.js
- Nodemailer
- Multer for file uploads
- Zod for validation

## Getting Started

1. Clone the repository
2. Copy `.example.env` to `.env` and configure your environment variables
3. Run `npm install`
4. Start MongoDB and Redis using `docker-compose up -d`
5. Run `npm run dev` for development

## API Endpoints

- Auth: `/api/auth` (register, login, email verification , device management)
- Users: `/api/user` (CRUD operations, profile management)

## Security Features

- Password hashing with bcrypt
- JWT authentication
- Input validation
- Helmet for security headers