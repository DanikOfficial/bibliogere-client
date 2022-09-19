import Dashboard from '../../components/dashboard/Dashboard'
import Login from '../../features/user/login/Login'
import ProtectedRoutes from '../ProtectedRoutes'
import type { RouteObject } from 'react-router-dom'
import Hero from '../../components/hero/Hero'
import Obras from '../../features/obra/Obras'

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Hero />,
    children: [{ path: '/', element: <Login /> }],
  },
  {
    element: <ProtectedRoutes />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
        children: [
          {
            path: 'obras',
            element: <Obras />,
          },
        ],
      },
    ],
  },
]

export default routes
