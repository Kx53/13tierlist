Build an MVP image-based tier list web app.

Stack:

- Frontend: Astro + Tailwind CSS
- Interactive components: React islands
- Backend: Node.js API
- Database: MongoDB
- Frontend deploy target: Vercel
- Backend + MongoDB: private server

Requirements:

- No login/signup
- Use anonymous ownership with edit token
- Public shareable URL for each tier list
- Image-based tier list with drag and drop
- Default tiers: S, A, B, C, D
- Rename/add/delete tiers
- Add items with title + image URL
- Save to MongoDB
- Same browser can edit later using saved token
- Others can view in read-only mode
- Store only hashed edit token in DB
- Do not store image binaries/base64 in MongoDB

Please:

1. Propose project structure
2. Define MongoDB schema
3. Implement API routes
4. Implement Astro pages and React components
5. Add localStorage autosave
6. Add deployment notes
7. Prioritize MVP first
