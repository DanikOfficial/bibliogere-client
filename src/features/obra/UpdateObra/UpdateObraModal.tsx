import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { selectAllLocalizacoes } from '../../localizacoes/localizacaoApi'
import { useUpdateObraMutation } from '../data/obraApi'
import { selectCurrentObra } from '../data/obraSlice'
import {
  ObraFormErrorResponse,
  ObraForm,
  defaultObraFormState,
  defaultObraFormErrorResponse,
} from '../data/ObraInterfaces'
import ComboBox from '../../../components/reusable/ComboBox'
import ControlledInput from '../../../components/reusable/ControlledInput'
import { selectEstantesByTipoEstante } from '../../estantes/data/estanteSlice'
import { renderEstantesOptions } from '../../estantes/EstanteList/business.logic'
import {
  onInputChange,
  onChangeSelect,
} from '../../../utils/reusable/CommonFormEventsHandler'
import { EMPTY } from '../../../components/reusable/data/Constants'
import { sendUpdateObraRequest } from '../manage/business.logic'
import { renderLocalizacoes } from '../NovaObra/business.logic'

export interface UpdateObraModalProps {
  closeModal: () => void
}

const UpdateObraModal: React.FC<UpdateObraModalProps> = ({ closeModal }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useAppDispatch()
  const currentObra = useAppSelector(selectCurrentObra)
  const [formState, setFormState] = useState<ObraForm>(defaultObraFormState)
  const [error, setError] = useState<ObraFormErrorResponse>(
    defaultObraFormErrorResponse
  )

  const [isUpdateObraRequestSuccess, setIsUpdateObraRequestSuccess] =
    useState<Boolean>(false)

  const [updateObra, { isLoading, isError }] = useUpdateObraMutation()

  const estanteEntities = useSelector((state: RootState) =>
    selectEstantesByTipoEstante(state, formState.type.label as string)
  )

  const estanteOptions = renderEstantesOptions(estanteEntities)
  const localizacoes = useAppSelector(selectAllLocalizacoes)
  const localizacaoOptions = renderLocalizacoes(localizacoes)

  const onChangeLocalizacao = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeSelect(setFormState, name, value, label)

  const onChangeEstante = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeSelect(setFormState, name, value, label)

  const onClickConfirmar = () => {
    sendUpdateObraRequest(
      formState,
      updateObra,
      setError,
      dispatch,
      (isUpdated) => {
        setIsUpdateObraRequestSuccess(isUpdated)
        clearFormFields()
        onClickCancelar()
      }
    )
  }

  const onClickCancelar = () => {
    closeModal()
    clearFormFields()
  }

  const clearFormFields = () => {}

  useEffect(() => {
    setFormState(currentObra as ObraForm)
  }, [currentObra])

  useEffect(() => {
    if (isLoading) {
      toast.dismiss()
      toast.loading('Atualizando obra...')
    } else {
      if (isUpdateObraRequestSuccess) {
        toast.dismiss()
        toast.success('Obra atualizada com sucesso!', {
          duration: 3000,
        })
        setIsUpdateObraRequestSuccess(false)
      }
    }
  }, [isLoading, isUpdateObraRequestSuccess])

  return (
    <div
      className="modal fade modal-custom-bg show d-block"
      id="gerirObraModal"
      tabIndex={-1}
      aria-labelledby="gerirObraLabel"
      aria-hidden="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content" style={{ borderRadius: '16px', border: 'none', overflow: 'hidden' }}>
          {/* Header */}
          <div 
            className="position-relative" 
            style={{ 
              background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
              padding: '2rem'
            }}
          >
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
              onClick={onClickCancelar}
              aria-label="Close"
            ></button>
            
            <div className="text-center text-white">
              <div 
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-white mb-3 shadow"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-pencil-square fs-2" style={{ color: '#2563eb' }}></i>
              </div>
              <h4 className="fw-bold mb-1">Atualizar Obra</h4>
              <p className="mb-0 opacity-90" style={{ fontSize: '0.9rem' }}>Edite as informações da obra</p>
            </div>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {isError && (
              <div className="alert alert-danger d-flex align-items-center mb-4" role="alert" style={{ borderRadius: '12px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <div><strong>Erro:</strong> {error.message}</div>
              </div>
            )}

            <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
              <div className="card-body p-4">
                <div className="row g-3">
                  <div className="col-12">
                    <ControlledInput
                      name="titulo"
                      color="primary"
                      value={formState.titulo}
                      id="titulo"
                      label="Título da Obra"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Título da obra"
                      error={error.errors?.titulo}
                      type="text"
                      autoFocus
                    />
                  </div>

                  <div className="col-12">
                    <ControlledInput
                      name="autor"
                      color="primary"
                      id="autor"
                      label="Autor(es)"
                      value={formState.autor}
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Nome do(s) autor(es)"
                      error={error.errors?.autor}
                      type="text"
                    />
                  </div>

                  {formState.type.value && (
                    <div className="col-12">
                      {(formState.type.value as string).toLowerCase() === 'livro' && (
                        <ControlledInput
                          id="editora"
                          label="Editora"
                          value={formState.editora as string}
                          color="primary"
                          name="editora"
                          type="text"
                          error={error.errors?.editora}
                          onChange={(event) => onInputChange(event, setFormState)}
                          reference={inputRef}
                          placeholder="Nome da editora"
                        />
                      )}

                      {(formState.type.value as string).toLowerCase() === 'monografia' && (
                        <ControlledInput
                          id="tutor"
                          label="Orientador/Tutor"
                          value={formState.tutor as string}
                          color="primary"
                          name="tutor"
                          type="text"
                          error={error.errors?.tutor}
                          onChange={(event) => onInputChange(event, setFormState)}
                          reference={inputRef}
                          placeholder="Nome do orientador"
                        />
                      )}
                    </div>
                  )}

                  <div className="col-sm-6">
                    <ControlledInput
                      type="number"
                      name="ano"
                      value={formState.ano}
                      error={error.errors?.ano}
                      color="primary"
                      label="Ano de Publicação"
                      id="ano"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Ex: 2024"
                    />
                  </div>

                  <div className="col-sm-6">
                    <ComboBox
                      id="estante"
                      label="Estante"
                      color="primary"
                      value={formState.estante}
                      name="estante"
                      options={estanteOptions}
                      onChange={onChangeEstante}
                    />
                  </div>

                  <div className="col-12">
                    <ComboBox
                      id="localizacao"
                      label="Localização"
                      color="primary"
                      name="localizacao"
                      value={formState.localizacao}
                      options={localizacaoOptions}
                      onChange={onChangeLocalizacao}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 bg-light p-4">
            <div className="d-flex gap-2 w-100">
              <button
                type="button"
                className="btn btn-primary btn-lg flex-grow-1 d-flex align-items-center justify-content-center shadow-sm"
                disabled={isLoading}
                onClick={onClickConfirmar}
                style={{ borderRadius: '12px', transition: 'all 0.2s ease' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-danger btn-lg d-flex align-items-center justify-content-center"
                onClick={onClickCancelar}
                style={{ borderRadius: '12px', minWidth: '120px' }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateObraModal
