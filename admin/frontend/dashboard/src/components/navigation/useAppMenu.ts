import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useColorScheme } from 'frappe-ui'

import { authApi } from '@/api/auth'
import { useSession } from '@/composables/auth/useSession'

const THINKNXG_PILOT_DOCS_URL = 'https://docs.thinknxg.com/thinknxgpilot'
const THINKNXG_SUPPORT_URL = 'https://thinknxg.com/thinkdesk'

// dialogs
const showBenches = ref(false)
const showNewBench = ref(false)

// shared by mobile settings page & desktop sidebar
export const useAppMenu = () => {
  const router = useRouter()
  const { setColorScheme } = useColorScheme()
  const { session, centralServerUrl } = useSession()

  const logout = async () => {
    await authApi.logout()
    window.location.reload()
  }

  const menuItems = computed(() => [
    ...(session.centralUrl
      ? [
          {
            label: 'Central',
            icon: 'lucide-cloud',
            onClick: () => window.open(centralServerUrl(), '_blank', 'noopener'),
          },
        ]
      : []),
    {
      label: 'Settings',
      icon: 'lucide-settings',
      onClick: () => router.push({ name: 'Settings' }),
    },
    {
      label: 'Activity',
      icon: 'lucide-history',
      onClick: () => router.push({ name: 'Activity' }),
    },

    // Managing other benches is gated server-wide by admin.allow_bench_management.
    ...(session.allowBenchManagement
      ? [
          {
            label: 'Switch Bench',
            icon: 'lucide-repeat',
            onClick: () => (showBenches.value = true),
          },
        ]
      : []),
    {
      label: 'Theme',
      icon: 'lucide-sun-moon',
      submenu: [
        { label: 'Light', icon: 'lucide-sun', onClick: () => setColorScheme('light') },
        { label: 'Dark', icon: 'lucide-moon', onClick: () => setColorScheme('dark') },
        { label: 'System', icon: 'lucide-monitor', onClick: () => setColorScheme('system') },
      ],
    },
    {
      label: 'Documentation',
      icon: 'lucide-book-open',
      onClick: () => window.open(THINKNXG_PILOT_DOCS_URL, '_blank', 'noopener'),
    },
    {
      label: 'Support',
      icon: 'lucide-life-buoy',
      onClick: () => window.open(THINKNXG_SUPPORT_URL, '_blank', 'noopener'),
    },
    { label: 'Logout', icon: 'lucide-log-out', onClick: logout },
  ])

  return { menuItems, showBenches, showNewBench, logout, session }
}
