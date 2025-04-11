import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

interface CreateEmprestimoRelatorioModalInterface {
  toggleGerarEmprestimoRelatorioModal: () => void
}

const CreateEmprestimoRelatorioModal: FC<
  CreateEmprestimoRelatorioModalInterface
> = ({ toggleGerarEmprestimoRelatorioModal }) => {
  const navigate = useNavigate()

  return (
    <div
      className="modal fade modal-custom-bg show d-block"
      id="relatorioEmprestimoModal"
      aria-labelledby="relatorioEmprestimoModalLabel"
      aria-hidden="true"
      tabIndex={-1}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-radius p-2">
          <div className="modal-body">
            <h4
              className="
                  modal-title
                  w-100
                  text-secondary text-center
                  fw-light
                  mb-3
                "
              id="relatorioEmprestimoModalLabel"
            >
              Gerar Relatório de Empréstimos
            </h4>
            <hr />
            <div id="relatorioFields" className="d-flex flex-column">
              <div className="row">
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="
                        form-control
                        placeholder-primary
                        border-end-0
                        border-top-0
                        border-start-0
                        border-2
                        border-secondary
                        text-secondary
                        shadow-none
                        mb-3
                      "
                    id="data-inicial"
                    placeholder="Data Inicial (dd/mm/yyyy)"
                  />
                </div>
                <div className="col-lg-6">
                  <input
                    type="text"
                    className="
                        form-control
                        placeholder-primary
                        border-end-0
                        border-top-0
                        border-start-0
                        border-2
                        border-secondary
                        text-secondary
                        shadow-none
                        mb-3
                      "
                    id="data-final"
                    placeholder="Data Final (dd/mm/yyy)"
                  />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <select
                  name=""
                  id="situacao-emprestimo"
                  className="
                      form-select
                      placeholder-primary
                      border-end-0
                      border-top-0
                      border-start-0
                      border-2
                      border-secondary
                      text-secondary
                      shadow-none
                      mb-3
                    "
                >
                  <option value="">Situação!</option>
                  <option value="Devolvido">Devolvido</option>
                  <option value="Activo">Activo</option>
                </select>
              </div>
            </div>
            <div id="relatorio-modal-actions" className="d-flex">
              <button
                type="button"
                className="
                    btn
                    shadow-none
                    btn-primary
                    text-light
                    d-flex
                    align-items-center
                    me-3
                  "
                  onClick={() => {
                    navigate("/dashboard/relatorios/emprestimos")
                  }}
              >
                <span className="me-1">Gerar</span>
                <i className="bi bi-save text-light"></i>
              </button>
              <button
                type="button"
                className="
                    btn
                    shadow-none
                    btn-danger
                    text-light
                    d-flex
                    align-items-center
                    me-3
                  "
                onClick={toggleGerarEmprestimoRelatorioModal}
              >
                <span className="me-1">Cancelar</span>
                <i className="bi bi-x-square text-light"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateEmprestimoRelatorioModal
