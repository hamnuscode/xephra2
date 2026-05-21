# Rival — Backend ↔ Frontend Setup Guide

Everything you need to get the backend running locally and deploy it to your GoDaddy domain.

---

## What's already done (in code)

- `Backend/.env` created with placeholders + a generated JWT_SECRET
- `Client/.env` created pointing to `http://localhost:5000`
- CORS in `Backend/server.js` and `Backend/Socket/index.js` is now driven by `FRONTEND_URL` env var (no more hardcoded `xephra.net`)
- `Backend/package.json` has `start` and `dev` scripts added; broken self-reference removed
- Google OAuth strategy gracefully disables itself if `GOOGLE_CLIENT_ID` etc. aren't set (no startup crash)
- Backend dependencies installed (212 packages)

---

## What you need to do

### 1. Get a MongoDB connection string (REQUIRED)

**Easiest: MongoDB Atlas (free, cloud-hosted)**

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up
2. Create a free cluster (M0 tier, 512 MB — pick the region closest to you)
3. Under **Database Access** → Add Database User (username + password, save these)
4. Under **Network Access** → Add IP Address → "Allow Access From Anywhere" (0.0.0.0/0) for dev, or your specific IP for prod
5. Click **Connect** on your cluster → "Drivers" → copy the connection string. Looks like:
   ```
   mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<user>` and `<password>` with the ones from step 3
7. Add the database name: change the end from `.mongodb.net/?retryWrites...` to `.mongodb.net/rival?retryWrites...`
8. Paste it into `Backend/.env` as `MONGO_URI=...`

**Alternative: Local MongoDB**

If you'd rather run MongoDB locally:
- Install MongoDB Community Server from https://www.mongodb.com/try/download/community
- Use `MONGO_URI=mongodb://127.0.0.1:27017/rival` in `.env`

---

### 2. Get Gmail SMTP credentials (REQUIRED for email verification & password reset)

This is **not** your regular Gmail password — you need a 16-character "app password".

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if it isn't already (required to create app passwords)
3. Once 2FA is on, go to https://myaccount.google.com/apppasswords
4. Type any name (e.g., "Rival Backend") → click **Create**
5. Google shows a 16-char password like `abcd efgh ijkl mnop` — copy it (remove the spaces)
6. In `Backend/.env`:
   - `EMAIL_USER=your-gmail-address@gmail.com`
   - `EMAIL_PASS=abcdefghijklmnop` (the 16-char password, no spaces)

If you don't want to send real emails for now, just leave the placeholders — the server will still start, but signup/forgot-password emails will fail when those endpoints are called.

---

### 3. Skip Google OAuth (already disabled)

Email/password login already works. The Google "Sign in with Google" button just won't work. If you ever want to add it later:

1. Go to https://console.cloud.google.com/
2. Create a project → APIs & Services → Credentials → Create OAuth Client ID → Web Application
3. Add **Authorized redirect URI**: `http://localhost:5000/auth/google/callback` (for dev) and `https://api.yourdomain.com/auth/google/callback` (for prod)
4. Copy the Client ID and Secret into `Backend/.env`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   CALLBACKURL=http://localhost:5000/auth/google/callback
   ```
5. Uncomment those lines in `.env`

---

### 4. Run the backend

```powershell
cd Backend
npm start
```

Or for auto-restart on file changes:
```powershell
npm run dev
```

Expected output:
```
Server is running on port 5000
MongoDB Connected: cluster0-shard-00-00.xxxxx.mongodb.net
```

If MongoDB connects, you're good. Open http://localhost:5000 — you should see "Game Events API".

---

### 5. Run the frontend (in another terminal)

```powershell
cd Client
$env:NODE_OPTIONS="--openssl-legacy-provider"; $env:CI="false"; npm start
```

Now `http://localhost:3000` will talk to `http://localhost:5000` automatically.

Try signing up a real account — it should hit the backend and store the user in MongoDB.

---

## Deployment with your GoDaddy domain

GoDaddy sells domains but doesn't host Node.js servers. You need a separate hosting service to run the backend, and then point your GoDaddy domain at it via DNS.

### Step 1: Pick a backend host

| Service | Free tier | Best for |
|---|---|---|
| **Railway** | $5 free credit/mo | Easiest — git push to deploy, supports Socket.io |
| **Render** | Free (spins down when idle) | Simple, free, decent |
| **Fly.io** | Free for small apps | Better cold starts than Render |
| **DigitalOcean App Platform** | $5/mo minimum | Reliable, predictable pricing |

**My recommendation: Railway** for simplicity. Walk-through:

1. Push your repo to GitHub (already done: `hamnuscode/xephra2`)
2. Go to https://railway.app/, sign up with GitHub
3. New Project → Deploy from GitHub repo → pick `xephra2`
4. Railway detects Node.js. Set the **Root Directory** to `Backend`
5. Add environment variables in the Railway dashboard (everything from your `.env` file)
6. **Important:** set `FRONTEND_URL` to your production frontend URL (the Vercel one or your custom domain)
7. Deploy. Railway gives you a URL like `xephra2-backend-production.up.railway.app`

### Step 2: Point your GoDaddy domain at Railway

1. In Railway, go to your service → Settings → Networking → Custom Domain
2. Type the subdomain you want, e.g. `api.yourdomain.com`
3. Railway gives you a CNAME target like `xxx.up.railway.app`
4. In GoDaddy DNS Manager (https://dcc.godaddy.com/manage/dns):
   - Add a CNAME record: Host = `api`, Points to = the Railway CNAME target, TTL = 1 hour
5. Wait 5–30 minutes for DNS to propagate
6. Visit `https://api.yourdomain.com` — should show "Game Events API"

### Step 3: Update frontend to use the production backend

In your Vercel project settings (for the frontend):
- Add environment variable: `REACT_APP_BACKEND=https://api.yourdomain.com`
- Trigger a redeploy

Or if you want to use your GoDaddy domain for the frontend too:
- In GoDaddy DNS, add a CNAME `www` → `cname.vercel-dns.com` (or A record to Vercel IP)
- In Vercel, add the custom domain `www.yourdomain.com`

### Step 4: Update backend `FRONTEND_URL`

In Railway env vars, set:
```
FRONTEND_URL=https://www.yourdomain.com,https://xephra2-frontend.vercel.app
```
(Comma-separated — both origins allowed.)

Redeploy. Now the backend will accept CORS requests from your domain.

---

## File uploads in production

The backend currently saves uploads to `Backend/uploads/` on local disk. **This breaks on Railway/Render** because their disks are ephemeral (files are deleted on every redeploy).

**Fix when you're ready to ship:** swap `multer` to upload directly to **Cloudinary** (free tier: 25 GB storage, 25 GB bandwidth/month — plenty for this scale).

It's a ~30-minute change. Tell me when you want me to do it.

---

## Quick reference: the env vars you still need to fill in

In `Backend/.env`:
- `MONGO_URI` — paste your MongoDB Atlas connection string (step 1 above)
- `EMAIL_USER` — your Gmail address (step 2)
- `EMAIL_PASS` — your 16-char Gmail app password (step 2)

That's it. Everything else has sensible defaults or is auto-generated.
