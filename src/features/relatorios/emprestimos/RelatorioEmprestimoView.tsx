import { useRef } from 'react'
import EmprestimoReport from './EmprestimoReport'
import { useReactToPrint } from 'react-to-print'
import { useLocation } from 'react-router-dom'

const RelatorioEmprestimoView = () => {
  const emprestimoRef = useRef<HTMLDivElement>(null)
  const location = useLocation();

  const handlePrint = useReactToPrint({
    content: () => emprestimoRef.current,
  })

  const { emprestimos, startDate, endDate, situacao } = location.state || {};


  return (
    <section id="definicoes" className="col pt-2 ms-4 position-relative">
      <div id="actions" className="d-flex flex-wrap mb-2 ms-4">
        <EmprestimoReport emprestimos={emprestimos} startDate={startDate} endDate={endDate} ref={emprestimoRef} situacao={situacao.value} />
      </div>

      {emprestimos && emprestimos.length > 0 && <button
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
      </button>}
    </section>
  )
}

export default RelatorioEmprestimoView
