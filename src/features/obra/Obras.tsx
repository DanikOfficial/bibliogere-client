import { useState } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import NovaObra from './NovaObra/NovaObra'
import ObraList, { ObraListProps } from './ObraList'
import SearchSection from './SearchSection/SearchSection'
import UpdateObraModal, {
  UpdateObraModalProps,
} from './UpdateObra/UpdateObraModal'

const Obras: React.FC = () => {
  const [isUpdateObralModalDisplayed, setIsUpdateObralModalDisplayed] =
    useState<Boolean>(false)
    
  const showUpdateObraModal = () => setIsUpdateObralModalDisplayed(true)

  const closeUpdateObraModal = () => setIsUpdateObralModalDisplayed(false)

  const updateObraModalProps: UpdateObraModalProps = {
    closeModal: closeUpdateObraModal,
  }

  const obraListProps: ObraListProps = {
    showModal: showUpdateObraModal,
  }

  return (
    <>
      {isUpdateObralModalDisplayed && (
        <UpdateObraModal {...updateObraModalProps} />
      )}
      <section id="obras-view" className="col pt-3 px-3">
        <SectionName
          align="center"
          withIcon="bi-book"
          subtitle="Gerencie as obras cadastradas no sistema"
        >
          Gestão de Obras
        </SectionName>
        <NovaObra />
        <SearchSection />
        <hr />
        <ObraList {...obraListProps} />
      </section>
    </>
  )
}

export default Obras
