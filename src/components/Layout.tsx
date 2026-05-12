import type { ReactNode } from 'react';
import  Sidebar  from './Sidebar';
import  Navbar  from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <Navbar />
      <main className="ml-72 pt-20">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
