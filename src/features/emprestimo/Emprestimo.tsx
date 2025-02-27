import { FC, memo } from 'react'
import { EmprestimoComponentProps } from './data/EmprestimoInterfaces'

let Emprestimo: FC<EmprestimoComponentProps> = ({
  emprestimo,
  onClickVisualizar,
}) => {
  const { codigo, utente, contacto, email } = emprestimo

  return (
    <div onClick={() => onClickVisualizar(codigo)} className="col-lg- col-md-3 bg-white p-3 custom-radius card-shadow mb-3 me-5">
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Utente:</span>
        <span className="text-secondary">{utente}</span>
      </p>
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Contacto:</span>
        <span className="text-secondary">{contacto}</span>
      </p>
      <p className="mb-3">
        <span className="text-primary fw-bold me-1">Email:</span>
        <span className="text-secondary">{email}</span>
      </p>
      <div id="actions" className="d-flex flex-wrap mb-2">
        <button
          className="btn shadow-none btn-primary custom-btn d-flex align-items-center me-3"
          onClick={() => onClickVisualizar(codigo)}
        >
          <span className="me-1">Visualizar</span>
        </button>
      </div>
    </div>
  )
}

Emprestimo = memo(Emprestimo)

export default Emprestimo
