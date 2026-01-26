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
    <section id="search-section" className="mb-4">
      <div className="card border-0 shadow-sm" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        {/* Card Header */}
        <div 
          className="card-header border-0 py-3 px-4"
          style={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
          }}
        >
          <div className="d-flex align-items-center text-white">
            <div 
              className="d-flex align-items-center justify-content-center rounded-circle bg-white me-3"
              style={{ width: '48px', height: '48px' }}
            >
              <i className="bi bi-search" style={{ color: '#2563eb', fontSize: '1.5rem' }}></i>
            </div>
            <div>
              <h5 className="mb-0 fw-bold">Pesquisar Obra</h5>
              <small style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                Encontre obras por título no catálogo
              </small>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-4">
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
          
          <div className="row g-3 align-items-end">
            <div className="col-lg-9">
              <label className="form-label fw-semibold text-secondary mb-2">
                <i className="bi bi-book me-2"></i>Título da Obra
              </label>
              <ControlledInput
                name="titulo"
                color="secondary"
                id="titulo"
                value={titulo}
                onChange={(event) => onChangeTitulo(event, setTitulo)}
                type="text"
                placeholder="Digite o título da obra que procura..."
              />
            </div>
            <div className="col-lg-3">
              <button
                disabled={!Boolean(titulo)}
                onClick={onClickPesquisar}
                className="btn btn-primary w-100 search-btn d-flex align-items-center justify-content-center gap-2 position-relative overflow-hidden"
                style={{
                  padding: '0.65rem 1rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                }}
              >
                <span className="position-relative z-1 d-flex align-items-center gap-2">
                  <i className="bi bi-search"></i>
                  <span>Pesquisar</span>
                </span>
                <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
              </button>
            </div>
          </div>

          {!titulo && (
            <div className="alert alert-info d-flex align-items-center mt-3 mb-0" style={{ borderRadius: '10px' }}>
              <i className="bi bi-lightbulb-fill me-2"></i>
              <small>Dica: Digite pelo menos parte do título para iniciar a pesquisa</small>
            </div>
          )}
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

        {/* Advanced Search Fields (Hidden by default) */}
        <div
          id="advanced-search-fields"
          className={`${isAdvanced ? 'd-block' : 'd-none'} border-top pt-4 px-4 pb-3`}
        >
          <h6 className="text-primary fw-bold mb-3">
            <i className="bi bi-funnel me-2"></i>
            Pesquisa Avançada
          </h6>
          
          <div className="row g-3 mb-3">
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
          
          <div className="row g-3">
            <div className="col-md-6 col-lg-3 col-xl-4">
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

      <style>{`
        .search-btn {
          letter-spacing: 0.3px;
        }

        .search-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3) !important;
        }

        .search-btn:active:not(:disabled) {
          transform: translateY(0);
          box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2) !important;
        }

        .search-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #94a3b8 !important;
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

        .search-btn:hover:not(:disabled) .btn-shine {
          transform: translateX(100%);
        }

        .search-btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
        }

        .z-1 {
          z-index: 1;
        }

        .card {
          transition: box-shadow 0.2s ease;
        }

        .card:hover {
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </section>
  )
}

export default SearchSection