import { memo, FC } from 'react'
import { EstanteEntity } from './data/EstanteInterfaces'

export interface EstanteComponentProps {
  estante: EstanteEntity
  onAlterarEstante: (estante: EstanteEntity) => void
  onApagarEstante: ({ codigo }: EstanteEntity) => void
}

let Estante: FC<EstanteComponentProps> = (Props) => {
  const { estante, onAlterarEstante, onApagarEstante } = Props
  const { nome, tipoEstante, codigo } = estante

  return (
    <>
      <div
        id={`estante-${codigo}`}
        className="card border-0 shadow-sm mb-3 estante-card"
        style={{
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
      >
        {/* Card Header with gradient */}
        <div
          className="card-header border-0 py-2 px-3"
          style={{
            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
          }}
        >
          <div className="d-flex align-items-center">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle me-2"
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
              }}
            >
              <i
                className="bi bi-bookshelf"
                style={{
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              ></i>
            </div>
            <div>
              <h6
                className="mb-0 fw-bold"
                style={{
                  color: '#1f2937',
                  fontSize: '0.95rem'
                }}
              >
                {nome}
              </h6>
              <small
                style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}
              >
                {tipoEstante}
              </small>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3">
          <div className="row g-3 mb-2">
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-tag-fill text-primary me-2 mt-1" style={{ fontSize: '1.1rem' }}></i>
                <div>
                  <div className="text-muted small mb-1" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Nome</div>
                  <div className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>{nome}</div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-start">
                <i className="bi bi-collection-fill text-primary me-2 mt-1" style={{ fontSize: '1.1rem' }}></i>
                <div>
                  <div className="text-muted small mb-1" style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tipo</div>
                  <div className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>{tipoEstante}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap gap-2 mt-3 pt-2 border-top">
            <button
              className="btn btn-sm btn-primary d-flex align-items-center shadow-sm estante-btn"
              onClick={(e) => {
                e.stopPropagation()
                onAlterarEstante(estante)
              }}
              style={{ borderRadius: '6px', fontSize: '0.875rem' }}
            >
              <i className="bi bi-pencil-square me-1"></i>
              <span>Alterar</span>
            </button>
            <button
              className="btn btn-sm btn-danger d-flex align-items-center shadow-sm estante-btn"
              onClick={(e) => {
                e.stopPropagation()
                onApagarEstante(estante)
              }}
              style={{ borderRadius: '6px', fontSize: '0.875rem' }}
            >
              <i className="bi bi-trash me-1"></i>
              <span>Apagar</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .estante-card {
          position: relative;
        }

        .estante-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
        }

        .estante-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }

        .estante-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </>
  )
}

Estante = memo(Estante)

export default Estante
