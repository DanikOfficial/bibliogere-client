import { useState } from 'react'
import NovaObraModal, { NovaObraModalProps } from './NovaObraModal'
import { selectAllEstantes } from '@/features/estantes/data/estanteSlice'
import { useAppSelector } from '@/app/hooks'
import toast from 'react-hot-toast'

const NovaObra: React.FC = () => {
  const [isNovaObraModalDisplayed, setIsNovaObraModalDisplayed] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const estantes = useAppSelector(selectAllEstantes)

  const showModal = () => {
    if (estantes.length === 0) {
      toast.error('Nenhuma estante encontrada. Crie uma estante primeiro.')
      return
    }
    setIsNovaObraModalDisplayed(true)
  }


  const removeModal = () => {
    setIsNovaObraModalDisplayed(false)
  }

  const novaObraModalProps: NovaObraModalProps = {
    hideModal: removeModal,
  }

  return (
    <>
      {isNovaObraModalDisplayed && <NovaObraModal {...novaObraModalProps} />}
      <div id="nova-obra-wrapper" className="mb-3">
        <button
          className="btn btn-primary nova-obra-btn d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden"
          onClick={showModal}
          disabled={isLoading}
          aria-label="Criar nova obra"
          aria-haspopup="dialog"
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '500',
            borderRadius: '12px',
            border: 'none',
            background: isLoading
              ? 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 6px rgba(37, 99, 235, 0.25)',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          <span className="btn-content d-flex align-items-center gap-2 position-relative z-1">
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span>Carregando...</span>
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle fs-5" aria-hidden="true"></i>
                <span>Nova Obra</span>
              </>
            )}
          </span>
          {!isLoading && (
            <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
          )}
        </button>
      </div>

      <style>{`
        .nova-obra-btn {
          letter-spacing: 0.3px;
        }

        .nova-obra-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(37, 99, 235, 0.35) !important;
        }

        .nova-obra-btn:not(:disabled):active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.3) !important;
        }

        .nova-obra-btn:disabled {
          opacity: 0.7;
        }

        .btn-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 50%,
            transparent 100%
          );
          transform: translateX(-100%);
          transition: transform 0.6s ease;
          pointer-events: none;
        }

        .nova-obra-btn:not(:disabled):hover .btn-shine {
          transform: translateX(100%);
        }

        .nova-obra-btn:focus-visible {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
        }

        .nova-obra-btn i {
          transition: transform 0.3s ease;
        }

        .nova-obra-btn:not(:disabled):hover i,
        .nova-obra-btn:focus-visible i {
          transform: rotate(90deg);
        }

        .z-1 {
          z-index: 1;
        }

        /* Reduce motion for users who prefer it */
        @media (prefers-reduced-motion: reduce) {
          .nova-obra-btn,
          .nova-obra-btn i,
          .btn-shine {
            transition: none !important;
          }

          .nova-obra-btn:hover i,
          .nova-obra-btn:focus-visible i {
            transform: none !important;
          }
        }
      `}</style>
    </>
  )
}

export default NovaObra
