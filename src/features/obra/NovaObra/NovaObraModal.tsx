import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectAllLocalizacoes } from '../../localizacoes/localizacaoApi'
import { useAddObraMutation } from '../data/obraApi'
import { obraAdded } from '../data/obraSlice'
import { ObraFormErrorState, ObraForm } from '../data/ObraInterfaces'
import {
  initialErrorState,
  initialObraFormState,
  initialTipoObraOptionsState,
} from './NovaObraModalState'
import {
  addNewObraLogic,
  hideModal,
  renderLocalizacoes,
} from './business.logic'
import { onChangeTipoObra } from './events.logic'
import ComboBox from '../../../components/reusable/ComboBox'
import ControlledInput from '../../../components/reusable/ControlledInput'
import {
  filterEstantesByTipoEstante,
  selectAllEstantes,
} from '../../estantes/data/estanteSlice'
import { renderEstantesOptions } from '../../estantes/EstanteList/business.logic'
import {
  onInputChange,
  onChangeSelect,
} from '../../../utils/reusable/CommonFormEventsHandler'
import { EMPTY } from '../../../components/reusable/data/Constants'

interface Props {
  reference: React.RefObject<HTMLDivElement>
}

const NovaObraModal: React.FC<Props> = ({ reference }) => {
  const [formState, setFormState] = useState<ObraForm>(initialObraFormState)
  const obraType = formState.type.value as string

  const [addObra, { isLoading, isError }] = useAddObraMutation()
  const [error, setError] = useState<ObraFormErrorState>(initialErrorState)
  const inputRef = useRef<HTMLInputElement>(null)

  const estanteEntities = useAppSelector(selectAllEstantes)

  const estantes = filterEstantesByTipoEstante(
    estanteEntities,
    formState.type.value as string
  )

  const localizacoes = useAppSelector(selectAllLocalizacoes)

  const estanteOptions = renderEstantesOptions(estantes)

  const localizacaoOptions = renderLocalizacoes(localizacoes)

  const dispatch = useAppDispatch()

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
  const onChangeTipo = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeTipoObra(setFormState, inputRef, { value, label }, formState)

  const addNewObra = () =>
    addNewObraLogic(
      dispatch,
      clearFormFields,
      obraAdded,
      formState,
      addObra,
      setError
    )

  const closeModal = () => {
    hideModal(reference)
    clearFormFields()
  }

  const canSave = useMemo(
    () => Object.values(formState).every(Boolean),
    [formState]
  )

  const clearFormFields = () => {}

  // Each time the obra type is changed, we add the current property to the state
  useEffect(() => {
    const element = inputRef.current as HTMLInputElement
    if (element) {
      const name = element.name

      element.value = ''

      // This code must be refactored
      setFormState((prev) => ({
        ...prev,
        [name]: '',
        type: formState.type,
      }))
    }
  }, [formState.type])

  return (
    <>
      <div
        className="modal fade modal-custom-bg"
        id="novaObraModa"
        ref={reference}
        tabIndex={-1}
        aria-labelledby="novaObraModaLabel"
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
                id="novaObraModaLabel"
              >
                Registar Nova Obra
              </h4>
              {isError && (
                <span className="text-danger mb-1">
                  <strong>Erro:</strong> {error.message}
                </span>
              )}

              <div id="obra-type">
                <div className="row">
                  <div className="col-lg-6">
                    <ComboBox
                      id="tipoObra"
                      label="Tipo de Obra"
                      value={formState.type}
                      color="secondary"
                      options={initialTipoObraOptionsState}
                      onChange={onChangeTipo}
                    />
                    {!formState.type && (
                      <span className="text-warning">
                        Nota: Certifique-se de escolher o tipo de obra!
                      </span>
                    )}
                  </div>
                </div>

                <hr />
              </div>

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

                <div className={`row ${formState.type ? 'mb-2' : ''}`}>
                  <div className="col-lg-10">
                    {obraType.toLowerCase() === 'livro' && (
                      <ControlledInput
                        id="editora"
                        label="Editora"
                        value={formState.editora ?? ''}
                        color="secondary"
                        name="editora"
                        type="text"
                        error={error.errors?.editora}
                        onChange={(event) => onInputChange(event, setFormState)}
                        reference={inputRef}
                        placeholder="Editora do livro!"
                      />
                    )}

                    {obraType.toLowerCase() === 'monografia' && (
                      <ControlledInput
                        id="tutor"
                        label="Tutor"
                        value={formState.tutor ?? ''}
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
                  <div className="col-sm-12 col-md-6 col-lg-5 mb-2">
                    <ControlledInput
                      type="number"
                      name="quantidadeInicial"
                      value={formState.quantidadeInicial}
                      error={error.errors?.quantidadeInicial}
                      color="secondary"
                      label="Quantidade"
                      id="quantidade"
                      onChange={(event) => onInputChange(event, setFormState)}
                      placeholder="Digite a quantidade aqui!"
                    />
                  </div>
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
                      disabled={!canSave}
                      onClick={addNewObra}
                    >
                      <span className="me-1">Registar</span>

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
                      onClick={closeModal}
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

export default NovaObraModal
