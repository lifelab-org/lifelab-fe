import { Home, Calendar, FolderMinus as Archive } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {

  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: Home, },
    { path: '/calendar', label: '캘린더', icon: Calendar },
    { path: '/archive', label: '아카이브', icon: Archive },
  ];

  return (
    <nav className="absolute bottom-0 w-full h-[80px] bg-white border-t border-gray-100 flex justify-between px-10 items-center pb-4 pt-3 rounded-t-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path; 
        
        return (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${
              isActive ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={36} strokeWidth={isActive ? 2 : 1} />
            <span className="text-[11px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}