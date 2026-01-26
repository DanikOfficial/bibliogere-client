import { useState, useEffect, useMemo, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  EstanteEntity,
  EstanteFormErrorResponse,
  defaultEstanteErrorFormState as initialErrorState,
  defaultEstanteFormState,
  defaultEstanteErrorFormState,
  EstanteForm,
} from '../data/EstanteInterfaces'
import ControlledInput from '../../../components/reusable/ControlledInput'
import { useAppSelector, useAppDispatch } from '../../../app/hooks'
import {
  onChangeSelect,
  onInputChange,
} from '../../../utils/reusable/CommonFormEventsHandler'
import { selectAllTipoEstantes } from '../../tipoEstante/tipoEstanteSlice'
import { renderTipoEstantesOptions } from '../../tipoEstante/business.logic'
import ComboBox from '../../../components/reusable/ComboBox'
import {
  estanteUpdateCanceled,
  isUpdatingEstante,
  selectCurrentEstante,
} from '../data/estanteSlice'
import {
  useCreateEstanteMutation,
  useUpdateEstanteMutation,
} from '../data/estanteApi'
import {
  sendCreateEstanteRequest,
  sendUpdateEstanteRequest,
} from '../manage/business.logic'
import { EMPTY } from '../../../components/reusable/data/Constants'

const NovaEstante: React.FC = () => {
  const dispatch = useAppDispatch()
  const currentEstante = useAppSelector(selectCurrentEstante)
  const [
    createEstante,
    {
      isLoading: isLoadingCreateEstanteRequest,
      isError: isAnyErrorInCreateEstanteRequest,
    },
  ] = useCreateEstanteMutation()
  const [
    updateEstante,
    {
      isLoading: isLoadingUpdateEstanteRequest,
      isError: isAnyErrorInUpdateEstanteRequest,
    },
  ] = useUpdateEstanteMutation()

  const [isCreateEstanteRequestSuccess, setIsCreateEstanteRequestSuccess] =
    useState<Boolean>(false)
  const [isUpdateEstanteRequestSuccess, setIsUpdateEstanteRequestSuccess] =
    useState<Boolean>(false)

  const [formState, setFormState] = useState<EstanteForm>(
    defaultEstanteFormState
  )
  const isUpdating: Boolean = useAppSelector(isUpdatingEstante)
  const [isCreating, setIsCreating] = useState<Boolean>(false)

  const tipoEstanteEntities = useAppSelector(selectAllTipoEstantes)
  const tipoEstanteOptions = renderTipoEstantesOptions(tipoEstanteEntities)

  const [error, setError] =
    useState<EstanteFormErrorResponse>(initialErrorState)
  const [isError, setIsError] = useState<Boolean>(false)

  const enableCreateNewEstante = () => setIsCreating(true)

  const disableCreateNewEstante = () => setIsCreating(false)

  const onChangeTipoEstanteSelect = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeSelect(setFormState, name, value, label)

  const isCreatingOrEditing = useMemo(
    () => Boolean(isUpdating) || Boolean(isCreating),
    [isUpdating, isCreating]
  )

  const isLoadingAnyRequest = useMemo(
    () =>
      Boolean(isLoadingCreateEstanteRequest) ||
      Boolean(isLoadingUpdateEstanteRequest),
    [isLoadingCreateEstanteRequest, isLoadingUpdateEstanteRequest]
  )

  const onClickConfirmar = () => {
    const estante: EstanteEntity = {
      codigo: formState.codigo,
      nome: formState.nome,
      tipoEstante: formState.tipoEstante.value as string,
    }

    if (isCreating) {
      sendCreateEstanteRequest(
        estante,
        createEstante,
        setError,
        (isCreated) => {
          if (isCreated) {
            setIsCreateEstanteRequestSuccess(isCreated)
            setIsError(false)
            clearFields()
          }
        }
      )
    } else {
      sendUpdateEstanteRequest(
        estante,
        updateEstante,
        setError,
        dispatch,
        (isUpdated) => {

          console.log("Is Updated? ", isUpdated)

          if (isUpdated) {
            setIsUpdateEstanteRequestSuccess(isUpdated)
            setIsError(false)
            clearFields()
          }
        }
      )
    }
  }

  const onClickCancelar = () => {
    if (isUpdating) {
      dispatch(estanteUpdateCanceled())
    }
    clearFields()
  }

  const clearFields = () => {
    setFormState(defaultEstanteFormState)
    setError(defaultEstanteErrorFormState)
    setIsError(false)
    disableCreateNewEstante()
  }

  const setCurrentEstante = useCallback(() => {
    setFormState(currentEstante as EstanteForm)
  }, [currentEstante])

  useEffect(() => {
    setCurrentEstante()
  }, [setCurrentEstante])

  const setErrorForCreateOrUpdateEstante = useCallback(() => {
    setIsError(
      isAnyErrorInCreateEstanteRequest || isAnyErrorInUpdateEstanteRequest
    )
  }, [isAnyErrorInCreateEstanteRequest, isAnyErrorInUpdateEstanteRequest])

  useEffect(() => {
    setErrorForCreateOrUpdateEstante()
  }, [setErrorForCreateOrUpdateEstante])

  useEffect(() => {
    if (isLoadingAnyRequest) {
      toast.dismiss()
      if (isLoadingCreateEstanteRequest && !isLoadingUpdateEstanteRequest) {
        toast.loading('Criando estante...')
      } else if (
        isLoadingUpdateEstanteRequest &&
        !isLoadingCreateEstanteRequest
      ) {
        toast.loading('Atualizando estante...')
      }
    } else {
      if (isCreateEstanteRequestSuccess) {
        toast.dismiss()
        toast.success('Estante criada com sucesso!', {
          duration: 3000,
        })
        setIsCreateEstanteRequestSuccess(false)
      } else if (isUpdateEstanteRequestSuccess) {
        toast.dismiss()
        toast.success('Estante atualizada com sucesso!', {
          duration: 3000,
        })
        setIsUpdateEstanteRequestSuccess(false)
      }
    }
  }, [
    isLoadingAnyRequest,
    isLoadingCreateEstanteRequest,
    isLoadingUpdateEstanteRequest,
    isCreateEstanteRequestSuccess,
    isUpdateEstanteRequestSuccess,
  ])

  useEffect(() => {
    if (isError) {
      toast.dismiss()
    }
  }, [isError])

  useEffect(() => {
    if (isUpdating) {
      disableCreateNewEstante()
    }
  }, [isUpdating])

  return (
    <>
      <div id="nova-estante-wrapper" className="mb-3">
        <button
          className="btn btn-primary nova-estante-btn d-inline-flex align-items-center position-relative overflow-hidden"
          onClick={enableCreateNewEstante}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '1rem',
            fontWeight: '500',
            borderRadius: '8px',
            border: 'none',
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
          }}
        >
          <span className="btn-content d-flex align-items-center gap-2 position-relative z-1">
            <i className="bi bi-plus-circle-fill"></i>
            <span>Nova Estante</span>
          </span>
          <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
        </button>
      </div>

      {isCreatingOrEditing && (
        <section
          id="nova-estante-section"
          className="card border-0 shadow-sm mb-3 animate-slide-down"
          style={{ borderRadius: '12px', overflow: 'hidden' }}
        >
          {/* Card Header */}
          <div
            className="card-header border-0 py-2 px-3"
            style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center text-white">
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle bg-white me-2"
                  style={{ width: '32px', height: '32px' }}
                >
                  <i className="bi bi-bookshelf" style={{ color: '#667eea', fontSize: '1rem' }}></i>
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">
                    {isUpdating ? 'Editar Estante' : 'Criar Nova Estante'}
                  </h6>
                  <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                    {isUpdating ? 'Atualize as informações' : 'Adicione uma nova estante'}
                  </small>
                </div>
              </div>
              <button
                className="btn btn-sm btn-link text-white p-0"
                onClick={onClickCancelar}
                style={{ fontSize: '1.2rem', opacity: 0.8 }}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>

          {/* Card Body */}
          <div className="card-body p-3">
            {isError && (
              <div className="alert alert-danger d-flex align-items-center mb-3 py-2" role="alert" style={{ borderRadius: '8px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <small><strong>Erro:</strong> {error.message}</small>
              </div>
            )}

            <div className="row g-3">
              <div className="col-lg-6">
                <ControlledInput
                  name="nome"
                  id="nome"
                  label="Nome da Estante"
                  color="primary"
                  value={formState.nome}
                  error={error.errors?.nome}
                  onChange={(event) => onInputChange(event, setFormState)}
                  type="text"
                  placeholder="Ex: Estante Principal"
                  autoFocus
                />
              </div>

              <div className="col-lg-6">
                <ComboBox
                  id="tipoEstante"
                  name="tipoEstante"
                  label="Tipo de Estante"
                  value={formState.tipoEstante}
                  color="primary"
                  error={error.errors?.tipoEstante}
                  options={tipoEstanteOptions}
                  onChange={onChangeTipoEstanteSelect}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mt-3 pt-3 border-top">
              <button
                className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center shadow-sm"
                onClick={onClickConfirmar}
                disabled={isLoadingAnyRequest}
                style={{
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isLoadingAnyRequest ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    <span>{isUpdating ? 'Atualizando...' : 'Salvando...'}</span>
                  </>
                ) : (
                  <>
                    <i className={`bi bi-${isUpdating ? 'pencil-square' : 'check-circle'} me-2`}></i>
                    <span>{isUpdating ? 'Atualizar' : 'Confirmar'}</span>
                  </>
                )}
              </button>
              <button
                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                onClick={onClickCancelar}
                disabled={isLoadingAnyRequest}
                style={{
                  borderRadius: '8px',
                  minWidth: '100px'
                }}
              >
                <i className="bi bi-x-circle me-2"></i>
                <span>Cancelar</span>
              </button>
            </div>
          </div>
        </section>
      )}

      <style>{`
        .nova-estante-btn {
          letter-spacing: 0.3px;
        }

        .nova-estante-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3) !important;
        }

        .nova-estante-btn:active {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2) !important;
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

        .nova-estante-btn:hover .btn-shine {
          transform: translateX(100%);
        }

        .nova-estante-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
        }

        .nova-estante-btn i {
          transition: transform 0.3s ease;
        }

        .nova-estante-btn:hover i {
          transform: rotate(90deg);
        }

        .z-1 {
          z-index: 1;
        }

        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3) !important;
        }

        .btn-outline-danger:hover:not(:disabled) {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  )
}

export default NovaEstante
