import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
