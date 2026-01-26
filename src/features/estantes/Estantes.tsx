import { FC } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import NovaEstante from './NovaEstante/NovaEstante'
import EstanteList from './EstanteList/EstanteList'
import SearchEstante from './SearchEstante/SearchEstante'

const Estantes: FC = () => {
  const isSearchEnabled = false

  return (
    <>
      <section id="estantes-view" className="col pt-3 px-3">
        <SectionName
          align="center"
          withIcon="bi-bookshelf"
          subtitle="Gerencie as estantes da biblioteca"
        >
          Gestão de Estantes
        </SectionName>
        <NovaEstante />
        {isSearchEnabled && <SearchEstante />}
        <hr />
        <EstanteList />
      </section>
    </>

  )
}

export default Estantes
