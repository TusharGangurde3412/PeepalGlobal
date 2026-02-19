# Peepal Export - Import/Export Platform

A modern web application for import and export of agricultural goods, automobiles, textiles, and industrial products.

## Tech Stack

- **Frontend**: Angular 17, TypeScript, SCSS
- **Backend**: Node.js 20, Express.js
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
peepal-export/
├── backend/          # Node.js + Express API
│   ├── routes/       # API endpoints
│   ├── models/       # MongoDB schemas
│   ├── server.js     # Express server
│   └── package.json
└── frontend/         # Angular application
    ├── src/
    │   ├── app/      # Components & services
    │   ├── styles.scss
    │   └── main.ts
    └── package.json
```

## Prerequisites

- Node.js 20.x
- MongoDB (running locally or Atlas connection)
- Angular CLI 17.x

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peepal-export
JWT_SECRET=your_secret_key_here
NODE_ENV=development

# Owner notifications
OWNER_EMAIL=owner@example.com
NOTIFY_SUBJECT_PREFIX=Peepal Export
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM=Peepal Export <no-reply@example.com>
```
Or copy `backend/.env.example` and update values.

4. Make sure MongoDB is running, then start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Application will open at `http://localhost:4200`

## Features

- **Home Page**: Hero section, featured products, about preview
- **Products Page**: Browse products by category, search functionality, pagination
- **About Page**: Company information, values, expertise, statistics
- **Contact Page**: Contact form with automated email notifications
- **Responsive Design**: Mobile-friendly layout
- **User Authentication**: Register and login system
- **Product Inquiries**: Submit inquiries for specific products

## Database Seeding

To seed sample data, run:

```bash
# In backend directory
node scripts/seedProducts.js
```

## Available Categories

- Agriculture
- Automobiles
- Textiles
- Industrial
- Handicrafts

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - List all products (with pagination, filtering)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details

### Inquiries
- `POST /api/inquiries` - Submit product inquiry
- `GET /api/inquiries` - List inquiries

### Contacts
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - List contact messages

### Notifications
- `GET /api/notifications/summary` - Pending/unread style counts for owner/admin dashboard

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm start    # Starts dev server with live reload
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ folder
```

### Backend
Already optimized for production. Set `NODE_ENV=production` in `.env`

## Troubleshooting

### MongoDB Connection Error
Ensure MongoDB is running:
```bash
# For local MongoDB
mongod
```

Or use MongoDB Atlas:
1. Update `MONGODB_URI` in `.env` with your connection string
2. Format: `mongodb+srv://username:password@cluster.mongodb.net/peepal-export`

### Angular Build Errors
Clear cache and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
Backend CORS is already configured. Ensure frontend and backend are using correct URLs in API service.

## Contact & Support

For issues or questions about the project, please contact the development team.

## License

This project is proprietary and confidential.
