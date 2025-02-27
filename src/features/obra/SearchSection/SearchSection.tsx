import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import ComboBox from '../../../components/reusable/ComboBox'
import Input from '../../../components/reusable/Input'
import ControlledInput from '../../../components/reusable/ControlledInput'
import type { ObraType, FormSearchState } from '../data/ObraInterfaces'
import Option from '../../../app/interfaces/Option'
import {
  InitialAdvancedSearchState,
  tipoObraOptionsInitialState,
} from './SearchSectionState'
import {
  onChangeAdvancedSearch,
  onChangeTitulo,
  onToggleAdvancedSearch,
  onChangeTipoObraComboBox,
} from './events.logic'
import { EMPTY, livro } from '../../../components/reusable/data/Constants'
import toast from 'react-hot-toast'
import obraApi from '../data/obraApi'
import { useAppDispatch } from '../../../app/hooks'

const SearchSection: React.FC = () => {
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLInputElement>(null)
  const [tipoObra, setTipoObra] = useState<ObraType>(livro)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
  const [titulo, setTitulo] = useState<string>(EMPTY)
  const [advancedSearchState, setAdvancedSearchState] =
    useState<FormSearchState>(InitialAdvancedSearchState)

  const tipoObraOptions = tipoObraOptionsInitialState

  const [defaultTipoObra, setDefaultTipoObra] = useState<Option>(
    tipoObraOptions[0]
  )

  const onChangeTipoObraSelect = onChangeTipoObraComboBox(
    setTipoObra,
    setDefaultTipoObra,
    ref,
    advancedSearchState
  )

  /** ✅ Debounce API calls to reduce unnecessary re-renders */
  const onClickPesquisar = useCallback(() => {
    toast.loading('Processando...')
    dispatch(
      obraApi.endpoints.findObras.initiate(titulo, {
        forceRefetch: true,
      })
    ).then(() => toast.dismiss())
  }, [titulo, dispatch])

  useEffect(() => {
    const element = ref.current as HTMLInputElement
    const name = element.name
    element.value = EMPTY

    setAdvancedSearchState((prev) => ({ ...prev, [name]: EMPTY }))
  }, [tipoObra])

  return (
    <section id="search-section" className="row mx-0">
      <div
        id="search-fields"
        className="rounded bg-white py-2 px-3 mb-2 col-lg-11 border-2"
      >
        <h5 className="text-center text-prevent my-2">Pesquisar Obra</h5>
        <div className="row mb-4">
          <div className="rounded bg-white py-2 px-3 mb-2">
            {/*
            
            FIXME: fix this

            <ComboBox
              id="tipoObra"
              label="Tipo de Obra"
              value={defaultTipoObra}
              color="secondary"
              onChange={onChangeTipoObraSelect}
              options={tipoObraOptions}
            /> */}
            <div className="row">
              <div className="col-lg-10 mb-2">
                <ControlledInput
                  name="titulo"
                  color="secondary"
                  id="titulo"
                  value={titulo}
                  onChange={(event) => onChangeTitulo(event, setTitulo)}
                  type="text"
                  placeholder="Digite o titulo da obra!"
                />
              </div>
              <div className="col-lg-2 d-flex">
                <button
                  disabled={!Boolean(titulo)}
                  onClick={onClickPesquisar}
                  className="btn btn-primary d-flex align-items-center"
                >
                  <span>Pesquisar</span> <i className="bi bi-search ms-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/*
            TODO: Paused feature
        <div id="advanced-search">
          <p className="text-secondary fs-5 fw-bold mb-1">
            Pesquisa avançada
            <i
              className={`ms-1 bi ${
                isAdvanced ? 'bi-check-circle-fill' : 'bi-check-circle'
              } cursor-pointer`}
              onClick={() =>
                onToggleAdvancedSearch(
                  setAdvancedSearchState,
                  setIsAdvanced,
                  ref
                )
              }
            ></i>
          </p>
        </div> */}
        <div
          id="advanced-search-fields"
          className={`d-${isAdvanced ? 'block' : 'none'}`}
        >
          <div className="row mb-2">
            <div className="col-lg-8">
              <ControlledInput
                name="autor"
                id="autorSearch"
                label="Autor"
                color="secondary"
                onChange={(event) =>
                  onChangeAdvancedSearch(event, setAdvancedSearchState)
                }
                value={advancedSearchState.autor}
                type="text"
                placeholder={`Digite o autor ${
                  tipoObra === 'livro' ? 'do livro' : 'da monografia'
                } aqui!`}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 col-lg-3 col-xl-4 mb-2 mb-md-0">
              <ControlledInput
                name="ano"
                id="anoSearch"
                label="Ano"
                value={advancedSearchState.ano}
                color="secondary"
                onChange={(event) =>
                  onChangeAdvancedSearch(event, setAdvancedSearchState)
                }
                type="text"
                placeholder="Digite o ano aqui!"
              />
            </div>
            <div className="col-md-6 col-lg-4 col-xl-4">
              {tipoObra === 'livro' ? (
                <Input
                  id="editoraSearch"
                  label="Editora"
                  name="editora"
                  color="secondary"
                  onChange={(event) =>
                    onChangeAdvancedSearch(event, setAdvancedSearchState)
                  }
                  type="text"
                  placeholder="Editora da Obra"
                  reference={ref}
                />
              ) : (
                <Input
                  id="tutorSearch"
                  label="Tutor"
                  name="tutor"
                  color="secondary"
                  onChange={(event) =>
                    onChangeAdvancedSearch(event, setAdvancedSearchState)
                  }
                  type="text"
                  placeholder="Digite o tutor aqui!"
                  reference={ref}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SearchSection
