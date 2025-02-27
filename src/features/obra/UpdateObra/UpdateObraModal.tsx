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
      toast.loading('Tentando atualizar obra...')
    } else {
      if (isUpdateObraRequestSuccess) {
        toast.dismiss()
        toast.success('Obra atualizada com sucesso!', {
          duration: 5000,
        })
        setIsUpdateObraRequestSuccess(false)
      }
    }
  }, [isLoading, isUpdateObraRequestSuccess])

  return (
    <>
      <div
        className="modal fade modal-custom-bg show d-block"
        id="gerirObraModal"
        tabIndex={-1}
        aria-labelledby="gerirObraLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content custom-radius p-2">
            <div className="modal-body">
              <h4
                className="
                modal-title
                text-secondary text-center
                fw-light
                mb-3
              "
                id="gerirObraLabel"
              >
                Atualizar Obra
              </h4>
              {isError && (
                <span className="text-danger mb-1">
                  <strong>Erro:</strong> {error.message}
                </span>
              )}

              <div className="data-and-actions">
                <div className="row">
                  <div className="col-lg-12 mb-2">
                    <ControlledInput
                      name="titulo"
                      color="primary"
                      value={formState.titulo}
                      id="titulo"
                      label="Titulo"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Titulo da obra"
                      error={error.errors?.titulo}
                      type="text"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-lg-12">
                    <ControlledInput
                      name="autor"
                      color="secondary"
                      id="autor"
                      label="Autor"
                      value={formState.autor}
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Nome dos autor(es) da obra"
                      error={error.errors?.autor}
                      type="text"
                    />
                  </div>
                </div>

                <div className={`row ${formState.type.value ? 'mb-2' : ''}`}>
                  <div className="col-lg-10">
                    {(formState.type.value as string).toLowerCase() ===
                      'livro' && (
                      <ControlledInput
                        id="editora"
                        label="Editora"
                        value={formState.editora as string}
                        color="secondary"
                        name="editora"
                        type="text"
                        error={error.errors?.editora}
                        onChange={(event) => onInputChange(event, setFormState)}
                        reference={inputRef}
                        placeholder="Editora do livro!"
                      />
                    )}

                    {(formState.type.value as string).toLowerCase() ===
                      'monografia' && (
                      <ControlledInput
                        id="tutor"
                        label="Tutor"
                        value={formState.tutor as string}
                        color="secondary"
                        name="tutor"
                        type="text"
                        error={error.errors?.tutor}
                        onChange={(event) => onInputChange(event, setFormState)}
                        reference={inputRef}
                        placeholder="Tutor da Monografia!"
                      />
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                    <ControlledInput
                      type="number"
                      name="ano"
                      value={formState.ano}
                      error={error.errors?.ano}
                      color="secondary"
                      label="Ano"
                      id="ano"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Digite o ano aqui!"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-12 col-lg-7">
                    <ComboBox
                      id="estante"
                      label="Estante"
                      color="secondary"
                      value={formState.estante}
                      name="estante"
                      options={estanteOptions}
                      onChange={onChangeEstante}
                    />
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-12 col-lg-7">
                    <ComboBox
                      id="localizacao"
                      label="Localização"
                      color="secondary"
                      name="localizacao"
                      value={formState.localizacao}
                      options={localizacaoOptions}
                      onChange={onChangeLocalizacao}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 col-lg-3 mb-3 mb-lg-0">
                    <button
                      type="button"
                      className="
                      btn
                      shadow-none
                      btn-primary
                      text-light
                      d-flex
                      align-items-center
                      justify-content-center
                      me-3
                      w-100
                    "
                      disabled={isLoading}
                      onClick={onClickConfirmar}
                    >
                      <span className="me-1">Confirmar</span>

                      <i
                        className={`bi ${
                          isLoading
                            ? 'bi-arrow-clockwise rotate'
                            : 'bi-save text-light'
                        }`}
                      ></i>
                    </button>
                  </div>
                  <div className="col-12 col-md-6 col-lg-3">
                    <button
                      type="button"
                      className="
                      btn
                      shadow-none
                      btn-danger
                      text-light
                      d-flex
                      align-items-center
                      justify-content-center
                      me-3
                      w-100
                    "
                      onClick={onClickCancelar}
                    >
                      <span className="me-1">Cancelar</span>
                      <i className="bi bi-x-square text-light"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpdateObraModal
