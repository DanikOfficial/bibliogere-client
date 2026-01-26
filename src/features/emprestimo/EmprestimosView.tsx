import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SectionName from '../../components/dashboard/SectionName'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllEmprestimos } from './data/emprestimoSlice'
import { renderEmprestimos } from './EmprestimoList/business.logic'
import ControlledInput from '../../components/reusable/ControlledInput'
import { onInputChange } from '../../utils/reusable/CommonFormEventsHandler'
import emprestimoApi from './data/emprestimoApi'

const EmprestimosView = () => {
  const [pesquisa, setPesquisa] = useState({ utente: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const emprestimosArr = useAppSelector(selectAllEmprestimos)

  const onClickVisualizar = (codigo: number) => {
    navigate(`/dashboard/emprestimos/${codigo}`)
  }

  const emprestimosJSX = renderEmprestimos(emprestimosArr, onClickVisualizar)

  const createNovoEmprestimo = () => {
    navigate('/dashboard/emprestimos/create')
  }

  const onClickPesquisar = useCallback(() => {
    toast.loading('Processando...')
    dispatch(
      emprestimoApi.endpoints.searchEmprestimosByUtente.initiate(
        pesquisa.utente,
        {
          forceRefetch: true,
        }
      )
    ).then(() => toast.dismiss())
  }, [pesquisa.utente, dispatch])

  return (
    <>
      <section className="col pt-4 px-4">
        {/* Header Section */}
        <div className="mb-4 text-center">
          <SectionName align='center'>Gestão de Empréstimos</SectionName>
          <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
            Gerencie todos os empréstimos da biblioteca
          </p>
        </div>

        {/* Action Bar */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <button
            className="btn btn-primary novo-emprestimo-btn d-inline-flex align-items-center position-relative overflow-hidden"
            onClick={createNovoEmprestimo}
            style={{
              padding: '0.65rem 1.25rem',
              fontSize: '1rem',
              fontWeight: '600',
              borderRadius: '10px',
              border: 'none',
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            <span className="btn-content d-flex align-items-center gap-2 position-relative z-1">
              <i className="bi bi-plus-circle-fill" style={{ fontSize: '1.1rem' }}></i>
              <span>Novo Empréstimo</span>
            </span>
            <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
          </button>

          {emprestimosArr.length > 0 && (
            <div 
              className="badge d-inline-flex align-items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                fontSize: '0.9rem',
                padding: '0.6rem 1rem',
                borderRadius: '10px',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
              }}
            >
              <i className="bi bi-list-check"></i>
              <span>{emprestimosArr.length} {emprestimosArr.length === 1 ? 'empréstimo' : 'empréstimos'}</span>
            </div>
          )}
        </div>

        {/* Search Section */}
        <div className="card border-0 shadow-sm mb-4 animate-slide-in" style={{ borderRadius: '16px' }}>
          <div 
            className="card-header border-0 py-3 px-4"
            style={{ 
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '16px 16px 0 0'
            }}
          >
            <div className="d-flex align-items-center">
              <div 
                className="d-flex align-items-center justify-content-center rounded-circle bg-white me-3"
                style={{ width: '40px', height: '40px' }}
              >
                <i className="bi bi-search" style={{ fontSize: '1.2rem', color: '#8b5cf6' }}></i>
              </div>
              <div>
                <h5 className="mb-0 fw-bold text-white">Pesquisar por Utente</h5>
                <small className="text-white" style={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Encontre empréstimos pelo código do utente
                </small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-lg-9">
                <ControlledInput
                  label="Código do Utente"
                  name="utente"
                  color="primary"
                  id="utente"
                  value={pesquisa.utente}
                  onChange={(event) => onInputChange(event, setPesquisa)}
                  type="text"
                  placeholder="Digite o código do utente para pesquisar..."
                />
              </div>
              <div className="col-lg-3">
                <button
                  disabled={!Boolean(pesquisa.utente)}
                  onClick={onClickPesquisar}
                  className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 search-btn"
                  style={{ 
                    padding: '0.75rem 1rem',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    border: 'none'
                  }}
                >
                  <i className="bi bi-search" style={{ fontSize: '1.1rem' }}></i>
                  <span>Pesquisar</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Emprestimos List Section */}
        <section id="emprestimos">
          {emprestimosArr.length > 0 ? (
            <div className="row g-4">
              {emprestimosJSX}
            </div>
          ) : (
            <div className="card border-0 shadow-sm animate-slide-in" style={{ borderRadius: '16px' }}>
              <div className="card-body p-5">
                <div className="text-center py-5">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                    style={{ 
                      width: '120px', 
                      height: '120px',
                      background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                    }}
                  >
                    <i className="bi bi-inbox" style={{ fontSize: '3.5rem', color: '#9ca3af' }}></i>
                  </div>
                  <h5 className="text-muted fw-bold mb-2">Nenhum empréstimo encontrado</h5>
                  <p className="text-muted mb-4" style={{ fontSize: '1rem' }}>
                    {pesquisa.utente 
                      ? 'Não foram encontrados empréstimos para este utente'
                      : 'Comece criando um novo empréstimo ou pesquise por código de utente'
                    }
                  </p>
                  <button
                    className="btn btn-primary d-inline-flex align-items-center gap-2"
                    onClick={createNovoEmprestimo}
                    style={{
                      padding: '0.75rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      borderRadius: '10px',
                      background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                    }}
                  >
                    <i className="bi bi-plus-circle-fill"></i>
                    <span>Criar Primeiro Empréstimo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .novo-emprestimo-btn {
          letter-spacing: 0.3px;
        }

        .novo-emprestimo-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4) !important;
        }

        .novo-emprestimo-btn:active {
          transform: translateY(0);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3) !important;
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

        .novo-emprestimo-btn:hover .btn-shine {
          transform: translateX(100%);
        }

        .novo-emprestimo-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
        }

        .novo-emprestimo-btn i {
          transition: transform 0.3s ease;
        }

        .novo-emprestimo-btn:hover i {
          transform: rotate(90deg);
        }

        .z-1 {
          z-index: 1;
        }

        .search-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(139, 92, 246, 0.4) !important;
        }

        .search-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #9ca3af !important;
          box-shadow: none !important;
        }

        .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
        }

        .badge {
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}

export default EmprestimosView