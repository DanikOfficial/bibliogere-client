import SectionName from '../../components/dashboard/SectionName'
import NovaObra from './NovaObra/NovaObra'
import ObraList from './ObraList'
import SearchSection from './SearchSection/SearchSection'

const Obras: React.FC = () => (
  <>
    <SectionName>Gestão de Obras</SectionName>
    <NovaObra />
    <SearchSection />
    <hr />
    <ObraList />
  </>
)

export default Obras
