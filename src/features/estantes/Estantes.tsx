import { FC } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import NovaEstante from './NovaEstante/NovaEstante'
import EstanteList from './EstanteList/EstanteList'
import SearchEstante from './SearchEstante/SearchEstante'

const Estantes: FC = () => {
  const isSearchEnabled = false

  return (
    <>
      <SectionName>Gestão de Estantes</SectionName>
      <NovaEstante />
      {isSearchEnabled && <SearchEstante />}
      <hr />
      <EstanteList />
    </>
  )
}

export default Estantes
