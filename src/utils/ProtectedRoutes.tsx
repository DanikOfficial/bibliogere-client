import { useAppSelector } from '../app/hooks'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { isLoggedIn, selectRole } from '../features/user/userSlice'
import Unauthorized from '../components/Unauthenticated'
import { linksArr } from './links'

const ProtectedRoutes: React.FC = () => {
  const logged = useAppSelector(isLoggedIn)
  const role = useAppSelector(selectRole)
  const location = useLocation()

  // Get the current path
  const currentPath = location.pathname.replace('/dashboard/', '')

  // Get allowed routes for the user
  const allowedRoutes = linksArr.filter((link) =>
    link.roles.includes(role.nome)
  )

  let isAuthorized = allowedRoutes.some((link) => link.path === currentPath)

  // Regex for matching paths like /emprestions/{number}
  const regex = /^emprestimos\/\d+$/

  // Check if the path matches the emprestions/{number} pattern
  if (!isAuthorized && regex.test(currentPath)) {
    isAuthorized = true
  }

  if (!logged) {
    return <Unauthorized /> // Redirect unauthenticated users
  }

  if (!isAuthorized) {
    return <Navigate to="/unauthorized" replace /> // Redirect unauthorized users
  }

  return <Outlet />
}

export default ProtectedRoutes
