import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../Components/dashboard/DashboardSidebar';


export default function DashboardLayout() {
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', height: '100vh', background: 'white' }}>
      <DashboardSidebar />
      <div style={{ flex: 1, paddingLeft: '15px', paddingTop: '5px', paddingRight: '15px', overflowY: 'auto' }}>
        <Outlet />
      </div>
    </div>
  );
}