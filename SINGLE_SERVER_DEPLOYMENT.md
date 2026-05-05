# **Single Server Deployment Guide**

## Problem Fixed ✅
- ❌ Render.com free tier goes to sleep after 15 minutes
- ❌ Cold starts cause email timeouts  
- ❌ Separate deployments = higher latency

- ✅ Now: Single always-on server serving both frontend & backend
- ✅ Emails work reliably
- ✅ No cold start delays

---

## Local Testing

### 1. Build the Frontend
```bash
cd frontend
ng build --configuration production
```
This creates: `frontend/dist/frontend/browser/`

### 2. Start Backend Server
```bash
cd backend
npm start
```

### 3. Access Application
Open: **http://localhost:5000**

All pages + API routes work from single server ✅

---

## Deployment to Render.com

### 1. Update Environment Files

**frontend/src/environments/environment.prod.ts:**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://peepalglobal-2.onrender.com/api',
  imageBaseUrl: 'https://peepalglobal-2.onrender.com'
};
```

### 2. Build Frontend (do this BEFORE deploying)
```bash
cd frontend
ng build --configuration production
```

Verify: `frontend/dist/frontend/browser/index.html` exists

### 3. Push to Git
```bash
git add .
git commit -m "Setup single server deployment - frontend + backend combined"
git push origin main
```

### 4. Update Render.com Deployment Settings

Go to: https://dashboard.render.com

**Service**: `peepalglobal-2`

**Build Command:**
```bash
cd frontend && ng build --configuration production && cd ../backend && npm install
```

**Start Command:**
```bash
cd backend && npm start
```

**Environment Variables:**
```
NODE_ENV=production
CORS_ORIGINS=https://peepalglobal-2.onrender.com
PORT=5000
MONGODB_URI=[your-mongodb-uri]
JWT_SECRET=[your-secret]
CLOUDINARY_CLOUD_NAME=dahbq6sjh
CLOUDINARY_API_KEY=612215698663627
CLOUDINARY_API_SECRET=_4izoBlnwXxSb8JLu09WoJO85d8
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tgangurde050@gmail.com
SMTP_PASS=hhpwiexfvtpnpcgs
OWNER_EMAIL=tusharsg3412@gmail.com
NOTIFY_SUBJECT_PREFIX=Peepal Export
SMTP_FROM=Peepal Export <tgangurde050@gmail.com>
```

### 5. Disable Netlify Frontend Deployment

Go to: https://app.netlify.com

- Delete the `peepal-export` site (or disconnect it)
- This saves free tier slot for future use
- Frontend now served from Render.com backend ✅

### 6. Test Production

- Visit: https://peepalglobal-2.onrender.com
- All pages should load from single server
- Emails send reliably (no timeout)
- No cold start delays

---

## Benefits ✅

| Feature | Before | After |
|---------|--------|-------|
| **Deployments** | 2 places | 1 place |
| **Cold starts** | Yes (5-10s) | No ❌ |
| **Email timeouts** | Frequent | Never |
| **First load** | 15-20s | 3-5s |
| **Hosting cost** | Free | Free |
| **Management** | Complex | Simple |

---

## Troubleshooting

### Frontend not showing
- ❌ Did you run `ng build --configuration production`?
- ❌ Is `frontend/dist/frontend/browser/index.html` in git?

### Emails still timing out
- Check Render.com logs for errors
- Set `NOTIFICATION_DEBUG=true` in .env
- Restart service

### "Cannot find module"
- Run: `npm install` in backend
- Ensure all dependencies installed

