import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { selectEstantesByTipoObra } from '../../estantes/estanteApi'
import { selectAllLocalizacoes } from '../../localizacoes/localizacaoApi'
import { useAddObraMutation } from '../data/obraApi'
import {
  ObraRequest,
  FormErrorState,
  Obra,
  ObraType,
} from '../data/ObraInterfaces'
import {
  initialErrorState,
  initialObraRequestState,
  initialObraState,
} from './NovaObraModalState'
import {
  addNewObraLogic,
  hideModal,
  renderEstantes,
  renderLocalizacoes,
} from './business.logic'
import { onChangeTipoObra, onChangeFormState } from './events.logic'

import Input from '../../../components/reusable/Input'
import ComboBox from '../../../components/reusable/ComboBox'
import { MutationDefinition } from '@reduxjs/toolkit/dist/query'

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
  const [tipoObra, setTipoObra] = useState<ObraType>('')
  const inputRef = useRef<HTMLInputElement>(null)

  const dispatch = useAppDispatch()

  const addNewObra = () => {
    const request: ObraRequest = {
      ...formStateRequest,
      obra: { ...formState },
    }

    addNewObraLogic(request, addObra, setError)
  }

  if (isLoading) {
    console.log("OFC, I'm loading")
  }

  const estantes = useAppSelector((state) =>
    selectEstantesByTipoObra(state, tipoObra)
  )

  const localizacoes = useAppSelector(selectAllLocalizacoes)

  const estanteOptions: JSX.Element[] = useMemo(
    () => renderEstantes(estantes),
    [estantes]
  )

  const localizacaoOptions: JSX.Element[] = useMemo(
    () => renderLocalizacoes(localizacoes),
    [localizacoes]
  )

  const closeModal = () => hideModal(reference)

  const canSave = useMemo(
    () => Object.values(formState).every(Boolean),
    [formState]
  )

  // Each time the obra type is changed, we add the current property to the state
  useEffect(() => {
    const element = inputRef.current as HTMLInputElement
    const name = element.name

    console.log(tipoObra)
    console.log(name)

    element.value = ''

    setFormState((prev) => ({ ...prev, [name]: '' }))
  }, [tipoObra])

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

              <div id="obra-type">
                <div className="row">
                  <div className="col col-md-8 col-lg-6">
                    <ComboBox
                      color="secondary"
                      onChange={(event) =>
                        onChangeTipoObra(
                          event,
                          setTipoObra,
                          inputRef,
                          formState
                        )
                      }
                      placeholder="Escolha o tipo de Obra!"
                    >
                      <option value="Livro">Livro</option>
                      <option value="Monografia">Monografia</option>
                    </ComboBox>
                  </div>
                </div>

                <hr />
              </div>

              <div className="data-and-actions">
                <div className="row">
                  <div className="col-lg-12 mb-2">
                    <Input
                      name="titulo"
                      color="secondary"
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
                      placeholder="Digite o titulo do livro aqui!"
                      error={error.errors?.titulo}
                      type="text"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-lg-12">
                    <Input
                      name="autor"
                      color="secondary"
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
                      placeholder="Digite o(s) nome(s) do(s) autor(es) aqui!"
                      error={error.errors?.autor}
                      type="text"
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-lg-10">
                    {!(tipoObra.toLocaleLowerCase() === 'monografia') ? (
                      <Input
                        color="secondary"
                        name="editora"
                        type="text"
                        error={error.errors?.editora}
                        onChange={(event) =>
                          onChangeFormState(event, setFormState)
                        }
                        reference={inputRef}
                        placeholder="Digite a editora aqui!"
                      />
                    ) : (
                      <Input
                        color="secondary"
                        name="tutor"
                        type="text"
                        error={error.errors?.tutor}
                        onChange={(event) =>
                          onChangeFormState(event, setFormState)
                        }
                        reference={inputRef}
                        placeholder="Digite o tutor aqui!"
                      />
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                    <Input
                      type="number"
                      name="quantidadeInicial"
                      color="secondary"
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
                      placeholder="Digite a quantidade aqui!"
                      error={error.errors?.quantidadeInicial}
                    />
                  </div>
                  <div className="col-sm-12 col-md-6 col-lg-4 mb-2">
                    <Input
                      type="number"
                      name="ano"
                      color="secondary"
                      onChange={(event) =>
                        onChangeFormState(event, setFormState)
                      }
                      placeholder="Digite o ano aqui!"
                      error={error.errors?.ano}
                    />
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-sm-12 col-lg-7">
                    <ComboBox
                      color="secondary"
                      name="codigoEstante"
                      placeholder="Escolha a estante!"
                      onChange={(event) =>
                        onChangeFormState(event, setFormStateRequest)
                      }
                    >
                      {estanteOptions}
                    </ComboBox>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-sm-12 col-lg-7">
                    <ComboBox
                      color="secondary"
                      name="codigoLocalizacao"
                      placeholder="Escolha a localização!"
                      onChange={(event) =>
                        onChangeFormState(event, setFormStateRequest)
                      }
                    >
                      {localizacaoOptions}
                    </ComboBox>
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
                      <i className="bi bi-save text-light"></i>
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
