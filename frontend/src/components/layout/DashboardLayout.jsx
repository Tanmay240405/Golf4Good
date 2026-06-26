import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col relative">
      {/* Background Image / Overlay for the whole dashboard to match theme */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none" 
        style={{ backgroundImage: 'url(/golf_course_bg.png)' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[rgba(5,10,15,0.95)] via-[rgba(5,10,15,0.7)] to-transparent pointer-events-none" />

      {/* Navbar from Homescreen */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10 pt-24 md:pt-32">
        {/* Page Content */}
        <main className="flex-1 w-full px-8 md:px-16 lg:px-24 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
