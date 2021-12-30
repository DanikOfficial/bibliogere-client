import { Navigate } from 'react-router-dom'
import { isLoggedIn } from '../features/user/userSlice'
import { useAppSelector } from '../app/hooks'
import { Outlet } from 'react-router-dom'

const ProtectedRoutes: React.FC = () => {
  // const logged = useAppSelector(isLoggedIn)
  //Testing only
  const logged = true

  return logged ? <Outlet /> : <Navigate to="/user/login" />
}

export default ProtectedRoutes
