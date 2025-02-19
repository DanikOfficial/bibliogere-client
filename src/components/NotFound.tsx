import { FC } from 'react'

interface NotFoundProps {
  message?: string
}

const NotFound: FC<NotFoundProps> = ({ message }) => {
  return (
    <div className="container text-center mt-5">
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-danger" role="alert">
            <h1 className="display-4">404</h1>
            <p className="lead">
              Desculpe, a página que você está procurando não existe.
            </p>
            {message ? (
              <p>{message}</p>
            ) : (
              <p className="text-muted">
                O código que você forneceu pode ser inválido ou não existir.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
