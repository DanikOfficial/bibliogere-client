import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useCreateEmprestimoMutation } from './data/emprestimoApi'
import ControlledInput from '../../components/reusable/ControlledInput'
import { onInputChange } from '../../utils/reusable/CommonFormEventsHandler'
import Obra, { ObraComponentProps } from '../obra/Obra'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAllObras } from '../obra/data/obraSlice'
import SectionName from '../../components/dashboard/SectionName'
import obraApi from '../obra/data/obraApi'
import toast from 'react-hot-toast'
import { useCart } from './cart/CartContext'
import {
  defaultEmprestimoFormState,
  EmprestimoFormErrorResponse,
  EmprestimoForm,
  CreateEmprestimoRequest,
  defaultEmprestimoErrorResponse,
} from './data/EmprestimoInterfaces'
import { sendCreateEmprestimoRequest } from './data/business.logic'
import { useNavigate } from 'react-router-dom'

const CreateEmprestimo: React.FC = () => {
  const [formState, setFormState] = useState<EmprestimoForm>(
    defaultEmprestimoFormState
  )
  const dispatch = useAppDispatch()
  const { totalObras, addObra, removeObra, obrasCart, clearObras } = useCart()
  const navigate = useNavigate()

  const [
    isCreateEmprestimoRequestSuccess,
    setIsCreateEmprestimoRequestSuccess,
  ] = useState<Boolean>(false)

  const [createEmprestimo, { isLoading, isError }] =
    useCreateEmprestimoMutation()

  const [error, setError] = useState<EmprestimoFormErrorResponse>(
    defaultEmprestimoErrorResponse
  )

  const [pesquisa, setPesquisa] = useState({ titulo: '' })
  const obrasArr = useAppSelector(selectAllObras)

  const obrasJSX = useMemo(
    () =>
      obrasArr.map((obra) => {
        const obraComponentProps: ObraComponentProps = {
          obra,
          onClickAdicionarObra: addObra,
          isBeingManaged: false,
          obras: obrasCart,
          onClickRemoverObra: removeObra,
        }
        return <Obra key={obra.codigo} {...obraComponentProps} />
      }),
    [obrasArr, obrasCart, addObra, removeObra]
  )

  const obrasEscolhidasJSX = useMemo(
    () =>
      obrasCart.map((obra) => {
        const obraComponentProps: ObraComponentProps = {
          obra,
          isBeingManaged: false,
          onClickRemoverObra: removeObra,
          fromCart: true,
        }
        return <Obra key={obra.codigo} {...obraComponentProps} />
      }),
    [obrasCart, removeObra]
  )

  const handleInputChange = useCallback(
    ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  const onClickPesquisar = useCallback(() => {
    toast.loading('Processando...')
    dispatch(
      obraApi.endpoints.findObras.initiate(pesquisa.titulo, {
        forceRefetch: true,
      })
    ).then(() => toast.dismiss())
  }, [pesquisa.titulo, dispatch])

  const onClickConfirmar = () => {
    const obrasIds = obrasCart.map((obra) => obra.codigo)
    const createEmprestimoRequest: CreateEmprestimoRequest = {
      ...formState,
      obrasIds,
    }

    sendCreateEmprestimoRequest(
      createEmprestimoRequest,
      createEmprestimo,
      setError,
      (isCreated) => {
        setIsCreateEmprestimoRequestSuccess(isCreated)
        if (isCreated) {
          navigate('/dashboard/emprestimos/list')
          clearFormFields()
        }
        toast.dismiss()
      }
    )
  }

  const clearFormFields = () => {
    setFormState(defaultEmprestimoFormState)
    clearObras()
  }

  useEffect(() => {
    if (isLoading) {
      toast.dismiss()
      toast.loading('Tentando criar novo empréstimo...')
    } else {
      if (isCreateEmprestimoRequestSuccess) {
        toast.dismiss()
        toast.success('Empréstimo criado com sucesso!', {
          duration: 5000,
        })
        setIsCreateEmprestimoRequestSuccess(false)
      }
    }
  }, [isLoading, isCreateEmprestimoRequestSuccess])

  return (
    <>
      <section id="criar-emprestimo" className="col pt-3 px-3">
        <div className="mb-4 text-center">
          <SectionName align='center'>Registar Novo Empréstimo</SectionName>
          <p className="text-muted mb-0" style={{ fontSize: '1rem' }}>
            Pesquise obras disponíveis e adicione as informações do utente
          </p>
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
                <h5 className="mb-0 fw-bold text-white">Pesquisar Obras</h5>
                <small className="text-white" style={{ opacity: 0.9, fontSize: '0.8rem' }}>
                  Encontre as obras disponíveis para empréstimo
                </small>
              </div>
            </div>
          </div>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-lg-9">
                <ControlledInput
                  name="titulo"
                  color="primary"
                  id="titulo"
                  value={pesquisa.titulo}
                  onChange={(event) => onInputChange(event, setPesquisa)}
                  type="text"
                  placeholder="Digite o título da obra que procura..."
                  label="Título da Obra"
                />
              </div>
              <div className="col-lg-3">
                <button
                  disabled={!Boolean(pesquisa.titulo)}
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

        {/* Main Content */}
        <div className="row g-4">
          {/* Left Column - Available Works */}
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100 animate-slide-in" style={{ borderRadius: '16px', animationDelay: '0.1s' }}>
              <div
                className="card-header border-0 py-3 px-4"
                style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 me-3"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                      }}
                    >
                      <i className="bi bi-book text-white" style={{ fontSize: '1.3rem' }}></i>
                    </div>
                    <div>
                      <h5 className="mb-0 fw-bold" style={{ color: '#1f2937' }}>Lista de Obras</h5>
                      <small className="text-muted" style={{ fontSize: '0.8rem' }}>Resultados da pesquisa</small>
                    </div>
                  </div>
                  {obrasArr.length > 0 && (
                    <span
                      className="badge d-flex align-items-center justify-content-center"
                      style={{
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        fontSize: '0.85rem',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        minWidth: '45px',
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(37, 99, 235, 0.2)'
                      }}
                    >
                      {obrasArr.length}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="card-body p-4 custom-scrollbar"
                style={{ maxHeight: '600px', overflowY: 'auto' }}
              >
                {obrasArr.length > 0 ? (
                  <div className="d-flex flex-column gap-3">{obrasJSX}</div>
                ) : (
                  <div className="text-center py-5">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                      style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                      }}
                    >
                      <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#9ca3af' }}></i>
                    </div>
                    <h6 className="text-muted fw-semibold mb-2">Nenhuma obra encontrada</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                      Use a barra de pesquisa acima para encontrar obras
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Selected Works & User Info */}
          <div className="col-lg-6">
            {/* Selected Works Card */}
            <div className="card border-0 shadow-sm mb-4 animate-slide-in" style={{ borderRadius: '16px', animationDelay: '0.2s' }}>
              <div
                className="card-header border-0 py-3 px-4"
                style={{
                  background: totalObras() > 0
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: '16px 16px 0 0',
                  transition: 'all 0.3s ease'
                }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div
                      className="d-flex align-items-center justify-content-center rounded-3 me-3"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: totalObras() > 0
                          ? 'rgba(255, 255, 255, 0.25)'
                          : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        backdropFilter: 'blur(10px)',
                        border: totalObras() > 0 ? '2px solid rgba(255, 255, 255, 0.3)' : 'none',
                        boxShadow: totalObras() === 0 ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <i
                        className="bi bi-cart-check"
                        style={{
                          fontSize: '1.3rem',
                          color: 'white'
                        }}
                      ></i>
                    </div>
                    <div>
                      <h5
                        className="mb-0 fw-bold"
                        style={{
                          color: totalObras() > 0 ? 'white' : '#1f2937',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        Obras Selecionadas
                      </h5>
                      <small
                        style={{
                          fontSize: '0.8rem',
                          color: totalObras() > 0 ? 'rgba(255, 255, 255, 0.9)' : '#6b7280',
                          transition: 'color 0.3s ease'
                        }}
                      >
                        Carrinho de empréstimo
                      </small>
                    </div>
                  </div>
                  {totalObras() > 0 && (
                    <span
                      className="badge d-flex align-items-center justify-content-center cart-badge"
                      style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(10px)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '0.85rem',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        minWidth: '45px',
                        fontWeight: '700',
                        color: 'white'
                      }}
                    >
                      {totalObras()}
                    </span>
                  )}
                </div>
              </div>
              <div
                className="card-body p-4 custom-scrollbar"
                style={{ maxHeight: '280px', overflowY: 'auto' }}
              >
                {totalObras() > 0 ? (
                  <div className="d-flex flex-column gap-3">{obrasEscolhidasJSX}</div>
                ) : (
                  <div className="text-center py-4">
                    <div
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                      style={{
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)'
                      }}
                    >
                      <i className="bi bi-cart-x" style={{ fontSize: '2.2rem', color: '#9ca3af' }}></i>
                    </div>
                    <h6 className="text-muted fw-semibold mb-2">Carrinho vazio</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                      Selecione obras da lista ao lado para adicionar
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* User Information Card */}
            <div className="card border-0 shadow-sm animate-slide-in" style={{ borderRadius: '16px', animationDelay: '0.3s' }}>
              <div
                className="card-header border-0 py-3 px-4"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center">
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle bg-white me-3"
                    style={{ width: '40px', height: '40px' }}
                  >
                    <i className="bi bi-person-circle" style={{ fontSize: '1.2rem', color: '#2563eb' }}></i>
                  </div>
                  <div>
                    <h5 className="mb-0 fw-bold text-white">Informações do Utente</h5>
                    <small className="text-white" style={{ opacity: 0.9, fontSize: '0.8rem' }}>
                      Dados do requisitante
                    </small>
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                {isError && (
                  <div
                    className="alert alert-danger d-flex align-items-center mb-3 py-2"
                    role="alert"
                    style={{ borderRadius: '10px', border: 'none' }}
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <small><strong>Erro:</strong> {error.message}</small>
                  </div>
                )}

                <div className="mb-3">
                  <ControlledInput
                    name="utente"
                    color="primary"
                    id="nome"
                    label="Código do Utente"
                    addSpace={true}
                    value={formState.utente}
                    error={error.errors?.utente}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Digite o código do utente/estudante"
                  />
                </div>

                <div className="mb-3">
                  <ControlledInput
                    name="contacto"
                    color="primary"
                    id="contacto"
                    label="Contacto"
                    value={formState.contacto}
                    addSpace={true}
                    error={error.errors?.contacto}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Digite o contacto do utente"
                  />
                </div>

                <div className="mb-4">
                  <ControlledInput
                    label="Email (opcional)"
                    name="email"
                    color="primary"
                    id="email"
                    value={formState.email}
                    error={error.errors?.email}
                    addSpace={true}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="Digite o e-mail"
                  />
                </div>

                <button
                  className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2 confirm-btn"
                  disabled={error.error || totalObras() === 0 || isLoading}
                  onClick={onClickConfirmar}
                  style={{
                    borderRadius: '12px',
                    padding: '1rem',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  {isLoading ? (
                    <>
                      <i className="bi bi-arrow-clockwise rotate"></i>
                      <span>Processando...</span>
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle-fill" style={{ fontSize: '1.2rem' }}></i>
                      <span>Confirmar Empréstimo</span>
                    </>
                  )}
                </button>

                {totalObras() === 0 && (
                  <div
                    className="mt-3 p-3 text-center"
                    style={{
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '10px',
                      border: '1px solid #fbbf24'
                    }}
                  >
                    <i className="bi bi-info-circle me-2" style={{ color: '#92400e' }}></i>
                    <small style={{ color: '#92400e', fontWeight: '500' }}>
                      Selecione pelo menos uma obra para continuar
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
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

        .card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
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

        .confirm-btn:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.4) !important;
        }

        .confirm-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .confirm-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #9ca3af !important;
          box-shadow: none !important;
        }

        .cart-badge {
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .rotate {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #a0aec0 0%, #718096 100%);
        }

        .alert {
          border-radius: 10px;
          border: none;
        }
      `}</style>
    </>
  )
}

export default CreateEmprestimo
