import { useRoutes } from 'react-router'
import homeRoutes from './routes/routes'

const Routes: React.FC = () => {
  const routes = useRoutes(homeRoutes)

  return routes
}

export default Routes
