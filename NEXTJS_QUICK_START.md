# 🚀 Next.js Migration - Quick Start Guide

## ✅ Migration Complete!

Your Alidaad website has been successfully migrated from **React + Vite** to **Next.js 15** with the App Router.

---

## 📦 Installation & Running

### 1. **Install Dependencies**
```bash
cd alidaad_client
npm install
```

### 2. **Run Development Server**
```bash
npm run dev
```

Your app will be available at: **http://localhost:3000**

### 3. **Build for Production**
```bash
npm run build
npm start
```

---

## 🎯 What Changed

### ✨ **New Structure**
- ✅ **Next.js App Router** (file-based routing)
- ✅ **All routes converted** (public + dashboard)
- ✅ **Authentication guards updated** (PrivateRoute, AdminRoute)
- ✅ **Navigation layer** for compatibility
- ✅ **Layouts configured** (Main + Dashboard)

### 📂 **Key Files**

#### Configuration
- `next.config.mjs` - Next.js config
- `tsconfig.json` - TypeScript/JSX support
- `tailwind.config.js` - Tailwind CSS
- `postcss.config.mjs` - PostCSS

#### App Structure
- `src/app/layout.jsx` - Root layout with providers
- `src/app/page.jsx` - Homepage
- `src/app/*/page.jsx` - All pages
- `src/lib/navigation.js` - React Router compatibility

#### Routes Created
**Public:**
- `/` - Home
- `/login`, `/register` - Auth
- `/products`, `/product_details/[id]` - Products
- `/category`, `/search` - Browse
- `/checkout/[[...id]]` - Checkout
- `/order_confirm/[order_id]` - Confirmation
- `/account` - User account (protected)

**Dashboard (Admin):**
- `/dashboard` - Analytics
- `/dashboard/new_orders` - New orders
- `/dashboard/pending_orders` - Pending
- `/dashboard/completed_orders` - Completed
- `/dashboard/cancelled_orders` - Cancelled
- `/dashboard/all_product` - Products
- `/dashboard/add_product` - Add product
- `/dashboard/update_product/[id]` - Update
- `/dashboard/admin_chat` - Chat
- `/dashboard/users` - Users

---

## 💡 Developer Guide

### **Using Navigation**

#### Option 1: Use Compatibility Layer
```jsx
import { useNavigate, Link, useParams } from '@/lib/navigation';

function MyComponent() {
  const navigate = useNavigate();
  const params = useParams();
  
  return <Link href="/products">Products</Link>;
}
```

#### Option 2: Use Next.js Directly
```jsx
'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

function MyComponent() {
  const router = useRouter();
  
  return <Link href="/products">Products</Link>;
}
```

### **Client vs Server Components**

#### Use `'use client'` for:
- Components with `useState`, `useEffect`
- Event handlers (`onClick`, etc.)
- Browser APIs (`window`, `localStorage`)
- Context providers/consumers

```jsx
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

#### Server Components (default):
- Static content
- Data fetching
- No interactivity needed

### **Dynamic Routes**

Pages receive `params` as props:

```jsx
// app/product_details/[id]/page.jsx
export default function ProductPage({ params }) {
  const { id } = params;
  return <div>Product {id}</div>;
}
```

### **Environment Variables**

Create `.env.local` for client-side variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_KEY=your_key
```

Access in code:
```jsx
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
```

---

## 🔧 Common Tasks

### **Adding a New Page**

1. Create file: `src/app/mypage/page.jsx`
2. Export component:
```jsx
'use client'; // if interactive

export default function MyPage() {
  return <div>My Page</div>;
}
```
3. Navigate: `<Link href="/mypage">My Page</Link>`

### **Adding Metadata (SEO)**

```jsx
// app/mypage/page.jsx
export const metadata = {
  title: 'My Page - Alidaad',
  description: 'Page description',
};

export default function MyPage() {
  return <div>Content</div>;
}
```

### **Protecting Routes**

```jsx
'use client';

import PrivateRoute from '@/Routes/PrivateRoute';

export default function ProtectedPage() {
  return (
    <PrivateRoute>
      <YourComponent />
    </PrivateRoute>
  );
}
```

---

## ⚠️ Important Notes

### **Things to Update in Your Components**

1. **React Router imports** → Update to Next.js or use compatibility layer
2. **`<a>` tags inside Link** → Remove them
3. **`useNavigate()`** → Works via compatibility layer or use `useRouter()`
4. **`useLocation()`** → Use `usePathname()` or compatibility layer
5. **Client-side code** → Add `'use client'` directive

### **Known Issues & Solutions**

#### Issue: "Error: useSearchParams() should be wrapped in a suspense boundary"
**Solution:** Wrap component in `<Suspense>`:
```jsx
import { Suspense } from 'react';

<Suspense fallback={<div>Loading...</div>}>
  <ComponentUsingSearchParams />
</Suspense>
```

#### Issue: "Can't use useState"
**Solution:** Add `'use client'` at top of file.

#### Issue: Hydration mismatch
**Solution:** Use `useEffect` for client-only code:
```jsx
'use client';

import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <div>Client-only content</div>;
}
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Migration from Vite](https://nextjs.org/docs/app/building-your-application/upgrading/from-vite)
- [Full Migration Guide](./NEXTJS_MIGRATION_GUIDE.md)

---

## 🎉 Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run dev`
3. ✅ Test all routes and features
4. ✅ Update any remaining React Router imports
5. ✅ Add `'use client'` to interactive components as needed
6. ✅ Test authentication flows
7. ✅ Test dashboard features
8. ✅ Build for production: `npm run build`

---

## 🆘 Need Help?

Check the detailed [NEXTJS_MIGRATION_GUIDE.md](./NEXTJS_MIGRATION_GUIDE.md) for:
- Complete list of changes
- Component migration patterns
- Troubleshooting guide
- Optimization tips

---

**Migration completed on:** December 19, 2025
**Next.js Version:** 15.1.0
**React Version:** 19.1.1
