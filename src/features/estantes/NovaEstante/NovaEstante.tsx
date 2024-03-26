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

  /**
   *  Current Estante is being used as default because there are scenarios where this can be used for updates,
   * This prevents unnecessary if statements
   */
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

  const toggleCreateNewEstante = () => {
    setIsCreating((prev) => !prev)
  }

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
          setIsCreateEstanteRequestSuccess(isCreated)
          setIsError(false)
          clearFields()
        }
      )
    } else {
      sendUpdateEstanteRequest(
        estante,
        updateEstante,
        setError,
        dispatch,
        (isUpdated) => {
          setIsUpdateEstanteRequestSuccess(isUpdated)
          setIsError(false)
          clearFields()
        }
      )
    }
  }

  const onClickCancelar = () => {
    if (isUpdating) {
      dispatch(estanteUpdateCanceled())
    }
    setFormState(defaultEstanteFormState)
    setError(defaultEstanteErrorFormState)
    toggleCreateNewEstante()
  }

  const clearFields = () => {
    setFormState(defaultEstanteFormState)
  }

  const setCurrentEstante = useCallback(() => {
    setFormState(currentEstante as EstanteForm)
  }, [currentEstante])

  useEffect(() => setCurrentEstante(), [setCurrentEstante])

  const setErrorForCreateOrUpdateEstante = useCallback(() => {
    setIsError(
      isAnyErrorInCreateEstanteRequest || isAnyErrorInUpdateEstanteRequest
    )
  }, [isAnyErrorInCreateEstanteRequest, isAnyErrorInUpdateEstanteRequest])

  useEffect(
    () => setErrorForCreateOrUpdateEstante(),
    [setErrorForCreateOrUpdateEstante]
  )

  useEffect(() => {
    if (isLoadingAnyRequest) {
      toast.dismiss()
      if (isLoadingCreateEstanteRequest && !isLoadingUpdateEstanteRequest) {
        toast.loading('Tentando criar nova estante...')
      } else if (
        isLoadingUpdateEstanteRequest &&
        !isLoadingCreateEstanteRequest
      ) {
        toast.loading('Tentando atualizar estante...')
      }
    } else {
      if (isCreateEstanteRequestSuccess) {
        toast.dismiss()
        toast.success('Estante criada com sucesso', {
          duration: 5000,
        })
        setIsCreateEstanteRequestSuccess(false)
      } else if (isUpdateEstanteRequestSuccess) {
        toast.dismiss()
        toast.success('Estante atualizada com sucesso', {
          duration: 5000,
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

  return (
    <>
      <div id="nova-estante-wrapper" className="mb-3">
        <button
          className="
                btn
                shadow-none
                btn-primary
                custom-height-btn
                d-flex
                align-items-center
                shadow-none
              "
          onClick={toggleCreateNewEstante}
        >
          <span>Nova Estante</span>
          <i className="ms-2 bi bi-plus-square fs-5"></i>
        </button>
      </div>

      {isCreatingOrEditing && (
        <section
          id="nova-estante-section"
          className="custom-radius bg-white py-2 px-3 mb-2 d-block"
        >
          {isError && (
            <span className="text-danger mb-1">
              <strong>Erro:</strong> {error.message}
            </span>
          )}

          <div className="row my-2">
            <div className="col-lg-4">
              <ControlledInput
                name="nome"
                id="nome"
                label="Nome da Estante:"
                color="secondary"
                value={formState.nome}
                error={error.errors?.nome}
                onChange={(event) => onInputChange(event, setFormState)}
                type="text"
                placeholder="Digite o nome da Estante!"
              />
            </div>
            <div className="col-lg-3 mb-2">
              <ComboBox
                id="tipoEstante"
                name="tipoEstante"
                label="Tipo de Estante:"
                value={formState.tipoEstante}
                color="secondary"
                error={error.errors?.tipoEstante}
                options={tipoEstanteOptions}
                onChange={onChangeTipoEstanteSelect}
              />
            </div>
            <div className="col-lg-5 mt-4 d-flex align-items-start">
              <button
                className="
                  btn
                  shadow-none
                  btn-primary
                  d-flex
                  align-items-center
                  me-4
                "
                onClick={onClickConfirmar}
              >
                {isLoadingAnyRequest ? (
                  <i className="bi bi-arrow-clockwise rotate fs-4"></i>
                ) : (
                  <>
                    <span>Confirmar</span>
                    <i className="bi bi-save text-light ms-2"></i>
                  </>
                )}
              </button>
              <button
                className="
                  btn
                  shadow-none
                  btn-danger
                  text-light
                  d-flex
                  align-items-center
                  me-2
                "
                onClick={onClickCancelar}
              >
                <span>Cancelar</span>
                <i className="bi bi-x-square ms-2"></i>
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export default NovaEstante
