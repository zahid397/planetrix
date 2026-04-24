import { LayoutGrid } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardButton() {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav('/dashboard')}
      aria-label="Open dashboard"
      className="dashboard-fab hidden md:flex"
    >
      <LayoutGrid className="w-[18px] h-[18px]" strokeWidth={2.2} />
    </button>
  );
}
