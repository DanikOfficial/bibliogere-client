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
  const { codigo, titulo, autor, tipoObra } = obra
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

  const onClickDetalhes = () => setIsExpanded((prev) => !prev)

  const adicionarObra = () => {
    onClickAdicionarObra &&
      onClickAdicionarObra(
        obra,
        (isSuccess) => isSuccess && setIsSelected(isSuccess)
      )
  }

  const removerObra = () => {
    setIsSelected(false)
    onClickRemoverObra && onClickRemoverObra(codigo)
  }

  return (
    <>
      <div
        id={`obra-${codigo}`}
        className={`card border-0 shadow-sm mb-3 obra-card ${isSelected && !fromCart ? 'obra-card-selected' : ''
          }`}
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: !isBeingManaged ? 'pointer' : 'default'
        }}
        onClick={() => {
          if (!isBeingManaged) {
            !isSelected
              ? onClickAdicionarObra && adicionarObra()
              : onClickRemoverObra && removerObra()
          }
        }}
      >
        {/* Card Header with gradient */}
        <div
          className="card-header border-0 py-2 px-3"
          style={{
            background: isSelected && !fromCart
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center flex-grow-1">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle me-2"
                style={{
                  width: '32px',
                  height: '32px',
                  background: isSelected && !fromCart ? 'white' : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                }}
              >
                <i
                  className="bi bi-book-fill"
                  style={{
                    color: isSelected && !fromCart ? '#10b981' : 'white',
                    fontSize: '0.9rem'
                  }}
                ></i>
              </div>
              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h6
                    className="mb-0 fw-bold"
                    style={{
                      color: isSelected && !fromCart ? 'white' : '#1f2937',
                      fontSize: '0.95rem'
                    }}
                  >
                    {titulo}
                  </h6>
                  {tipoObra && (
                    <span
                      className="badge"
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.25rem 0.5rem',
                        background: isSelected && !fromCart
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'rgba(37, 99, 235, 0.1)',
                        color: isSelected && !fromCart ? 'white' : '#2563eb',
                        fontWeight: '600'
                      }}
                    >
                      {tipoObra}
                    </span>
                  )}
                </div>
                <small
                  style={{
                    fontSize: '0.75rem',
                    color: isSelected && !fromCart ? 'rgba(255, 255, 255, 0.9)' : '#6b7280'
                  }}
                >
                  por {autor}
                </small>
              </div>
            </div>
            {isSelected && !fromCart && (
              <div
                className="d-flex align-items-center justify-content-center rounded-circle ms-2"
                style={{
                  width: '28px',
                  height: '28px',
                  flexShrink: 0,
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <i className="bi bi-check-lg text-white fw-bold"></i>
              </div>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3">
          {!isBeingManaged || (isBeingManaged && isExpanded) ? (
            <Details {...obra} fromCart={fromCart} />
          ) : null}

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
            {isBeingManaged ? (
              <>
                <button
                  className="btn btn-sm btn-primary d-flex align-items-center shadow-sm obra-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickAlterarObra && onClickAlterarObra(obra)
                  }}
                  style={{ borderRadius: '6px', fontSize: '0.875rem' }}
                >
                  <i className="bi bi-pencil-square me-1"></i>
                  <span>Alterar</span>
                </button>
                <button
                  className="btn btn-sm btn-danger d-flex align-items-center shadow-sm obra-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickApagarObra && onClickApagarObra(obra)
                  }}
                  style={{ borderRadius: '6px', fontSize: '0.875rem' }}
                >
                  <i className="bi bi-trash me-1"></i>
                  <span>Apagar</span>
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center obra-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    onClickDetalhes()
                  }}
                  style={{ borderRadius: '6px', fontSize: '0.875rem' }}
                >
                  <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'} me-1`}></i>
                  <span>{isExpanded ? 'Ocultar' : 'Detalhes'}</span>
                </button>
              </>
            ) : !isSelected ? (
              <button
                className="btn btn-sm btn-primary d-flex align-items-center shadow-sm obra-btn flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickAdicionarObra && adicionarObra()
                }}
                style={{ borderRadius: '6px', fontSize: '0.875rem' }}
              >
                <i className="bi bi-plus-circle me-1"></i>
                <span>Adicionar ao Carrinho</span>
              </button>
            ) : (
              <button
                className="btn btn-sm btn-danger d-flex align-items-center shadow-sm obra-btn flex-grow-1"
                onClick={(e) => {
                  e.stopPropagation()
                  onClickRemoverObra && removerObra()
                }}
                style={{ borderRadius: '6px', fontSize: '0.875rem' }}
              >
                <i className="bi bi-x-circle me-1"></i>
                <span>Remover do Carrinho</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .obra-card {
          position: relative;
        }

        .obra-card:hover:not(.obra-card-selected) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
        }

        .obra-card-selected {
          border: 2px solid #10b981 !important;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2) !important;
        }

        .obra-card-selected:hover {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3) !important;
        }

        .obra-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .obra-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  )
}

interface DetailsProps extends ObraEntity {
  fromCart?: boolean
}

let Details: React.FC<DetailsProps> = (props) => {
  const { ano, nomeEstante, localizacaoDesignacao, quantidadeAtual, quantidadeInicial, fromCart } = props

  // Decrement quantidade atual by 1 when in cart for better UX
  const displayQuantidadeAtual = fromCart ? Math.max(0, quantidadeAtual - 1) : quantidadeAtual

  return (
    <div id="extra-info" className="mb-2">
      <div className="mb-3">
        {getType(props)}
      </div>

      <div className="row g-2 g-md-3">
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
          <div className="d-flex align-items-start">
            <i className="bi bi-calendar-event text-primary me-2 mt-1" style={{ fontSize: '1rem' }}></i>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-muted small mb-1" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Ano</div>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{ano}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-8 col-md-4 col-lg-3">
          <div className="d-flex align-items-start">
            <i className="bi bi-bookshelf text-primary me-2 mt-1" style={{ fontSize: '1rem' }}></i>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-muted small mb-1" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Estante</div>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>{nomeEstante}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-12 col-md-5 col-lg-3">
          <div className="d-flex align-items-start">
            <i className="bi bi-geo-alt-fill text-primary me-2 mt-1" style={{ fontSize: '1rem' }}></i>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-muted small mb-1" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Localização</div>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem', wordBreak: 'break-word' }}>{localizacaoDesignacao}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-2">
          <div className="d-flex align-items-start">
            <i className="bi bi-stack text-primary me-2 mt-1" style={{ fontSize: '1rem' }}></i>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-muted small mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Qtd. Atual</div>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{displayQuantidadeAtual}</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-sm-6 col-md-6 col-lg-2">
          <div className="d-flex align-items-start">
            <i className="bi bi-boxes text-primary me-2 mt-1" style={{ fontSize: '1rem' }}></i>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div className="text-muted small mb-1 text-truncate" style={{ fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Qtd. Inicial</div>
              <div className="fw-semibold text-dark" style={{ fontSize: '0.9rem' }}>{quantidadeInicial}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Details = memo(Details)

Obra = memo(Obra)

export default Obra
