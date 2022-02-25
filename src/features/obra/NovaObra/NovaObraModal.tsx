import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectEstantesByTipoObra } from '../../estantes/data/estanteApi'
import { selectAllLocalizacoes } from '../../localizacoes/localizacaoApi'
import { useAddObraMutation } from '../data/obraApi'
import { obraAdded } from '../data/obraSlice'
import { ObraRequest, FormErrorState, Obra } from '../data/ObraInterfaces'
import {
  initialErrorState,
  initialObraRequestState,
  initialObraState,
  initialTipoObraOptionsState,
} from './NovaObraModalState'
import {
  addNewObraLogic,
  hideModal,
  renderEstantes,
  renderLocalizacoes,
} from './business.logic'
import {
  onChangeTipoObra,
  onChangeFormState,
  onChangeComboBox,
  resetFormState,
} from './events.logic'

import Input from '../../../components/reusable/Input'
import ComboBox from '../../../components/reusable/ComboBox'
import ControlledInput from '../../../components/reusable/ControlledInput'
import { Option } from '../../../app/interfaces/Option'

interface Props {
  reference: React.RefObject<HTMLDivElement>
}

const NovaObraModal: React.FC<Props> = ({ reference }) => {
  const [formState, setFormState] = useState<Obra>(initialObraState)
  const [addObra, { isLoading, isError }] = useAddObraMutation()
  const [formStateRequest, setFormStateRequest] = useState<ObraRequest>(
    initialObraRequestState
  )
  const [error, setError] = useState<FormErrorState>(initialErrorState)
  const inputRef = useRef<HTMLInputElement>(null)

  const estantes = useAppSelector((state) =>
    selectEstantesByTipoObra(state, formState.type)
  )

  const localizacoes = useAppSelector(selectAllLocalizacoes)

  const estanteOptions = renderEstantes(estantes)

  const localizacaoOptions = renderLocalizacoes(localizacoes)

  const [localizacao, setLocalizacao] = useState<Option>(localizacaoOptions[0])
  const [defaultEstante, setEstante] = useState<Option>(estanteOptions[0])

  const [tipoObra, setTipoObra] = useState<Option>(
    initialTipoObraOptionsState[0]
  )

  const dispatch = useAppDispatch()

  const onChangeLocalizacao = onChangeComboBox<ObraRequest, Option>(
    setFormStateRequest,
    setLocalizacao
  )

  const onChangeEstante = onChangeComboBox<ObraRequest, Option>(
    setFormStateRequest,
    setEstante
  )

  const onChangeTipo = onChangeTipoObra(
    setFormState,
    setTipoObra,
    inputRef,
    formState
  )

  const addNewObra = () => {
    const request: ObraRequest = {
      ...formStateRequest,
      obra: { ...formState },
    }

    addNewObraLogic(
      dispatch,
      clearFormFields,
      obraAdded,
      request,
      addObra,
      setError
    )
  }

  const clearFormFields = () => {
    resetFormState(setFormState, setFormStateRequest, setError)
    setLocalizacao(localizacaoOptions[0])
    setEstante(estanteOptions[0])
    setTipoObra(initialTipoObraOptionsState[0])
  }

  const closeModal = () => {
    hideModal(reference)
    clearFormFields()
  }

  const canSave = useMemo(
    () => Object.values(formState).every(Boolean),
    [formState]
  )

  // Each time the obra type is changed, we add the current property to the state
  useEffect(() => {
    const element = inputRef.current as HTMLInputElement
    if (element) {
      const name = element.name

      // console.log(tipoObra)
      // console.log(name)

      element.value = ''
      // const type = formState.type.toUpperCase() as ObraType

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
                      value={tipoObra}
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
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
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
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
                      placeholder="Nome dos autor(es) da obra"
                      error={error.errors?.autor}
                      type="text"
                    />
                  </div>
                </div>

                <div className={`row ${formState.type ? 'mb-2' : ''}`}>
                  <div className="col-lg-10">
                    {formState.type.toLocaleLowerCase() === 'livro' && (
                      <Input
                        id="editora"
                        label="Editora"
                        color="secondary"
                        name="editora"
                        type="text"
                        error={error.errors?.editora}
                        onChange={(event) =>
                          onChangeFormState(event, setFormState)
                        }
                        reference={inputRef}
                        placeholder="Editora do livro!"
                      />
                    )}

                    {formState.type.toLocaleLowerCase() === 'monografia' && (
                      <Input
                        id="tutor"
                        label="Tutor"
                        color="secondary"
                        name="tutor"
                        type="text"
                        error={error.errors?.tutor}
                        onChange={(event) =>
                          onChangeFormState(event, setFormState)
                        }
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
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
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
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
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
                      value={defaultEstante}
                      name="codigoEstante"
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
                      name="codigoLocalizacao"
                      value={localizacao}
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
