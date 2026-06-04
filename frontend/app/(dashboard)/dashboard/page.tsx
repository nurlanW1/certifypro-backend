import {
  WelcomeSection,
  StatsRow,
  RecentEvents,
  QuickActions,
  RecentDesigns,
} from '@/components/dashboard'
import { DashboardTrend } from '@/components/dashboard/DashboardTrend'

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <WelcomeSection />
      <StatsRow />
      <DashboardTrend />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <RecentEvents />
          <RecentDesigns />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
