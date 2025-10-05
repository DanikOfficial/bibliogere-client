import { useState } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import CreateObraRelatorioModal from './CreateObraRelatorioModal'
import CreateEmprestimoRelatorioModal from './CreateRelatorioEmprestimoModal'

const GerarRelatoriosView = () => {
  const [
    isGerarObraRelatorioModalDisplayed,
    setIsGerarObraRelatorioModalDisplayed,
  ] = useState<boolean>(false)
  const [
    isGerarEmprestimoRelatorioModalDisplayed,
    setIsGerarEmprestimoRelatorioModalDisplayed,
  ] = useState<boolean>(false)

  const toggleGerarObraRelatorioModal = () =>
    setIsGerarObraRelatorioModalDisplayed((prev) => !prev)

  const toggleGerarEmprestimoRelatorioModal = () =>
    setIsGerarEmprestimoRelatorioModalDisplayed((prev) => !prev)

  return (
    <>
      {isGerarObraRelatorioModalDisplayed && (
        <CreateObraRelatorioModal
          toggleGerarObraRelatorioModal={toggleGerarObraRelatorioModal}
        />
      )}
      {isGerarEmprestimoRelatorioModalDisplayed && (
        <CreateEmprestimoRelatorioModal
          toggleGerarEmprestimoRelatorioModal={
            toggleGerarEmprestimoRelatorioModal
          }
        />
      )}
      <section id="relatórios">
        <SectionName>Gerar Relatórios</SectionName>
        <div className="container-fluid">
          <div className="d-flex flex-wrap">
            <button
              className="
                    btn btn-white btn-big
                    text-primary
                    card-shadow
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    me-5
                    mb-3
                  "
              onClick={toggleGerarObraRelatorioModal}
            >
              <i className="bi bi-card-list display-1"></i>
              <span className="my-3 fw-normal fs-3">Obras</span>
            </button>
            <button
              className="
                    btn btn-white btn-big
                    text-primary
                    card-shadow
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    me-5
                  "
              onClick={toggleGerarEmprestimoRelatorioModal}
            >
              <i className="bi bi-person-lines-fill display-1"></i>
              <span className="my-3 fw-normal fs-3">Empréstimos</span>
            </button>
          </div>
        </div>
      </section>
    </>
  )
}

export default GerarRelatoriosView
