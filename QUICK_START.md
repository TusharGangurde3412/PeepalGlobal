# Quick Start Guide - Peepal Export

## Prerequisites

- **Node.js 20.x** - Download from [nodejs.org](https://nodejs.org/)
- **MongoDB** - Either:
  - Install locally from [mongodb.com](https://www.mongodb.com/try/download/community)
  - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

## Installation Steps

### Step 1: Run Setup Script

**On Windows:**
```bash
setup.bat
```

**On Mac/Linux:**
```bash
bash setup.sh
```

This will install all dependencies for both backend and frontend.

### Step 2: Start MongoDB

**If using local MongoDB:**
```bash
mongod
```

**If using MongoDB Atlas:**
- Update `MONGODB_URI` in `backend/.env` with your connection string

### Step 3: Seed Sample Data

```bash
cd backend
node scripts/seedProducts.js
cd ..
```

### Step 4: Start Development Servers

**Option A - Using Batch/Shell Script (Windows/Mac/Linux):**

Windows:
```bash
start-dev.bat
```

Mac/Linux:
```bash
bash start-dev.sh
```

**Option B - Manual Start:**

Terminal 1 (Backend):
```bash
cd backend
npm start
```

Terminal 2 (Frontend):
```bash
cd frontend
npm start
```

### Step 5: Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:5000/api/health

## Project Structure

```
peepal-export/
├── backend/
│   ├── routes/          # API endpoints
│   ├── models/          # MongoDB schemas
│   ├── scripts/         # Database seeding
│   ├── server.js        # Express server
│   └── .env             # Environment variables
├── frontend/
│   ├── src/
│   │   ├── app/         # Components & services
│   │   ├── main.ts      # Entry point
│   │   └── styles.scss  # Global styles
│   ├── tsconfig.json
│   └── angular.json
├── setup.bat            # Automated setup (Windows)
├── setup.sh             # Automated setup (Mac/Linux)
└── README.md            # Full documentation
```

## Features Included

✅ **Home Page**
- Hero section with call-to-action
- Featured products carousel
- About preview
- Service highlights

✅ **Products Page**
- Browse by category (Agriculture, Automobiles, Textiles, Industrial, Handicrafts)
- Search functionality
- Pagination
- Product details

✅ **About Page**
- Company story and values
- Expertise areas
- Statistics

✅ **Contact Page**
- Contact form with validation
- Display contact information
- Message submission with feedback

✅ **Responsive Design**
- Mobile-friendly layouts
- Touch-friendly navigation
- Adaptive grid systems

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/peepal-export
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## Troubleshooting

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
# Windows: Check Services or run 'mongod'
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Run `ng serve --port 4300`

### npm install fails
```bash
# Clear cache and try again
rm -rf node_modules package-lock.json
npm install
```

### CORS Issues
The backend is already configured with CORS. Ensure:
- Backend is running on port 5000
- Frontend is running on port 4200
- ApiService URL is set correctly

## Development Commands

### Backend
```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm start      # Start dev server with live reload
npm run build  # Build for production
npm run test   # Run unit tests
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
# Output will be in dist/ directory
```

### Backend Production
```bash
# Set NODE_ENV=production in .env
# Deploy the backend directory to your server
```

## API Endpoints

### Products
- `GET /api/products` - List all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product details

### Inquiries
- `POST /api/inquiries` - Submit inquiry

### Contacts
- `POST /api/contacts` - Submit contact form

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

## Support

For issues:
1. Check the full README.md
2. Verify MongoDB is running
3. Ensure Node.js 20.x is installed
4. Check console logs in both terminal windows
5. Clear browser cache if seeing old data

---

**Ready to go!** Your Peepal Export application is now set up and ready to use. 🚀
