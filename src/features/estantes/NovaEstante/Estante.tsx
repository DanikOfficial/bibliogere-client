import { Estante } from '../EstanteInterfaces'

const Estante: React.FC<Estante> = ({ codigo, nome, tipoEstante }) => {
  return (
    <>
      <div id="estante-1" className="bg-white p-2 custom-radius card-shadow mb-3">
        <p className="mb-1">
          <span className="text-primary fw-bold me-1">Nome:</span>
          <span className="span text-secondary">{nome}</span>
        </p>
        <p className="mb-1">
          <span className="text-primary fw-bold me-1">Tipo de Estante:</span>
          <span className="span text-secondary">{tipoEstante}</span>
        </p>

        <div id="actions" className="d-flex flex-wrap mb-2">
          <button
            className="
          btn
          shadow-none
          btn-primary
          custom-btn
          d-flex
          align-items-center
          me-3
        "
          >
            <span className="me-1">Alterar</span>
            <i className="bi bi-pencil text-light"></i>
          </button>
          <button
            className="
          btn
          shadow-none
          btn-danger
          text-light
          custom-btn
          d-flex
          align-items-center
          me-3
        "
          >
            <span className="me-1">Apagar</span>
            <i className="bi bi-trash text-light"></i>
          </button>
        </div>
      </div>
    </>
  )
}
