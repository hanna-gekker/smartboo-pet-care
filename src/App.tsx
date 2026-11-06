import { useEffect } from 'react'
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router'
import { BooSheet } from './components/BooSheet'
import { TabBar } from './components/TabBar'
import { Toast } from './components/Toast'
import { useApp } from './data/useApp'
import { PetFolder } from './screens/PetFolder'
import { PetForm } from './screens/PetForm'
import { PetList } from './screens/PetList'
import { Schedule } from './screens/Schedule'
import { Settings } from './screens/Settings'
import { Share } from './screens/Share'
import { Today } from './screens/Today'
import { Welcome } from './screens/Welcome'

/** Screens without the tab bar: first launch and focused flows. */
const NO_TAB_BAR = ['/welcome', '/pets/new', '/share']

function Shell() {
  const { pathname } = useLocation()
  const hasPets = useApp((s) => s.pets.length > 0)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // Welcome shows only until the first pet exists.
  let redirect: string | undefined
  if (!hasPets && pathname !== '/welcome' && pathname !== '/pets/new') redirect = '/welcome'
  if (hasPets && pathname === '/welcome') redirect = '/'

  const hideTabBar = NO_TAB_BAR.includes(pathname) || pathname.endsWith('/edit')
  // Boo's sheet and the toast stay mounted across screens, so a flow in the sheet survives navigation.
  return (
    <div className="mx-auto max-w-[560px]">
      {redirect ? <Navigate to={redirect} replace /> : <Outlet />}
      {!redirect && !hideTabBar && <TabBar />}
      <BooSheet />
      <Toast />
    </div>
  )
}

const router = createBrowserRouter([
  {
    element: <Shell />,
    children: [
      { path: '/welcome', element: <Welcome /> },
      { path: '/', element: <Today /> },
      { path: '/schedule', element: <Schedule /> },
      { path: '/pets', element: <PetList /> },
      { path: '/pets/new', element: <PetForm /> },
      { path: '/pets/:id', element: <PetFolder /> },
      { path: '/pets/:id/edit', element: <PetForm /> },
      { path: '/share', element: <Share /> },
      { path: '/settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export default function App() {
  const loaded = useApp((s) => s.loaded)
  const init = useApp((s) => s.init)

  useEffect(() => {
    void init()
  }, [init])

  if (!loaded) return null
  return <RouterProvider router={router} />
}
