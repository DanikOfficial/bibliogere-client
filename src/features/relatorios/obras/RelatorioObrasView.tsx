import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import ObrasReport from './ObrasReport'
import { useLocation, useNavigate } from 'react-router-dom'

const RelatorioObrasView = () => {
  const obrasRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => obrasRef.current,
  })

  const location = useLocation()

  const { obras, startDate, endDate, tipoObra, estante } = location.state || {}

  return (
    <section id="definicoes" className="col pt-2 ms-4 position-relative">
      <div id="actions" className="d-flex flex-wrap mb-2 ms-4">
        <ObrasReport
          ref={obrasRef}
          obras={obras}
          startDate={startDate}
          endDate={endDate}
          tipoObra={tipoObra.value}
          estante={estante.value}
        />
      </div>

      {obras && obras.length > 0 && (
        <button
          className="btn btn-primary d-flex align-items-center justify-content-center position-fixed bottom-0 end-0 m-3 shadow-lg"
          onClick={handlePrint}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            padding: 0,
            zIndex: 1,
          }}
        >
          <i className="bi bi-printer-fill" style={{ fontSize: '24px' }}></i>
        </button>
      )}
    </section>
  )
}

export default RelatorioObrasView
