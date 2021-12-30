import Hero from './components/hero/Hero'
import { BrowserRouter as Router } from 'react-router-dom'
import CustomRoutes from './utils/Routes'

export const App = () => {
  return (
    <main className="container-fluid px-0 vh-100 bg-light">
      <Router>
        <CustomRoutes />
      </Router>
    </main>
  )
}

export default App
