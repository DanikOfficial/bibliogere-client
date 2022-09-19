import { Modal } from 'bootstrap'
import { useRef, useState } from 'react'
import NovaObraModal from './NovaObraModal'
import { displayModal } from './business.logic'

const NovaObra: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null)

  const showModal = () => {
    displayModal(ref)
  }

  return (
    <>
      <NovaObraModal reference={ref} />
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
