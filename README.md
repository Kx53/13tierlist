Build an MVP web app for creating and sharing image-based tier lists.

Tech stack:

- Frontend: Astro + Tailwind CSS
- Interactive components: React islands inside Astro
- Backend: Node.js API on a private server
- Database: MongoDB
- Frontend deploy target: Vercel

Requirements:

- No user login/signup
- Use anonymous ownership with edit token
- On tier list creation, generate a unique slug and an edit token
- Store only a hashed version of the edit token in MongoDB
- Return raw edit token to frontend once, and store it in localStorage
- Public users can open shared links in read-only mode
- Owner on the same browser can edit using saved token

Core features:

- Create a new tier list
- Default tiers: S, A, B, C, D
- Rename, add, and delete tiers
- Add image-based items with title and image URL
- Drag and drop items between tiers
- Reorder items within the same tier
- Save tier list to MongoDB
- Share tier list via public URL like /list/[slug]
- Autosave draft state to localStorage
- Restore draft/editor state from localStorage when appropriate

API:

- POST /api/tier-lists
- GET /api/tier-lists/:slug
- PUT /api/tier-lists/:slug
- POST /api/tier-lists/:slug/items
- DELETE /api/tier-lists/:slug/items/:itemId
- POST /api/upload

Constraints:

- Do not store image binaries or large base64 blobs in MongoDB
- Store image URLs only
- Validate input on all endpoints
- Add basic rate limiting
- Use CORS correctly for Vercel frontend -> private backend
- Hash edit tokens before storing

Pages:

- /
- /create
- /list/[slug]

Deliver:

- Project structure
- MongoDB schema
- API route implementation plan
- Frontend page/component plan
- Ownership/edit-token flow
- Deployment notes for Vercel frontend + private backend + private MongoDB

Use this stack:

- Frontend: Astro + Tailwind CSS + React islands
- Frontend deployment: Vercel
- Backend runtime: Bun (self-hosted on homelab)
- Backend style: Node-compatible code
- Database: MongoDB (private/self-hosted)

Important constraints:

- Backend must run under Bun on a homelab machine
- Avoid Bun-specific APIs unless necessary
- Prefer standard Node-compatible packages
- Use official MongoDB driver or Mongoose
- Put Nginx/Caddy in front of the Bun app for HTTPS and reverse proxy
- Frontend communicates with backend over HTTPS
