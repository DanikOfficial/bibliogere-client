import { Link } from 'react-router-dom'

const Unauthorized = () => {
  return (
    <div className="container text-center mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-warning" role="alert">
            <h1 className="display-4">401</h1>
            <p className="lead">Acesso negado</p>
            <p className="text-muted">
              Você precisa estar autenticado para acessar esta página.{' '}
              <Link to={'/'}>Autenticar-se</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
