import { FC, memo, useState } from 'react'
import { ObraEntity } from './data/ObraInterfaces'
import { getType } from './tipo/TypeChooser'

export interface ObraComponentProps {
  obra: ObraEntity
  isBeingManaged: boolean
  onClickAlterarObra: (obra: ObraEntity) => void
  onClickApagarObra: ({ codigo }: ObraEntity) => void
  onClickAdicionarObra: (obra: ObraEntity) => void
}

let Obra: FC<ObraComponentProps> = ({
  obra,
  onClickAlterarObra,
  onClickApagarObra,
  onClickAdicionarObra,
  isBeingManaged,
}) => {
  const { titulo, autor } = obra
  const [isExpanded, setIsExpanded] = useState<boolean>(false)

  const onClickDetalhes = () => setIsExpanded((prev) => !prev)

  return (
    <div id="obra-1" className="bg-white p-2 custom-radius card-shadow mb-3">
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Titulo:</span>
        <span className="span text-secondary">{titulo}</span>
      </p>
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Autor:</span>
        <span className="span text-secondary">{autor}</span>
      </p>
      {!isBeingManaged || (isBeingManaged && isExpanded) ? (
        <Details {...obra} />
      ) : null}

      <div id="actions" className="d-flex flex-wrap mb-2">
        {isBeingManaged ? (
          <>
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
              onClick={() => onClickAlterarObra(obra)}
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
              onClick={() => onClickApagarObra(obra)}
            >
              <span className="me-1">Apagar</span>
              <i className="bi bi-trash text-light"></i>
            </button>
          </>
        ) : (
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
            onClick={() => onClickAdicionarObra(obra)}
          >
            <span className="me-1">Adicionar</span>
            <i className="bi bi-pencil text-light"></i>
          </button>
        )}
        <button
          className="
btn
shadow-none
btn-secondary
text-light
custom-btn
d-flex
align-items-center
me-3
"
          onClick={onClickDetalhes}
        >
          <span className="me-1">Detalhes</span>
          <i className="bi bi-info-circle text-light"></i>
        </button>
      </div>
    </div>
  )
}

let Details: React.FC<ObraEntity> = (obra) => {
  const { ano, nomeEstante, localizacaoDesignacao } = obra

  return (
    <div id="extra-info" className="d-block">
      {getType(obra)}

      <div id="" className="row">
        <div className="col-sm-1">
          <p>
            <span className="text-primary fw-bold me-1">Ano:</span>
            <span className="span text-secondary">{ano}</span>
          </p>
        </div>
        <div className="col-md-4">
          <p>
            <span className="text-primary fw-bold me-1">Localização:</span>
            <span className="span text-secondary">{localizacaoDesignacao}</span>
          </p>
        </div>
        <div className="col-lg-5">
          <p>
            <span className="text-primary fw-bold me-1">Estante:</span>
            <span className="span text-secondary">{nomeEstante}</span>
          </p>
        </div>
      </div>
    </div>
  )
}

Details = memo(Details)

Obra = memo(Obra)

export default Obra
