import React, { useState, useEffect, useRef, useMemo } from 'react'
import ComboBox from '../../../components/reusable/ComboBox'
import Input from '../../../components/reusable/Input'
import ControlledInput from '../../../components/reusable/ControlledInput'
import type { ObraType, FormSearchState } from '../data/ObraInterfaces'
import type { Option } from '../../../app/interfaces/Option'
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

const SearchSection: React.FC = () => {
  const ref = useRef<HTMLInputElement>(null)
  const [tipoObra, setTipoObra] = useState<ObraType>('livro')
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
  const [titulo, setTitulo] = useState<string>('')
  const [advancedSearchState, setAdvancedSearchState] =
    useState<FormSearchState>(InitialAdvancedSearchState)

  const canSearch = useMemo(() => Boolean(titulo), [titulo])

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

  useEffect(() => {
    const element = ref.current as HTMLInputElement
    const name = element.name

    console.log('The name: ' + name)

    element.value = ''

    setAdvancedSearchState((prev) => ({ ...prev, [name]: '' }))
  }, [tipoObra])

  return (
    <section id="search-section" className="row mx-0">
      <div
        id="search-fields"
        className="rounded bg-white py-2 px-3 mb-2 col col-xl-11 border-2"
      >
        <div className="row mb-4">
          <div className="col col-xl-7 mb-2 mb-xl-0">
            <Input
              name="titulo"
              id="tituloSearch"
              label="Titulo"
              color="secondary"
              onChange={(event) => onChangeTitulo(event, setTitulo)}
              type="text"
              placeholder={`Pesquise ${
                tipoObra === 'livro' ? 'o livro' : 'a monografia'
              } aqui! ex: Sistemas de Informação`}
            />
          </div>
          <div className="col-xl-3 mb-3 mb-xl-0">
            <ComboBox
              id="tipoObra"
              label="Tipo de Obra"
              value={defaultTipoObra}
              color="secondary"
              onChange={onChangeTipoObraSelect}
              options={tipoObraOptions}
            />
          </div>
          <div className="col-sm-5 col-md-4 col-lg-2 col-xl-2 mt-lg-4">
            <button
              className="
            btn
            shadow-none
            btn-primary
            custom-height-btn
            d-flex
            align-items-center
            justify-content-center
            w-100
          "
              disabled={!canSearch}
            >
              <span>Pesquisar</span>
              <i className="bi bi-search ms-2"></i>
            </button>
          </div>
        </div>
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
        </div>
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
