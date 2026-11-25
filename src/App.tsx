import { lazy, Suspense, useEffect } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation, useNavigate } from 'react-router'
import { BooSheet } from './components/BooSheet'
import { TabBar, type Tab } from './components/TabBar'
import { Toast } from './components/Toast'
import { useApp } from './data/useApp'
import { useUi } from './data/useUi'
import { onReminderTap } from './lib/reminders'
import { applyTheme } from './lib/theme'
import { taskState } from './lib/tasks'
import { PetFolder } from './screens/PetFolder'
import { AddPet } from './screens/AddPet'
import { PetForm } from './screens/PetForm'
import { PetList } from './screens/PetList'
import { Schedule } from './screens/Schedule'
import { Settings } from './screens/Settings'
import { AddVet } from './screens/settings/AddVet'
import { AiConsent } from './screens/settings/AiConsent'
import { Privacy } from './screens/settings/Privacy'
import { Profile } from './screens/settings/Profile'
import { Share } from './screens/Share'
import { Today } from './screens/Today'
import { Vaccines } from './screens/Vaccines'
import { Welcome } from './screens/Welcome'

/** Screens without the tab bar: first launch and focused flows. */
const NO_TAB_BAR = ['/welcome', '/pets/new', '/share', '/settings/profile', '/settings/vet']

/** The tab that is open for a path, if any (Settings has none). */
function tabFor(pathname: string): Tab | undefined {
  if (pathname === '/') return 'today'
  if (pathname.startsWith('/schedule')) return 'schedule'
  if (pathname.startsWith('/pets')) return 'pets'
}

// The component check page exists only while developing (npm run dev). It is left out of the finished app.
const ComponentsPage = import.meta.env.DEV ? lazy(() => import('./dev/ComponentsPage')) : null

function Shell() {
  const { pathname } = useLocation()
  const hasPets = useApp((s) => s.pets.length > 0)
  const openBoo = useUi((s) => s.openBoo)
  // A dot on Schedule while anything is overdue
  const overdue = useApp((s) => s.tasks.some((x) => taskState(x) === 'waiting'))

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // A tapped reminder opens Schedule on its task's day
  const navigate = useNavigate()
  useEffect(() => onReminderTap((path) => navigate(path)), [navigate])

  // Welcome shows only until the first pet exists.
  let redirect: string | undefined
  if (!hasPets && pathname !== '/welcome' && pathname !== '/pets/new') redirect = '/welcome'
  if (hasPets && pathname === '/welcome') redirect = '/'

  const hideTabBar = NO_TAB_BAR.includes(pathname) || pathname.endsWith('/edit')
  // Boo's sheet and the toast stay mounted across screens, so a flow in the sheet survives navigation.
  return (
    <div className="mx-auto max-w-560">
      {redirect ? <Navigate to={redirect} replace /> : <Outlet />}
      {!redirect && !hideTabBar && <TabBar active={tabFor(pathname)} overdue={overdue} onBoo={() => openBoo()} />}
      <BooSheet />
      <Toast />
    </div>
  )
}

const router = createBrowserRouter([
  ...(ComponentsPage
    ? [
        {
          path: '/components',
          element: (
            <Suspense>
              <ComponentsPage />
            </Suspense>
          ),
        },
      ]
    : []),
  {
    element: <Shell />,
    children: [
      { path: '/welcome', element: <Welcome /> },
      { path: '/', element: <Today /> },
      { path: '/schedule', element: <Schedule /> },
      { path: '/pets', element: <PetList /> },
      { path: '/pets/new', element: <AddPet /> },
      { path: '/pets/:id', element: <PetFolder /> },
      { path: '/pets/:id/edit', element: <PetForm /> },
      { path: '/pets/:id/vaccines', element: <Vaccines /> },
      { path: '/share', element: <Share /> },
      { path: '/settings', element: <Settings /> },
      { path: '/settings/profile', element: <Profile /> },
      { path: '/settings/vet', element: <AddVet /> },
      { path: '/settings/privacy', element: <Privacy /> },
      { path: '/settings/ai', element: <AiConsent /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  const loaded = useApp((s) => s.loaded)
  const init = useApp((s) => s.init)
  const theme = useApp((s) => s.settings.theme)

  useEffect(() => {
    void init()
  }, [init])

  // Settings → Appearance
  useEffect(() => applyTheme(theme), [theme])

  if (!loaded) return null
  return <RouterProvider router={router} />
}
