# ✅ SETUP VERIFICATION CHECKLIST

Complete this checklist to verify your Peepal Export installation is working correctly.

---

## 📋 Pre-Installation Check

- [ ] Node.js 20.x installed
  ```bash
  node --version  # Should show v20.x.x
  ```

- [ ] npm installed
  ```bash
  npm --version   # Should show 10.x.x or higher
  ```

- [ ] MongoDB installed or Atlas account created
  ```bash
  mongod --version  # If local installation
  ```

---

## 🔧 Installation Check

- [ ] Backend dependencies installed
  ```bash
  cd backend
  npm list express mongoose    # Should show installed versions
  cd ..
  ```

- [ ] Frontend dependencies installed
  ```bash
  cd frontend
  npm list @angular/core       # Should show installed version
  cd ..
  ```

- [ ] `.env` file created in backend folder
  ```bash
  cat backend/.env             # Should show your configuration
  ```

---

## 🚀 Startup Check

### Backend Server

- [ ] Backend starts without errors
  ```bash
  cd backend
  npm start
  # Should show: "Server running on port 5000"
  ```

- [ ] Backend health check passes
  ```bash
  curl http://localhost:5000/api/health
  # Should return: {"status":"API is running"}
  ```

- [ ] MongoDB connection successful
  ```bash
  # Check backend console for: "MongoDB connected"
  ```

- [ ] Database accessible
  ```bash
  # No connection errors in backend console
  ```

### Frontend Server

- [ ] Frontend starts without errors
  ```bash
  cd frontend
  npm start
  # Should start Angular dev server and open browser
  ```

- [ ] Frontend loads in browser
  ```bash
  # Visit http://localhost:4200
  # Should see Peepal Export homepage
  ```

- [ ] No console errors
  ```bash
  # Open browser Developer Tools (F12)
  # Check Console tab - should be clean
  ```

---

## 🏠 Homepage Check

Open http://localhost:4200 and verify:

- [ ] Navigation bar displays correctly
  - [ ] Peepal Export logo visible
  - [ ] Menu items: Home, About Us, Industries, Contact Us
  - [ ] "Request a Quote" button visible

- [ ] Hero section displays
  - [ ] Main headline: "Your Trusted Import Export Partner"
  - [ ] Tagline: "Connecting Businesses Across the Globe"
  - [ ] "Explore Our Services" button works

- [ ] Features section shows
  - [ ] Global Sourcing card
  - [ ] Reliable Logistics card
  - [ ] Quality Assurance card

- [ ] About section displays
  - [ ] "About Peepal Export" heading
  - [ ] 10+ Years, Worldwide Network, Certified & Trusted
  - [ ] "Learn More" button works

- [ ] Featured products section
  - [ ] Shows product cards (if seeded)
  - [ ] "View All Products" link works

- [ ] Footer displays
  - [ ] Copyright information

---

## 🛒 Products Page Check

Click "Industries" or "Explore Our Services" and verify:

- [ ] Products page loads
- [ ] Category filters display (Agriculture, Automobiles, etc.)
- [ ] Search box functional
- [ ] Products listed in grid
- [ ] Pagination shows (if many products)
- [ ] Product cards display image, name, category
- [ ] "Inquire Now" buttons visible

---

## 📝 Contact Page Check

Click "Contact Us" and verify:

- [ ] Contact page loads
- [ ] Contact form displays with fields:
  - [ ] First Name
  - [ ] Last Name
  - [ ] Email
  - [ ] Phone
  - [ ] Category dropdown
  - [ ] Subject
  - [ ] Message textarea
  - [ ] Send button

- [ ] Contact information displayed:
  - [ ] Address section
  - [ ] Phone section
  - [ ] Email section
  - [ ] Hours section

- [ ] Form submission works
  - [ ] Fill form and click "Send Message"
  - [ ] Should show success message
  - [ ] Form should clear

---

## ℹ️ About Page Check

Click "About Us" and verify:

- [ ] About page loads
- [ ] Company story section displays
- [ ] Values section shows 4 cards:
  - [ ] Integrity
  - [ ] Quality
  - [ ] Reliability
  - [ ] Innovation

- [ ] Expertise section displays 4 items:
  - [ ] Agricultural Products
  - [ ] Automobiles
  - [ ] Textiles & Garments
  - [ ] Industrial Goods

- [ ] Statistics section shows:
  - [ ] 10+ Years
  - [ ] 50+ Countries
  - [ ] 1000+ Clients
  - [ ] 100% Satisfaction

---

## 🗄️ Database Check

- [ ] MongoDB is running
- [ ] Products seeded (if you ran seed script)
  ```bash
  # Backend should show products in responses
  ```

---

## 🔗 API Endpoints Check

Test endpoints using curl or Postman:

- [ ] Health check
  ```bash
  curl http://localhost:5000/api/health
  ```

- [ ] Get products
  ```bash
  curl http://localhost:5000/api/products?page=1&limit=12
  ```

- [ ] Get featured products
  ```bash
  curl http://localhost:5000/api/products/featured
  ```

- [ ] Submit contact form
  ```bash
  curl -X POST http://localhost:5000/api/contacts \
    -H "Content-Type: application/json" \
    -d '{"firstName":"John","email":"john@example.com",...}'
  ```

---

## 📱 Responsive Design Check

- [ ] Open on mobile device or resize browser
- [ ] Navigation becomes hamburger menu (if implemented)
- [ ] Content stays readable on small screens
- [ ] No horizontal scrolling
- [ ] Buttons and forms accessible on mobile

---

## 🐛 Troubleshooting Checks

If something isn't working:

- [ ] MongoDB is running
  ```bash
  mongod  # or check Services on Windows
  ```

- [ ] Ports are not blocked
  ```bash
  # 5000 for backend
  # 4200 for frontend
  ```

- [ ] No other apps using those ports
  ```bash
  # Windows: netstat -ano | findstr :5000
  # Mac/Linux: lsof -i :5000
  ```

- [ ] Dependencies installed
  ```bash
  npm install  # in both frontend and backend dirs
  ```

- [ ] Browser cache cleared
  ```bash
  # Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)
  ```

- [ ] Console shows no critical errors
  ```bash
  # F12 → Console tab in browser
  # Backend console in terminal
  ```

---

## ✅ Final Verification

All items checked? You're ready to go! 🎉

- [ ] All pre-installation checks ✅
- [ ] All installation checks ✅
- [ ] All startup checks ✅
- [ ] All page checks ✅
- [ ] All API endpoint checks ✅
- [ ] Responsive design works ✅

---

## 📞 If You Encounter Issues

1. **Check the logs** - Backend console and browser console
2. **Verify prerequisites** - Node.js, npm, MongoDB
3. **Restart servers** - Kill and restart both servers
4. **Clear cache** - `npm install` and browser cache
5. **Check documentation** - See README.md and QUICK_START.md

---

## 🎉 Success!

If all checks pass, your Peepal Export platform is fully functional and ready for development!

Start exploring the codebase and adding your own customizations.

**Happy coding!** 🚀
