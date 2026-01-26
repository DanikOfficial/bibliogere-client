import React, { forwardRef } from "react";
import { EmprestimoEntityResponse } from "./data/EmprestimoInterfaces";

interface ItemEmprestimoInterface {
  data: EmprestimoEntityResponse;
}

const EmprestimoRead = forwardRef<HTMLDivElement, ItemEmprestimoInterface>(
  ({ data }, ref) => {
    const { utente, contacto, email, itens } = data;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    const getSituacaoColor = (situacao: string) => {
      const situacaoLower = situacao.toLowerCase();
      if (situacaoLower.includes('emprestado') || situacaoLower.includes('ativo')) return 'warning';
      if (situacaoLower.includes('devolvido')) return 'success';
      if (situacaoLower.includes('atrasado')) return 'danger';
      return 'secondary';
    };

    return (
      <div ref={ref}>
        <div className="container print-container">
          <div className="card shadow-sm border-0" style={{ fontSize: "0.9rem" }}>
            {/* Header */}
            <div
              className="card-header text-white text-center py-3"
              style={{
                background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                borderBottom: '3px solid #1e40af'
              }}
            >
              <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
                <i className="bi bi-book fs-4"></i>
                <h3 className="mb-0" style={{ fontSize: "1.3rem", fontWeight: '600' }}>
                  Recibo de Empréstimo
                </h3>
              </div>
              <p className="mb-0 opacity-90" style={{ fontSize: "0.85rem" }}>
                BiblioGere - Sistema de Gestão de Biblioteca
              </p>
            </div>

            <div className="card-body p-3">
              {/* User Information Section */}
              <div className="mb-3 p-2 bg-light rounded-3 border border-primary border-opacity-25">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-person-circle text-primary fs-5"></i>
                  <h5 className="mb-0 text-primary" style={{ fontSize: "1rem", fontWeight: '600' }}>
                    Dados do Utente
                  </h5>
                </div>
                <div className="row g-2">
                  <div className="col-md-4">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-person text-muted mt-1"></i>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Nome</small>
                        <strong style={{ fontSize: "0.85rem" }}>{utente}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-telephone text-muted mt-1"></i>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Contacto</small>
                        <strong style={{ fontSize: "0.85rem" }}>{contacto}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="d-flex align-items-start gap-2">
                      <i className="bi bi-envelope text-muted mt-1"></i>
                      <div>
                        <small className="text-muted d-block" style={{ fontSize: "0.75rem" }}>Email</small>
                        <strong className="text-break" style={{ fontSize: "0.85rem" }}>{email}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-2">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="bi bi-list-check text-primary fs-5"></i>
                  <h5 className="mb-0 text-primary" style={{ fontSize: "1rem", fontWeight: '600' }}>
                    Obras Emprestadas
                  </h5>
                  <span className="badge bg-primary ms-auto" style={{ fontSize: "0.75rem" }}>
                    {itens.length} {itens.length === 1 ? 'item' : 'itens'}
                  </span>
                </div>

                {itens.map((item, index) => {
                  const { codigo: itemCodigo, obra, situacao, data_devolucao, data_realizacao } = item;
                  const { titulo, autor, tipoObra, editora, nomeEstante, localizacaoDesignacao } = obra;
                  const situacaoColor = getSituacaoColor(situacao);

                  return (
                    <div key={index} className="card mb-2 border shadow-sm">
                      <div className="card-body p-2">
                        {/* Item Header */}
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1 text-dark" style={{ fontSize: "0.9rem", fontWeight: '600' }}>
                              <i className="bi bi-book-fill text-primary me-1"></i>
                              {titulo}
                            </h6>
                            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
                              <i className="bi bi-person-fill me-1"></i>
                              {autor}
                            </p>
                          </div>
                          <span className={`badge bg-${situacaoColor} px-2 py-1`} style={{ fontSize: "0.7rem" }}>
                            {situacao}
                          </span>
                        </div>

                        {/* Item Details Grid */}
                        <div className="row g-2 mb-2">
                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "0.7rem" }}>
                              <i className="bi bi-hash me-1"></i>Código
                            </small>
                            <strong style={{ fontSize: "0.8rem" }}>{itemCodigo}</strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "0.7rem" }}>
                              <i className="bi bi-bookmark me-1"></i>Tipo
                            </small>
                            <strong style={{ fontSize: "0.8rem" }}>{tipoObra}</strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "0.7rem" }}>
                              <i className={`bi ${editora ? 'bi-building' : 'bi-person-badge'} me-1`}></i>
                              {editora ? 'Editora' : 'Tutor'}
                            </small>
                            <strong style={{ fontSize: "0.8rem" }}>{editora || obra.tutor || 'N/A'}</strong>
                          </div>
                          <div className="col-6 col-md-3">
                            <small className="text-muted d-block mb-1" style={{ fontSize: "0.7rem" }}>
                              <i className="bi bi-bookshelf me-1"></i>Estante
                            </small>
                            <strong style={{ fontSize: "0.8rem" }}>{nomeEstante}</strong>
                          </div>
                        </div>

                        {/* Location */}
                        <div className="mb-2">
                          <small className="text-muted d-block mb-1" style={{ fontSize: "0.7rem" }}>
                            <i className="bi bi-geo-alt me-1"></i>Localização
                          </small>
                          <strong style={{ fontSize: "0.8rem" }}>{localizacaoDesignacao}</strong>
                        </div>

                        {/* Dates */}
                        <div className="row g-2 pt-2 border-top">
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-calendar-check text-success"></i>
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Empréstimo</small>
                                <strong style={{ fontSize: "0.8rem" }}>{formatDate(data_realizacao)}</strong>
                              </div>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center gap-2">
                              <i className="bi bi-calendar-x text-danger"></i>
                              <div>
                                <small className="text-muted d-block" style={{ fontSize: "0.7rem" }}>Devolução</small>
                                <strong style={{ fontSize: "0.8rem" }}>{formatDate(data_devolucao)}</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Important Notice */}
              <div className="alert alert-info border-info d-flex align-items-start gap-2 mb-0 p-2">
                <i className="bi bi-info-circle-fill fs-5"></i>
                <div>
                  <strong className="d-block mb-1" style={{ fontSize: "0.85rem" }}>Informação Importante</strong>
                  <small style={{ fontSize: "0.75rem" }}>
                    Por favor, devolva as obras na data indicada. Atrasos podem resultar em penalizações.
                    Em caso de dúvidas, entre em contacto com a biblioteca.
                  </small>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className="card-footer text-center py-2"
              style={{ backgroundColor: '#f8f9fa', borderTop: '2px solid #e9ecef' }}
            >
              <div className="d-flex flex-column align-items-center gap-1">
                <p className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>
                  <i className="bi bi-shield-check me-1"></i>
                  Documento gerado automaticamente em {new Date().toLocaleDateString('pt-PT', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>
                  Obrigado por utilizar a BiblioGere!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Styles */}
        <style>{`
          @media screen {
            .print-container {
              max-width: 900px;
              margin: 1rem auto;
            }
          }

          @media print {
            * {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            body {
              margin: 0;
              padding: 0;
            }

            .print-container {
              max-width: 100% !important;
              margin: 0 !important;
              padding: 1cm !important;
            }

            .card {
              border: 1px solid #dee2e6 !important;
              box-shadow: none !important;
              page-break-inside: avoid;
              margin: 0 !important;
            }

            .card-header {
              padding: 0.75rem !important;
            }

            .card-body {
              padding: 0.75rem !important;
            }

            .card-footer {
              padding: 0.5rem !important;
            }

            .badge {
              border: 1px solid currentColor;
            }

            .card.mb-2 {
              margin-bottom: 0.5rem !important;
              page-break-inside: avoid;
            }

            .alert {
              page-break-inside: avoid;
            }
          }
        `}</style>
      </div>
    );
  }
);

EmprestimoRead.displayName = 'EmprestimoRead';

export default EmprestimoRead;
