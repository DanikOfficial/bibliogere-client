import { Outlet } from 'react-router'
import Sidebar from './Sidebar'

const Dashboard: React.FC = () => (
  <section id="app" className="row mx-0 border-2 h-100">
    <Sidebar />
    <section className="col pt-2 px-1 px-lg-3 vh-100 overflow-auto">
      <Outlet />
    </section>
  </section>
)

export default Dashboard
