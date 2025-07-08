# Node.js Basic API

A simple and clean Node.js REST API built with Express.js and PostgreSQL. This project demonstrates a well-structured backend application with proper separation of concerns.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL** - Robust relational database
- **ES6 Modules** - Modern JavaScript import/export syntax
- **Environment Configuration** - Centralized environment variable management
- **Security Middleware** - Helmet for security headers
- **CORS Support** - Cross-origin resource sharing enabled
- **Clean Architecture** - Organized folder structure with separation of concerns

## 📁 Project Structure

```
base-nodejs/
├── src/
│   ├── app.js              # Main application entry point
│   ├── config/
│   │   └── env.js          # Environment configuration
│   ├── controllers/
│   │   └── user.controller.js  # User business logic
│   ├── routes/
│   │   └── user.route.js   # User API routes
│   ├── middleware/          # Custom middleware (empty)
│   └── utils/
│       └── db.js           # Database connection
├── package.json
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/xuanhinh0903/base-nodejs.git
   cd base-nodejs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DB_USER=your_db_user
   DB_HOST=localhost
   DB_NAME=your_database_name
   DB_PASSWORD=your_db_password
   DB_PORT=5432
   ```

4. **Database Setup**

   Make sure your PostgreSQL database is running and accessible with the credentials specified in your `.env` file.

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

This uses nodemon for automatic server restart on file changes.

### Production Mode

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## 📡 API Endpoints

### Base URL

```
http://localhost:3000
```

### Available Routes

| Method | Endpoint     | Description                       |
| ------ | ------------ | --------------------------------- |
| GET    | `/`          | Welcome message and server status |
| GET    | `/users`     | Get all users                     |
| GET    | `/users/:id` | Get user by ID                    |

### Example Responses

**GET /** - Welcome endpoint

```json
{
  "message": "Welcome to the Node.js API!",
  "status": "Server is running successfully",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

**GET /users** - Get all users

```
Danh sách người dùng
```

**GET /users/:id** - Get user by ID

```
Chi tiết người dùng có ID: {id}
```

## 🔧 Configuration

### Environment Variables

The application uses a centralized configuration system in `src/config/env.js`:

- `PORT` - Server port (default: 3000)
- `DB_USER` - PostgreSQL username
- `DB_HOST` - Database host (default: localhost)
- `DB_NAME` - Database name
- `DB_PASSWORD` - Database password
- `DB_PORT` - Database port (default: 5432)

### Database Connection

The application automatically tests the database connection on startup and logs the result to the console.

## 🛡️ Security Features

- **Helmet.js** - Security headers for protection against common vulnerabilities
- **CORS** - Cross-origin resource sharing configuration
- **Input Validation** - Basic request validation (can be extended)

## 📦 Dependencies

### Production Dependencies

- `express` - Web framework
- `pg` - PostgreSQL client
- `dotenv` - Environment variable loader
- `cors` - Cross-origin resource sharing
- `helmet` - Security middleware

### Development Dependencies

- `nodemon` - Development server with auto-restart

## 🧪 Testing

Currently, no tests are configured. To add testing:

```bash
npm install --save-dev jest supertest
```

## 🔄 Development Workflow

1. Make changes to your code
2. The development server will automatically restart (if using `npm run dev`)
3. Test your endpoints using a tool like Postman or curl
4. Commit your changes

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

If you encounter any issues or have questions:

- Create an issue on GitHub: [https://github.com/xuanhinh0903/base-nodejs/issues](https://github.com/xuanhinh0903/base-nodejs/issues)
- Check the project homepage: [https://github.com/xuanhinh0903/base-nodejs#readme](https://github.com/xuanhinh0903/base-nodejs#readme)

## 🎯 Next Steps

This is a basic setup that can be extended with:

- **Authentication & Authorization** - JWT tokens, user sessions
- **Input Validation** - Joi or express-validator
- **Error Handling** - Custom error classes and middleware
- **Logging** - Winston or Morgan for request logging
- **Testing** - Unit and integration tests
- **API Documentation** - Swagger/OpenAPI documentation
- **Rate Limiting** - Express-rate-limit
- **File Upload** - Multer for file handling
