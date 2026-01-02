import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
console.log(
  "%c Developed by Kaiser ",
  "background: linear-gradient(to right, #ff7eb3, #65c7f7); color:white; padding:4px 12px; border-radius:9999px; font-size:14px; font-weight:600;",
);


// tanstack query
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
// Create a client
const queryClient = new QueryClient();


import {
  RouterProvider,
} from "react-router-dom";
import router from './Routes/Routes';
import AuthProvider from './Providers/AuthProvider';
import { NotificationProvider } from './Providers/NotificationProvider';
import { Toaster } from 'react-hot-toast';
import { createHead, UnheadProvider } from '@unhead/react/client';
import useAuth from './Hooks/Auth/useAuth';
const head = createHead();

// Wrapper component to access user from AuthContext
function AppWithNotifications() {
  const { user } = useAuth();
  return (
    <NotificationProvider user={user}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}

console.log("test");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UnheadProvider head={head}>
        <QueryClientProvider client={queryClient}>
          <AppWithNotifications />
        </QueryClientProvider>
      </UnheadProvider>
    </AuthProvider>
  </StrictMode >,
);
