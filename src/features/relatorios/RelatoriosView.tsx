import { useState } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import CreateObraRelatorioModal from './CreateObraRelatorioModal'
import CreateEmprestimoRelatorioModal from './CreateRelatorioEmprestimoModal'

const GerarRelatoriosView = () => {
  const [isObraModalOpen, setIsObraModalOpen] = useState(false)
  const [isEmprestimoModalOpen, setIsEmprestimoModalOpen] = useState(false)

  const toggleObraModal = () => setIsObraModalOpen(prev => !prev)
  const toggleEmprestimoModal = () => setIsEmprestimoModalOpen(prev => !prev)

  const reportCards = [
    {
      id: 'obras',
      icon: 'bi-card-list',
      title: 'Relatório de Obras',
      description: 'Gerar relatório completo sobre obras cadastradas',
      gradient: 'linear-gradient(135deg, #4a64d8 0%, #3a56d4 100%)',
      onClick: toggleObraModal
    },
    {
      id: 'emprestimos',
      icon: 'bi-person-lines-fill',
      title: 'Relatório de Empréstimos',
      description: 'Gerar detalhes e estatísticas de empréstimos',
      gradient: 'linear-gradient(135deg, #5b7cf0 0%, #4a64d8 100%)',
      onClick: toggleEmprestimoModal
    }
  ]

  return (
    <>
      {isObraModalOpen && (
        <CreateObraRelatorioModal toggleGerarObraRelatorioModal={toggleObraModal} />
      )}

      {isEmprestimoModalOpen && (
        <CreateEmprestimoRelatorioModal
          toggleGerarEmprestimoRelatorioModal={toggleEmprestimoModal}
        />
      )}

      <section id="relatórios" className="col pt-3 px-3">
        <div className="mb-4">
          <SectionName
            align="center"
            withIcon="bi-book"
            subtitle="Gerir relatório de obras e empréstimos"

          >Gerar Relatórios</SectionName>
          <p className="text-muted mb-0">
            Escolha um tipo de relatório para gerar
          </p>
        </div>

        {/* Modern Cards */}
        <div className="row g-4">
          {reportCards.map((card) => (
            <div key={card.id} className="col-lg-6 col-xl-4">
              <button
                className="report-card w-100 border-0 text-start p-0"
                onClick={card.onClick}
              >
                <div className="card border-0 shadow-sm h-100 overflow-hidden">
                  <div
                    className="card-header border-0 p-4 position-relative"
                    style={{
                      background: card.gradient,
                      minHeight: '140px'
                    }}
                  >
                    <div className="position-relative z-1">
                      <div className="icon-wrapper mb-3">
                        <i
                          className={`bi ${card.icon} text-white`}
                          style={{ fontSize: '3rem' }}
                        ></i>
                      </div>
                    </div>
                    <div className="gradient-overlay"></div>
                  </div>

                  <div className="card-body p-4">
                    <h5 className="card-title mb-2 fw-semibold">
                      {card.title}
                    </h5>
                    <p className="card-text text-muted mb-0 small">
                      {card.description}
                    </p>
                    <div className="mt-3 d-flex align-items-center" style={{ color: '#4a64d8' }}>
                      <span className="small fw-semibold me-2">Gerar</span>
                      <i className="bi bi-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>


        <style>{`
          .report-card {
            background: none;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
          }

          .report-card:hover {
            transform: translateY(-8px);
          }

          .report-card:hover .card {
            box-shadow: 0 12px 24px rgba(74, 100, 216, 0.15) !important;
          }

          .report-card:active {
            transform: translateY(-4px);
          }

          .report-card .card {
            transition: all 0.3s ease;
          }

          .card-header {
            position: relative;
          }

          .gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.08);
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .report-card:hover .gradient-overlay {
            opacity: 1;
          }

          .icon-wrapper {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .report-card:hover .icon-wrapper {
            transform: scale(1.1) rotate(5deg);
            background: rgba(255, 255, 255, 0.35);
          }

          .report-card .bi-arrow-right {
            transition: transform 0.3s ease;
          }

          .report-card:hover .bi-arrow-right {
            transform: translateX(5px);
          }

          .card-title {
            color: #2d3748;
          }

          .z-1 {
            z-index: 1;
          }

          /* Responsive adjustments */
          @media (max-width: 991px) {
            .report-card:hover {
              transform: translateY(-4px);
            }
          }

          /* Focus states for accessibility */
          .report-card:focus {
            outline: 2px solid #4a64d8;
            outline-offset: 2px;
          }

          .report-card:focus:not(:focus-visible) {
            outline: none;
          }
        `}</style>
      </section>
    </>
  )
}

export default GerarRelatoriosView
