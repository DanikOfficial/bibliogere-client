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
      <SectionName>Gestão de Obras</SectionName>
      <NovaObra />
      <SearchSection />
      <hr />
      <ObraList {...obraListProps} />
    </>
  )
}

export default Obras
