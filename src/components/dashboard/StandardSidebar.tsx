import { Link } from 'react-router-dom'
import type { link } from '../../utils/links'

export interface SidebarProps {
  currentUser: string
  linksArr: link[]
  signOut: React.MouseEventHandler<HTMLAnchorElement>
}

const StandardSidebar: React.FC<SidebarProps> = ({
  currentUser,
  linksArr,
  signOut,
}) => {
  const links = linksArr.map((link) => {
    const { key, path, name, icon } = link

    return (
      <li key={key} className="navigation-link mb-2">
        <Link to={path} className="text-light text-decoration-none">
          <i className={icon}></i>
          {name}
        </Link>
      </li>
    )
  })

  return (
    <aside
      className="
        col-2
        sidebar
        custom-shadow-y
        text-light
        custom-radius
        bg-primary
        my-3
        ms-3
        ps-2
        py-3
        d-xl-flex d-none
        flex-column
      "
    >
      <div className="app-info text-center mb-1">
        <h1 className="h3 fw-normal mb-3">BiblioGere</h1>
        <i className="bi display-4 d-block mb-2 bi-person-circle"></i>
        <h2 className="h5 fw-normal">Oi, {currentUser}!</h2>
      </div>

      <div className="navigation mt-5">
        <ul className="navigation-links ms-2 list-unstyled text-light">
          {links}
        </ul>
      </div>
      <div className="text-light mt-auto text-center">
        <Link
          className="text-light fs-6 text-decoration-none"
          to="/"
          onClick={signOut}
        >
          <i className="bi bi-power me-1"></i>Terminar Sessão
        </Link>
      </div>
    </aside>
  )
}

export default StandardSidebar
