GraphQL Services API with Redis Caching

A Node.js-based GraphQL API for managing user services with Redis caching and MongoDB as the database. This project includes user authentication, token-based access control, and CRUD operations for services.

Features

GraphQL API: Create, Read, Update, and Delete services.

Authentication: JWT-based authentication for secure access.

Redis Caching: Efficient caching for faster data retrieval and reduced DB load.

MongoDB: Mongoose for schema definition and data modeling.

Clean Architecture: Separate layers for Controller, Service, and Model.

User-Specific Data: Each user can manage their own services securely.

📂 Project Structure
├── controllers
│   └── serviceController.js
├── models
│   └── Service.js
├── routes
│   └── serviceRoutes.js
├── services
│   └── serviceService.js
├── middleware
│   └── authMiddleware.js
├── server.js
├── package.json
└── .env

⚙️ Installation & Setup

Clone the Repository
git clone <repository-url>
cd graphql-redis-api

Install Dependencies
npm install

Set Up Environment Variables
Create a .env file in the root directory and add the following:

JWT_SECRET=supersecretkey
MONGODB_URI=mongodb://localhost:27017/graphql-users
REDIS_URL=redis://localhost:6379

Start MongoDB and Redis Locally

# Start MongoDB
mongodb

# Start Redis
redis-server
