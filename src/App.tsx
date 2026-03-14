import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import BlogFeed from './pages/BlogFeed';
import BlogPost from './pages/BlogPost';

// Lazy load the heavy admin routes that require React Quill
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Simple loading fallback
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--c-navy)', fontWeight: 600 }}>Loading...</div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/blog" element={<BlogFeed />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Lazy loaded routes wrapped in Suspense */}
        <Route path="/admin" element={
          <Suspense fallback={<PageLoader />}>
            <LoginPage />
          </Suspense>
        } />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          } />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
