
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-white shadow-xl flex flex-col relative overflow-hidden">
      <header className="px-6 pt-10 pb-6 bg-white sticky top-0 z-30 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif text-gray-900 tracking-tight">ChefAI</h1>
            <p className="text-sm text-emerald-600 font-medium">Your personal sous-chef</p>
          </div>
          <div className="h-10 w-10 bg-emerald-50 rounded-full flex items-center justify-center">
             <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
             </svg>
          </div>
        </div>
      </header>
      <main className="flex-grow pb-24">
        {children}
      </main>
    </div>
  );
};

export default Layout;
