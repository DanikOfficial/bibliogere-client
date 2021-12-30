import { Link } from 'react-router-dom'
import type { SidebarProps } from './StandardSidebar'

const ResponsiveSidebar: React.FC<SidebarProps> = ({
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
    <>
      <div
        id="responsive-nav"
        className="
            d-xl-none d-flex
            justify-content-between
            align-items-center
            sticky sticky-top
            bg-primary
          "
      >
        <div>
          <h3 className="text-white">BiblioGere</h3>
        </div>

        <div>
          <button
            className="btn text-white"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasStart"
            aria-controls="offcanvasStart"
          >
            <i className="bi bi-list fs-2 fw-bold"></i>
          </button>

          <div
            className="offcanvas offcanvas-start bg-primary"
            tabIndex={-1}
            id="offcanvasStart"
            aria-labelledby="offcanvasTopLabel"
          >
            <div className="offcanvas-header justify-content-end">
              <button
                type="button"
                className="btn shadow-none text-light d-flex align-items-center"
                data-bs-dismiss="offcanvas"
              >
                <i className="bi bi-x-lg text-light fs-3"></i>
              </button>
            </div>
            <div className="offcanvas-body d-flex flex-column">
              <div className="app-info text-center text-white mb-1">
                <h1 className="h3 fw-normal mb-3">BiblioGere</h1>
                <i className="bi display-2 d-block mb-2 bi-person-circle"></i>
                <h2 className="h5 fw-normal">Oi, {currentUser}!</h2>
              </div>
              <div className="navigation mt-5">
                <ul className="navigation-links ms-2 list-unstyled text-light">
                  {links}
                </ul>
              </div>
              <div className="text-light mt-auto text-center">
                <Link
                  to="/"
                  className="text-light fs-6 text-decoration-none"
                  onClick={signOut}
                >
                  <i className="bi bi-power me-1"></i>Terminar sessão
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResponsiveSidebar
