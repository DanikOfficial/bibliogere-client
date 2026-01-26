import Dashboard from '../../components/dashboard/Dashboard'
import Login from '../../features/user/login/Login'
import ProtectedRoutes from '../ProtectedRoutes'
import type { RouteObject } from 'react-router-dom'
import Hero from '../../components/hero/Hero'
import Obras from '../../features/obra/Obras'
import Estantes from '../../features/estantes/Estantes'
import EmprestimosView from '../../features/emprestimo/EmprestimosView'
import CreateEmprestimo from '../../features/emprestimo/CreateEmprestimo'
import EmprestimosEntrypoint from '../../features/emprestimo/EmprestimosEntrypoint'
import EmprestimoView from '../../features/emprestimo/EmprestimoView'
import Unauthorized from '../../components/Unauthenticated'
import GerarRelatoriosView from '../../features/relatorios/RelatoriosView'
import RelatorioEmprestimoView from '../../features/relatorios/emprestimos/RelatorioEmprestimoView'
import RelatorioObrasView from '../../features/relatorios/obras/RelatorioObrasView'
import DefinicoesView from '../../features/definicoes/DefinicoesView'
import UtilizadoresView from '../../features/user/management/UtilizadoresView'
import RecoverUserWrapper from '../../features/user/recovery/RecoveryUserWrapper'
import ActivateUserWrapper from '../../features/user/activation/ActivateUserWrapper'
import UsernameStep from '../../features/user/recovery/UsernameStep'
import ValidateQuestoes from '@/features/user/common/ValidateQuestoes'
import CreatePassword from '@/features/user/common/CreatePassword'
import CreateQuestoes from '@/features/user/common/CreateQuestoes'

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
            path: 'utilizadores',
            element: <UtilizadoresView />
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
                path: ':codigo',
                element: <EmprestimoView />,
              },
            ],
          },
          {
            path: 'relatorios',
            element: <GerarRelatoriosView />,
          },
          {
            path: 'relatorios/emprestimos',
            element: <RelatorioEmprestimoView />,
          },
          {
            path: 'relatorios/obras',
            element: <RelatorioObrasView />,
          },
          {
            path: 'definicoes',
            element: <DefinicoesView />
          }
        ],
      },
    ],
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: 'recovery',
    element: <RecoverUserWrapper />,
    children: [
      { path: 'validar-utilizador', element: <UsernameStep /> },
      { path: 'validar-questoes', element: <ValidateQuestoes /> },
      { path: 'criar-senha', element: <CreatePassword /> }
    ],
  },
  {
    path: 'activate',
    element: <ActivateUserWrapper />,
    children: [
      { path: 'criar-questoes', element: <CreateQuestoes /> },
      { path: 'criar-senha', element: <CreatePassword /> }
    ]
  },
]

export default routes