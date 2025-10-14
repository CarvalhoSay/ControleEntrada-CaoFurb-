Frontend-only Login added
=========================

Files:
- src/auth.ts
- src/pages/LoginPage.tsx
- src/App.tsx (modified)

How it works:
- Simple in-memory validation (admin / admin123) inside LoginPage.tsx
- Upon login, stores a small token in localStorage (if 'Lembrar-me') or sessionStorage.
- Route protection via Protected component in App.tsx
- Navbar shows 'Sair' when authenticated.

Change default credentials:
- Edit DEFAULT inside src/pages/LoginPage.tsx

Run:
- npm run dev
- Open http://localhost:5173/login

Notes:
- This is for controlled environments only. Not secure for production.
