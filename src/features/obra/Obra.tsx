import { FC, memo, useEffect, useState } from 'react'
import { ObraEntity } from './data/ObraInterfaces'
import { getType } from './tipo/TypeChooser'

export interface ObraComponentProps {
  obra: ObraEntity
  isBeingManaged: boolean
  onClickAlterarObra?: (obra: ObraEntity) => void
  onClickApagarObra?: ({ codigo }: ObraEntity) => void
  onClickAdicionarObra?: (
    obra: ObraEntity,
    callback: (isSuccess: boolean) => void
  ) => void
  onClickRemoverObra?: (codigo: number) => void
  obras?: ObraEntity[]
  fromCart?: boolean
}

let Obra: FC<ObraComponentProps> = ({
  obra,
  onClickAlterarObra,
  onClickApagarObra,
  onClickAdicionarObra,
  isBeingManaged,
  obras,
  onClickRemoverObra,
  fromCart,
}) => {
  const { codigo, titulo, autor } = obra
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [isSelected, setIsSelected] = useState<boolean>(false)

  useEffect(() => {
    if (!fromCart) {
      setIsSelected(
        obras?.some((obraToCompare) => obraToCompare.codigo === codigo) ?? false
      )
    } else {
      setIsSelected(true)
    }
  }, [obras, codigo, fromCart])

  // obras && setIsSelected(obras!.some((obraToCompare) => obraToCompare.codigo === codigo))

  /**
   *
   * Toggles the details
   */
  const onClickDetalhes = () => setIsExpanded((prev) => !prev)

  /**
   * Adds the current obra to the cart
   *
   */
  const adicionarObra = () => {
    onClickAdicionarObra &&
      onClickAdicionarObra(
        obra,
        (isSuccess) => isSuccess && setIsSelected(isSuccess)
      )
  }

  /**
   * Removes the current obra from the cart
   */
  const removerObra = () => {
    setIsSelected(false)
    onClickRemoverObra && onClickRemoverObra(codigo)
  }

  return (
    <div
      id={`obra-${codigo}`}
      className={`bg-white p-2 custom-radius card-shadow mb-3 ${
        isSelected && !fromCart ? 'border border-success' : ''
      }`}
      onClick={() =>
        !isSelected
          ? onClickAdicionarObra && adicionarObra()
          : onClickRemoverObra && removerObra()
      }
    >
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
              onClick={() => onClickAlterarObra && onClickAlterarObra(obra)}
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
              onClick={() => {
                onClickApagarObra && onClickApagarObra(obra)
              }}
            >
              <span className="me-1">Apagar</span>
              <i className="bi bi-trash text-light"></i>
            </button>
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
          </>
        ) : !isSelected ? (
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
            onClick={() => onClickAdicionarObra && adicionarObra()}
          >
            <span className="me-1">Adicionar</span>
            <i className="bi bi-pencil text-light"></i>
          </button>
        ) : (
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
            onClick={() => {
              onClickRemoverObra && removerObra()
            }}
          >
            <span className="me-1">Remover</span>
            <i className="bi bi-trash text-light"></i>
          </button>
        )}
      </div>
    </div>
  )
}

let Details: React.FC<ObraEntity> = (obra) => {
  const { ano, nomeEstante, localizacaoDesignacao } = obra

  return (
    <div id="extra-info" className="d-block">
      {getType(obra)}

      <div id="" className="row d-flex flex-wrap">
        <div className="col-sm-auto">
          <p>
            <span className="text-primary fw-bold me-1">Ano:</span>
            <span className="span text-secondary">{ano}</span>
          </p>
        </div>
        <div className="col-md-auto">
          <p>
            <span className="text-primary fw-bold me-1">Localização:</span>
            <span className="span text-secondary">{localizacaoDesignacao}</span>
          </p>
        </div>
        <div className="col-lg-auto">
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
