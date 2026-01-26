import React, { useEffect, useState, useRef } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { useAppSelector } from '../../../app/hooks'
import { RootState } from '../../../app/store'
import { selectAllLocalizacoes } from '../../localizacoes/localizacaoApi'
import { useCreateObraMutation } from '../data/obraApi'
import {
  ObraFormErrorResponse,
  ObraForm,
  defaultObraFormState,
  defaultObraFormErrorResponse,
  initialTipoObraOptionsState,
} from '../data/ObraInterfaces'
import { renderLocalizacoes } from './business.logic'
import { onChangeTipoObra } from './events.logic'
import ComboBox from '../../../components/reusable/ComboBox'
import ControlledInput from '../../../components/reusable/ControlledInput'
import { selectEstantesByTipoEstante } from '../../estantes/data/estanteSlice'
import { renderEstantesOptions } from '../../estantes/EstanteList/business.logic'
import {
  onInputChange,
  onChangeSelect,
} from '../../../utils/reusable/CommonFormEventsHandler'
import {
  EMPTY,
  EMPTY_OPTION,
} from '../../../components/reusable/data/Constants'
import { sendCreateObraRequest } from '../manage/business.logic'

export interface NovaObraModalProps {
  hideModal: () => void
}

const NovaObraModal: React.FC<NovaObraModalProps> = ({ hideModal }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [formState, setFormState] = useState<ObraForm>(defaultObraFormState)
  const [error, setError] = useState<ObraFormErrorResponse>(
    defaultObraFormErrorResponse
  )
  const [isCreateObraRequestSuccess, setIsCreateObraRequestSuccess] =
    useState<Boolean>(false)

  const [createObra, { isLoading, isError }] = useCreateObraMutation()

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

  const onChangeTipoDeObra = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => {
    onChangeTipoObra(setFormState, inputRef, { value, label }, formState)
  }

  const onClickConfirmar = () =>
    sendCreateObraRequest(formState, createObra, setError, (isCreated) => {
      setIsCreateObraRequestSuccess(isCreated)
      if (isCreated) {
        clearFormFields()
      }
      toast.dismiss()
    })

  const onClickCancelar = () => {
    closeModal()
    clearFormFields()
  }

  const clearFormFields = () => setFormState(defaultObraFormState)

  const closeModal = () => {
    hideModal()
    clearFormFields()
  }

  useEffect(() => {
    const element = inputRef.current as HTMLInputElement
    if (element) {
      const name = element.name
      element.value = ''
      setFormState((prev) => ({
        ...prev,
        [name]: '',
        type: formState.type,
      }))
    }
    setFormState((prev) => ({ ...prev, estante: EMPTY_OPTION }))
  }, [formState.type])

  useEffect(() => {
    if (isLoading) {
      toast.dismiss()
      toast.loading('Criando obra...')
    } else {
      if (isCreateObraRequestSuccess) {
        toast.dismiss()
        toast.success('Obra criada com sucesso!', {
          duration: 3000,
        })
        setIsCreateObraRequestSuccess(false)
      }
    }
  }, [isLoading, isCreateObraRequestSuccess])

  return (
    <div
      className="modal fade modal-custom-bg show d-block"
      id="gerirObraModal"
      tabIndex={-1}
      aria-labelledby="gerirObraLabel"
      aria-hidden="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content" style={{ borderRadius: '20px', border: 'none', overflow: 'hidden' }}>
          {/* Simplified Header */}
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

            <div className="d-flex align-items-center text-white">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle bg-white me-3"
                style={{ width: "60px", height: "60px", flexShrink: 0 }}
              >
                <i className="bi bi-book-fill" style={{ fontSize: '2rem', color: '#2563eb' }}></i>
              </div>
              <div>
                <h4 className="fw-bold mb-1">Registar Nova Obra</h4>
                <p className="mb-0 opacity-90">Preencha os dados abaixo para adicionar ao catálogo</p>
              </div>
            </div>
          </div>

          {/* Single Form Body */}
          <div className="modal-body p-4">
            {isError && (
              <div className="alert alert-danger d-flex align-items-center mb-4 shadow-sm" role="alert" style={{ borderRadius: '12px' }}>
                <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
                <div>
                  <strong>Erro ao criar obra:</strong> {error.message}
                </div>
              </div>
            )}

            {/* Section 1: Tipo de Obra */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: '32px', height: '32px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  1
                </div>
                <h6 className="mb-0 fw-bold text-primary">Tipo de Obra</h6>
              </div>

              <div className="ps-5">
                <ComboBox
                  id="tipoObra"
                  label="Tipo de Obra *"
                  value={formState.type}
                  color="primary"
                  options={initialTipoObraOptionsState}
                  onChange={onChangeTipoDeObra}
                />
              </div>
            </div>

            <hr className="my-4" />

            {/* Section 2: Informações Básicas */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: '32px', height: '32px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  2
                </div>
                <h6 className="mb-0 fw-bold text-primary">Informações da Obra</h6>
              </div>

              <div className="ps-5">
                <div className="row g-3">
                  <div className="col-12">
                    <ControlledInput
                      name="titulo"
                      color="primary"
                      value={formState.titulo}
                      id="titulo"
                      label="Título da Obra *"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Digite o título completo da obra"
                      error={error.errors?.titulo}
                      type="text"
                      autoFocus
                    />
                  </div>

                  <div className="col-md-6">
                    <ControlledInput
                      name="autor"
                      color="primary"
                      id="autor"
                      label="Autor(es) *"
                      value={formState.autor}
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Nome completo do(s) autor(es)"
                      error={error.errors?.autor}
                      type="text"
                    />
                  </div>

                  {formState.type.value && (
                    <div className="col-md-6">
                      {(formState.type.value as string).toLowerCase() === 'livro' && (
                        <ControlledInput
                          id="editora"
                          label="Editora *"
                          value={formState.editora ?? ''}
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
                          label="Orientador/Tutor *"
                          value={formState.tutor ?? ''}
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

                  <div className="col-md-6">
                    <ControlledInput
                      type="number"
                      name="quantidadeInicial"
                      value={formState.quantidadeInicial}
                      error={error.errors?.quantidadeInicial}
                      color="primary"
                      label="Quantidade de Exemplares *"
                      id="quantidade"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Ex: 5"
                    />
                  </div>

                  <div className="col-md-6">
                    <ControlledInput
                      type="number"
                      name="ano"
                      value={formState.ano}
                      error={error.errors?.ano}
                      color="primary"
                      label="Ano de Publicação *"
                      id="ano"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Ex: 2024"
                    />
                  </div>
                </div>
              </div>
            </div>

            <hr className="my-4" />

            {/* Section 3: Localização */}
            <div className="mb-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                  style={{ width: '32px', height: '32px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  3
                </div>
                <h6 className="mb-0 fw-bold text-primary">Localização Física</h6>
              </div>

              <div className="ps-5">
                <div className="row g-3">
                  <div className="col-md-6">
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
                  <div className="col-md-6">
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

          {/* Modal Footer */}
          <div className="modal-footer border-0 bg-light p-4">
            <div className="d-flex gap-3 w-100">
              <button
                type="button"
                className="btn btn-outline-secondary btn-lg"
                onClick={onClickCancelar}
                disabled={isLoading}
                style={{ borderRadius: '12px' }}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary btn-lg flex-grow-1 shadow-sm"
                onClick={onClickConfirmar}
                disabled={isLoading}
                style={{ borderRadius: '12px' }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Salvando...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Confirmar e Salvar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NovaObraModal
