import { BrowserRouter as Router } from 'react-router-dom'
import CustomRoutes from './utils/Routes'
import { Toaster } from 'react-hot-toast'

export const App = () => {
  return (
    <main className="container-fluid px-0 vh-100 bg-light">
      <Toaster />
      <Router>
        <CustomRoutes />
      </Router>
    </main>
  )
}

export default App
