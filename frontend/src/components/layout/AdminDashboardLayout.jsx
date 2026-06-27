import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function AdminDashboardLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary mt-4 font-medium animate-pulse">Loading Admin...</p>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-bg-primary font-sans text-text-primary overflow-hidden w-full max-w-[100vw]">
      <AdminSidebar />
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar relative">
        {/* Golf Background with Overlay to match theme */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none" 
          style={{ backgroundImage: 'url(/golf_course_bg.png)' }}
        />
        {/* Exact matching Gradient Overlay from main dashboard */}
        <div className="fixed inset-0 z-0 bg-gradient-to-r from-[rgba(5,10,15,0.95)] via-[rgba(5,10,15,0.7)] to-transparent pointer-events-none" />
        
        <div className="relative z-10 p-6 md:p-10 min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
