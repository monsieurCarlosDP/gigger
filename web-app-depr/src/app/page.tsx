'use client';
import DashboardLayout from "@/components/layout/dashboard-layout/DashboardLayout";
import { useDashboard } from "@/hooks/dashboard/dashboard";



export default function Home() {

  const {
    isLoadingDashboard,
    dashboardData,
  } = useDashboard();

  const { songs, setlists, events, eventList } = dashboardData ?? {}

  return (
    <div>
      {isLoadingDashboard && <h1>Loading</h1>}
      {!isLoadingDashboard && <DashboardLayout songs={songs} setlists={setlists} events={events} eventList={eventList}/>}
    </div>
  );
}
