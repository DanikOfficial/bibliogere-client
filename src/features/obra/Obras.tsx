import SectionName from '../../components/dashboard/SectionName'
import NovaObra from './NovaObra/NovaObra'
import SearchSection from './SearchSection/SearchSection'
// import ObrasList from './ObrasList'

const Obras: React.FC = () => (
  <>
    <SectionName>Gestão de Obras</SectionName>
    <NovaObra />
    <SearchSection />
    <hr />
  </>
)

export default Obras
