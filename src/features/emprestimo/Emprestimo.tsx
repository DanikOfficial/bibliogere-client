import { FC, memo } from 'react'
import { EmprestimoComponentProps } from './data/EmprestimoInterfaces'

let Emprestimo: FC<EmprestimoComponentProps> = ({
  emprestimo,
  onClickVisualizar,
}) => {
  const { codigo, utente, contacto, email } = emprestimo

  return (
    <div
      className="col-lg-3 col-md-4 col-sm-6 mb-4"
      style={{ cursor: 'pointer' }}
    >
      <div
        className="card border-0 h-100 shadow-sm hover-card"
        style={{
          borderRadius: '12px',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
        onClick={() => onClickVisualizar(codigo)}
      >
        {/* Card Header with Gradient */}
        <div
          className="card-header border-0 text-white"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            padding: '1rem 1.25rem'
          }}
        >
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-person-circle fs-5"></i>
              <h6 className="mb-0 fw-semibold">Empréstimo</h6>
            </div>
            <span className="badge bg-white text-primary" style={{ fontSize: '0.75rem' }}>
              #{codigo}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3" style={{ background: '#ffffff' }}>
          <div className="mb-3">
            <div className="d-flex align-items-start gap-2 mb-2">
              <i className="bi bi-person text-primary mt-1" style={{ fontSize: '0.9rem' }}></i>
              <div className="flex-grow-1">
                <small className="text-muted d-block" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                  UTENTE
                </small>
                <p className="mb-0 text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                  {utente}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-start gap-2 mb-2">
              <i className="bi bi-telephone text-primary mt-1" style={{ fontSize: '0.9rem' }}></i>
              <div className="flex-grow-1">
                <small className="text-muted d-block" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                  CONTACTO
                </small>
                <p className="mb-0 text-dark fw-medium" style={{ fontSize: '0.9rem' }}>
                  {contacto}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex align-items-start gap-2">
              <i className="bi bi-envelope text-primary mt-1" style={{ fontSize: '0.9rem' }}></i>
              <div className="flex-grow-1">
                <small className="text-muted d-block" style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                  EMAIL
                </small>
                <p className="mb-0 text-dark fw-medium text-break" style={{ fontSize: '0.85rem' }}>
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div
          className="card-footer border-0 bg-light"
          style={{ padding: '0.75rem 1.25rem' }}
        >
          <button
            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              color: 'white',
              border: 'none',
              padding: '0.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation()
              onClickVisualizar(codigo)
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <i className="bi bi-eye"></i>
            <span>Visualizar Detalhes</span>
          </button>
        </div>
      </div>

      <style>{`
        .hover-card {
          transition: all 0.3s ease;
        }

        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
        }
      `}</style>
    </div>
  )
}

Emprestimo = memo(Emprestimo)

export default Emprestimo
