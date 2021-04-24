import useSWR from 'swr'

import {EmptyState} from '@/components/empty-state'
import {SiteTableSkeleton} from '@/components/site-table-skeleton'
import {DashboardShell} from '@/components/dashboard-shell'
import {SiteTable} from '@/components/site-table'
import {SiteTableHeader} from '@/components/site-table-header'

import {useAuth} from '@/lib/auth'
import {fetcher} from '@/utils/fetcher'

function Dashboard() {
  const {user} = useAuth()

  const {data} = useSWR(user ? ['/api/sites', user.token] : null, fetcher)

  if (!data) {
    return (
      <DashboardShell>
        <SiteTableHeader />
        <SiteTableSkeleton />
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <SiteTableHeader />
      {data.sites.length ? <SiteTable sites={data.sites} /> : <EmptyState />}
    </DashboardShell>
  )
}

export default Dashboard