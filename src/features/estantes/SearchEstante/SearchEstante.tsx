import { useMemo, useState } from 'react'
import { EstanteType } from '../data/EstanteInterfaces'
import { EMPTY, livro } from '../../../components/reusable/data/Constants'
import Input from '../../../components/reusable/Input'
import { useAppSelector } from '../../../app/hooks'
import { renderTipoEstantesOptions } from '../../tipoEstante/business.logic'
import ComboBox from '../../../components/reusable/ComboBox'
import type Option from '../../../app/interfaces/Option'
import { selectAllTipoEstantes } from '../../tipoEstante/tipoEstanteSlice'
import { onInputChange } from '../../../utils/reusable/CommonFormEventsHandler'

// TODO: For now this feature is disabled
const SearchEstante: React.FC = () => {
  const [tipoEstante, setTipoEstante] = useState<EstanteType>(livro)
  const [nomeEstante, setNomeEstante] = useState<string>(EMPTY)
  const canSearch = useMemo(() => Boolean(nomeEstante), [nomeEstante])
  const tipoEstanteEntities = useAppSelector(selectAllTipoEstantes)
  const tipoEstanteOptions = renderTipoEstantesOptions(tipoEstanteEntities)
  const [defaultTipoEstante, seDefaultTipoEstante] = useState<Option>(
    tipoEstanteOptions[0]
  )

  return (
    <div
      id="search-section"
      className="rounded custom-row bg-white py-2 px-3 mb-2"
    >
      <div className="row">
        <div className="col-lg-5 mb-2">
          {/* <input
            type="text"
            className="
            form-control
            shadow-none
            placeholder-primary
            border-end-0
            border-top-0
            border-start-0
            border-2
            border-secondary
            text-secondary
          "
            id="nome-obra"
            placeholder="Pesquisa uma estante aqui! ex: Marketing"
          /> */}

          <Input
            name="nomeEstante"
            id="nomeEstante"
            label="Nome Estante"
            color="secondary"
            onChange={(event) => onInputChange(event, setNomeEstante)}
            type="text"
            placeholder="Pesquisa uma estante aqui! ex: Marketing"
          />
        </div>
        <div className="col-lg-4 mb-2">
          <ComboBox
            id="tipoEstante"
            label="Tipo Estante"
            color="secondary"
            value={defaultTipoEstante}
            name="tipoEstante"
            options={tipoEstanteOptions}
            onChange={() => {}}
            // onChange={onChangeTipoEstante}
          />

          {/* <select
            name=""
            id="tipo-estante"
            className="
            form-select
            placeholder-primary
            border-end-0
            border-top-0
            border-start-0
            border-2
            border-secondary
            text-secondary
            shadow-none
          "
          >
            <option>Escolha o tipo de Estante</option>
            <option value="Livro">Livro</option>
            <option value="Monografia">Monografia</option>
          </select> */}
        </div>
        <div className="col-lg-2 d-flex align-items-stretch">
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
            disabled={!canSearch}
            onClick={() => {}}
            // onClick={() => onClickPesquisarEstante(nomeEstante)}
          >
            <span>Pesquisar</span>
            <i className="ms-2 bi bi-search"></i>
          </button>

          {/* <div
            className="
            btn
            shadow-none
            btn-primary
            custom-height-btn
            d-flex
            align-items-center
          "
          >
            <span>Pesquisar</span>
            <i className="bi bi-search ms-2"></i>
          </div> */}
        </div>
      </div>
    </div>
  )
}

export default SearchEstante
