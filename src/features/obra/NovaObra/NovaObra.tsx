import {  useState } from 'react'
import NovaObraModal, { NovaObraModalProps } from './NovaObraModal'

const NovaObra: React.FC = () => {
  const [isNovaObraModalDisplayed, setIsNovaObraModalDisplayed] =
    useState<Boolean>(false)

  const showModal = () => {
    setIsNovaObraModalDisplayed(true)
  }

  const removeModal = () => {
    setIsNovaObraModalDisplayed(false)
  }

  const novaObraModalProps: NovaObraModalProps = {
    hideModal: removeModal,
  }

  return (
    <>
      {isNovaObraModalDisplayed && <NovaObraModal {...novaObraModalProps} />}
      <div id="nova-obra-wrapper" className="mb-3">
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
          onClick={showModal}
        >
          <span>Nova Obra</span>
          <i className="ms-2 bi bi-plus-square fs-5"></i>
        </button>
      </div>
    </>
  )
}

export default NovaObra
