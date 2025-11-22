import DashboardHeader from './DashboardHeader';
import SummaryCards from './SummaryCards';
import IncomeVsExpenseChart from './IncomeVsExpenseChart';
import ExpenseBreakdownChart from './ExpenseBreakdownChart';
import RecentTransactions from './RecentTransactions';
import { Divider } from "@react-md/divider";
import { useState } from 'react';

export default function DashboardHome() {
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <DashboardHeader onSuccess={() => setRefresh((prev) => !prev)} />
      <Divider aria-orientation='vertical' className='h-0.5 bg-gray-400 border-gray-400 my-4 rounded-full mx-1'/>
      <SummaryCards refresh={refresh} />
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px', marginTop: '20px' }}>
        <IncomeVsExpenseChart refresh={refresh} />
        <ExpenseBreakdownChart refresh={refresh} />
      </div>
      <RecentTransactions refresh={refresh} />
    </>
  );
}