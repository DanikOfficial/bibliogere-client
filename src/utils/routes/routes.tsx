import Dashboard from '../../components/dashboard/Dashboard'
import Login from '../../features/user/login/Login'
import ProtectedRoutes from '../ProtectedRoutes'
import type { RouteObject } from 'react-router-dom'
import Hero from '../../components/hero/Hero'
import Obras from '../../features/obra/Obras'
import Estantes from '../../features/estantes/Estantes'
import { EmprestimosView } from '../../features/emprestimo/EmprestimosView'
import CreateEmprestimo from '../../features/emprestimo/CreateEmprestimo'
import EmprestimosEntrypoint from '../../features/emprestimo/EmprestimosEntrypoint'
import EmprestimoView from '../../features/emprestimo/EmprestimoView'
import Unauthorized from '../../components/Unauthenticated'
import RelatoriosView from '../../features/relatorios/RelatoriosView'

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
          {
            path: 'estantes',
            element: <Estantes />,
          },
          {
            path: 'emprestimos',
            element: <EmprestimosEntrypoint />,
            children: [
              {
                path: 'create',
                element: <CreateEmprestimo />,
              },
              {
                path: 'list',
                element: <EmprestimosView />,
              },
              {
                path: ':codigo', // Dynamic route for EmprestimoView
                element: <EmprestimoView />, // This is the component that will be rendered
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
]

export default routes
