import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatsCard } from '@/components/ui/stats-card';
import { useTenantAdminStats } from '@/hooks/useTenantAdminStats';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useTenantAdminStats(user?.tenantId);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Schools"
        value={stats?.schoolCount || 0}
        description="Number of schools in the tenant"
        trend="up"
        trendValue={12}
      />
      <StatsCard
        title="Total Teachers"
        value={stats?.teacherCount || 0}
        description="Number of teachers in the tenant"
        trend="down"
        trendValue={5}
      />
      <StatsCard
        title="Total Students"
        value={stats?.studentCount || 0}
        description="Number of students in the tenant"
        trend="up"
        trendValue={15}
      />
      <StatsCard
        title="Total Classes"
        value={stats?.sectionCount || 0}
        description="Classes across all schools"
        trend="up"
        trendValue={10}
      />
    </div>
  );
};

export default AdminDashboard;
