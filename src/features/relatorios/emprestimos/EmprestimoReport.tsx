import { forwardRef, useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import 'bootstrap/dist/css/bootstrap.min.css'

import { EmprestimoEntity } from '../../emprestimo/data/EmprestimoInterfaces'

export interface EmprestimoReportProps {
  startDate: string
  endDate: string
  emprestimos: EmprestimoEntity[],
  situacao?: string
}

const EmprestimoReport = forwardRef<HTMLDivElement, EmprestimoReportProps>(
  ({ startDate, endDate, emprestimos, situacao }, ref) => {
    const getSituacaoColor = (situacao: string) => {
      const sit = situacao.toLowerCase()
      if (sit.includes('ativo') || sit.includes('activo')) return 'bg-success'
      if (sit.includes('expirado')) return 'bg-danger'
      if (sit.includes('devolvido')) return 'bg-warning text-dark'
      return 'bg-secondary'
    }

    const getSituacaoIcon = (situacao: string) => {
      const sit = situacao.toLowerCase()
      if (sit.includes('ativo') || sit.includes('activo')) return 'bi-check-circle-fill'
      if (sit.includes('expirado')) return 'bi-x-circle-fill'
      if (sit.includes('devolvido')) return 'bi-arrow-return-left'
      return 'bi-question-circle-fill'
    }

    const summary = useMemo(() => {
      if (!emprestimos || emprestimos.length === 0) {
        return {
          sortedEmprestimos: [],
          situacaoData: [],
          topUsers: [],
          totalEmprestimos: 0,
          totalAtivos: 0,
          totalExpirados: 0,
          totalDevolvidos: 0,
          totalLivros: 0,
          totalMonografias: 0
        }
      }

      // Filter emprestimos based on situacao prop
      let filteredEmprestimos = emprestimos

      if (situacao && situacao.trim()) {
        const filterSituacao = situacao.toLowerCase()

        filteredEmprestimos = emprestimos.map(emp => {
          const filteredItens = emp.itens?.filter(item => {
            const itemSituacao = item.situacao.toLowerCase()

            if (filterSituacao.includes('activo')) {
              return itemSituacao.includes('activo') || itemSituacao.includes('ativo')
            } else if (filterSituacao.includes('expirado')) {
              return itemSituacao.includes('expirado')
            } else if (filterSituacao.includes('devolvido')) {
              return itemSituacao.includes('devolvido')
            }

            return false
          })

          return {
            ...emp,
            itens: filteredItens
          }
        }).filter(emp => emp.itens && emp.itens.length > 0)
      }

      // Sort emprestimos by utente name
      const sortedEmprestimos = [...filteredEmprestimos].sort((a, b) =>
        a.utente.localeCompare(b.utente)
      )

      // Count by situacao
      const situacaoStats: Record<string, number> = {}
      let totalLivros = 0
      let totalMonografias = 0

      sortedEmprestimos.forEach(emp => {
        emp.itens?.forEach(item => {
          const sit = item.situacao.toLowerCase()

          // Normalize situacao names
          let normalizedSit = 'outros'
          if (sit.includes('ativo') || sit.includes('activo')) normalizedSit = 'ativo'
          else if (sit.includes('expirado')) normalizedSit = 'expirado'
          else if (sit.includes('devolvido')) normalizedSit = 'devolvido'

          situacaoStats[normalizedSit] = (situacaoStats[normalizedSit] || 0) + 1

          // Count by tipo de obra
          const tipoObra = item.obra.tipoObra.toLowerCase()
          if (tipoObra.includes('livro')) totalLivros++
          else if (tipoObra.includes('monografia')) totalMonografias++
        })
      })

      const situacaoData = [
        { name: 'Ativo', value: situacaoStats['ativo'] || 0, color: '#198754' },
        { name: 'Devolvido', value: situacaoStats['devolvido'] || 0, color: '#ffc107' },
        { name: 'Expirado', value: situacaoStats['expirado'] || 0, color: '#dc3545' }
      ].filter(item => item.value > 0)

      // Count emprestimos per user
      const userLoans: Record<string, number> = {}
      sortedEmprestimos.forEach(emp => {
        const count = emp.itens?.length || 0
        userLoans[emp.utente] = (userLoans[emp.utente] || 0) + count
      })

      const topUsers = Object.entries(userLoans)
        .map(([utente, count]) => ({ utente, emprestimos: count }))
        .sort((a, b) => b.emprestimos - a.emprestimos)
        .slice(0, 5)

      const totalEmprestimos = sortedEmprestimos.reduce((sum, emp) => sum + (emp.itens?.length || 0), 0)

      return {
        sortedEmprestimos,
        situacaoData,
        topUsers,
        totalEmprestimos,
        totalAtivos: situacaoStats['ativo'] || 0,
        totalExpirados: situacaoStats['expirado'] || 0,
        totalDevolvidos: situacaoStats['devolvido'] || 0,
        totalLivros,
        totalMonografias
      }
    }, [emprestimos, situacao])

    // Empty state
    if (!emprestimos || emprestimos.length === 0 || summary.sortedEmprestimos.length === 0) {
      return (
        <div ref={ref} className="container-fluid p-4" style={{ backgroundColor: '#ffffff', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="card shadow-sm border-0" style={{ borderLeft: '6px solid #0549e9' }}>
            <div className="card-body p-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="text-primary mb-1 fw-bold">Relatório de Empréstimos</h3>
                  <p className="text-muted mb-0 small">Sistema BiblioGere</p>
                </div>
                <div className="col-md-4 text-md-end">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Período do Relatório</small>
                  <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{startDate} - {endDate}</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow border-0 mt-4">
            <div className="card-body text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '5rem', opacity: 0.3 }}></i>
              <h4 className="text-muted mt-4 mb-2">Nenhum Empréstimo Encontrado</h4>
              <p className="text-muted mb-0">
                {situacao
                  ? `Não há empréstimos com situação "${situacao}" para o período selecionado.`
                  : 'Não há empréstimos registrados para o período selecionado.'}
              </p>
            </div>
          </div>

          <div className="card shadow-sm border-0 mt-4" style={{ borderLeft: '4px solid #0549e9' }}>
            <div className="card-body p-2">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <p className="mb-0 fw-bold text-primary" style={{ fontSize: '0.8rem' }}>Sistema BiblioGere</p>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Gestão de Empréstimos Bibliográficos</small>
                </div>
                <div className="col-md-6 text-md-end">
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                    Relatório gerado em: {new Date().toLocaleString('pt-PT')}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className="container-fluid p-2" style={{ backgroundColor: '#ffffff', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
        <style>{`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .card {
              break-inside: avoid;
              page-break-inside: avoid;
            }
            .chart-section {
              page-break-inside: avoid;
            }
            .summary-cards {
              page-break-inside: avoid;
            }
            @page {
              margin: 0.5cm;
            }
            table {
              font-size: 0.7rem !important;
            }
            th, td {
              padding: 0.25rem !important;
            }
          }

          .chart-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }
        `}</style>

        {/* Header */}
        <div className="card shadow-sm mb-2 border-0" style={{ borderLeft: '6px solid #0549e9' }}>
          <div className="card-body p-2">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="text-primary mb-1 fw-bold">Relatório de Empréstimos</h3>
                <p className="text-muted mb-0 small">
                  Sistema BiblioGere
                  {situacao && <span className="ms-2 badge bg-secondary">{situacao}</span>}
                </p>
              </div>
              <div className="col-md-4 text-md-end">
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Período do Relatório</small>
                <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{startDate} - {endDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="row g-2 mb-2 chart-section">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100 chart-container">
              <div className="card-body p-2">
                <h6 className="card-title text-primary fw-bold mb-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-pie-chart me-2"></i>Distribuição por Situação
                </h6>
                {summary.situacaoData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie
                        data={summary.situacaoData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={55}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {summary.situacaoData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-4">Sem dados</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100 chart-container">
              <div className="card-body p-2">
                <h6 className="card-title text-primary fw-bold mb-2" style={{ fontSize: '0.85rem' }}>
                  <i className="bi bi-bar-chart me-2"></i>Top 5 Utentes
                </h6>
                {summary.topUsers.length > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={summary.topUsers} margin={{ top: 5, right: 5, left: 5, bottom: 45 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="utente"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        fontSize={10}
                        stroke="#666"
                      />
                      <YAxis fontSize={10} stroke="#666" />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} iconType="circle" />
                      <Bar
                        dataKey="emprestimos"
                        fill="#0549e9"
                        name="Empréstimos"
                        radius={[8, 8, 0, 0]}
                        label={{ position: 'top', fontSize: 10, fill: '#666' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-4">Sem dados</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-2 mb-2 summary-cards">
          {/* Total Emprestimos - Always show */}
          <div className={situacao ? "col-md-6" : "col-md-3"}>
            <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(135deg, #0549e9 0%, #0d6efd 100%)' }}></div>
              <div className="card-body position-relative p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Total Empréstimos</p>
                    <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalEmprestimos}</h3>
                    <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-journal-text me-1"></i>Registros totais
                    </small>
                  </div>
                  <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                    <i className="bi bi-book text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Show only the filtered status card when situacao prop is present */}
          {!situacao && (
            <>
              <div className="col-md-3">
                <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}></div>
                  <div className="card-body position-relative p-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Ativos</p>
                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalAtivos}</h3>
                        <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                          <i className="bi bi-check-circle-fill me-1"></i>Em andamento
                        </small>
                      </div>
                      <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                        <i className="bi bi-clock-history text-white" style={{ fontSize: '1.2rem' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)' }}></div>
                  <div className="card-body position-relative p-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Devolvidos</p>
                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalDevolvidos}</h3>
                        <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                          <i className="bi bi-arrow-return-left me-1"></i>Concluídos
                        </small>
                      </div>
                      <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                        <i className="bi bi-check2-square text-white" style={{ fontSize: '1.2rem' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                  <div className="position-absolute top-0 start-0 w-100 h-100"
                    style={{ background: 'linear-gradient(135deg, #dc3545 0%, #e35d6a 100%)' }}></div>
                  <div className="card-body position-relative p-2">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Expirados</p>
                        <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalExpirados}</h3>
                        <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                          <i className="bi bi-exclamation-triangle-fill me-1"></i>Necessita atenção
                        </small>
                      </div>
                      <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                        style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                        <i className="bi bi-exclamation-circle text-white" style={{ fontSize: '1.2rem' }}></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Show specific status card when filtered */}
          {situacao?.toLowerCase().includes('activo') && (
            <div className="col-md-6">
              <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}></div>
                <div className="card-body position-relative p-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Ativos</p>
                      <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalAtivos}</h3>
                      <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-check-circle-fill me-1"></i>Em andamento
                      </small>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                      <i className="bi bi-clock-history text-white" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {situacao?.toLowerCase().includes('devolvido') && (
            <div className="col-md-6">
              <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)' }}></div>
                <div className="card-body position-relative p-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Devolvidos</p>
                      <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalDevolvidos}</h3>
                      <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-arrow-return-left me-1"></i>Concluídos
                      </small>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                      <i className="bi bi-check2-square text-white" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {situacao?.toLowerCase().includes('expirado') && (
            <div className="col-md-6">
              <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
                <div className="position-absolute top-0 start-0 w-100 h-100"
                  style={{ background: 'linear-gradient(135deg, #dc3545 0%, #e35d6a 100%)' }}></div>
                <div className="card-body position-relative p-2">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Expirados</p>
                      <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalExpirados}</h3>
                      <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                        <i className="bi bi-exclamation-triangle-fill me-1"></i>Necessita atenção
                      </small>
                    </div>
                    <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                      style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                      <i className="bi bi-exclamation-circle text-white" style={{ fontSize: '1.2rem' }}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tipo de Obra Cards */}
        <div className="row g-2 mb-2">
          <div className="col-md-6">
            <div className="card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #0549e9' }}>
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Livros Emprestados</small>
                    <h4 className="text-primary fw-bold mb-0" style={{ fontSize: '1.2rem' }}>{summary.totalLivros}</h4>
                  </div>
                  <i className="bi bi-book-half text-primary" style={{ fontSize: '1.8rem', opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm h-100 border-0" style={{ borderLeft: '4px solid #198754' }}>
              <div className="card-body p-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Monografias Emprestadas</small>
                    <h4 className="text-success fw-bold mb-0" style={{ fontSize: '1.2rem' }}>{summary.totalMonografias}</h4>
                  </div>
                  <i className="bi bi-files text-success" style={{ fontSize: '1.8rem', opacity: 0.3 }}></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Table */}
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white py-1">
            <h6 className="mb-0 fw-bold" style={{ fontSize: '0.85rem' }}>Detalhes dos Empréstimos</h6>
            <small style={{ fontSize: '0.7rem' }}>Total de {summary.totalEmprestimos} empréstimo{summary.totalEmprestimos !== 1 ? 's' : ''}</small>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-sm mb-0" style={{ fontSize: '0.8rem' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Código</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Utente</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Email</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Data Realização</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Data Devolução</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Situação</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Obra</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Multa</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.sortedEmprestimos.map((emprestimo) =>
                    emprestimo.itens?.map((item, index) => (
                      <tr key={`${emprestimo.codigo}-${item.codigo}-${index}`}>
                        <td className="align-middle">
                          <span className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>#{item.codigo}</span>
                        </td>
                        <td className="align-middle">
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{emprestimo.utente}</div>
                        </td>
                        <td className="align-middle" style={{ fontSize: '0.75rem' }}>
                          <small className="text-muted">{emprestimo.email}</small>
                        </td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>{item.data_realizacao}</td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>{item.data_devolucao}</td>
                        <td className="text-center align-middle">
                          <span className={`badge ${getSituacaoColor(item.situacao)} d-inline-flex align-items-center gap-1`} style={{ fontSize: '0.7rem' }}>
                            <i className={`bi ${getSituacaoIcon(item.situacao)}`}></i>
                            {item.situacao}
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{item.obra.titulo}</div>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>{item.obra.tipoObra}</small>
                        </td>
                        <td className="text-center align-middle">
                          <span className={`fw-bold ${emprestimo.multa > 0 ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '0.75rem' }}>
                            {emprestimo.multa.toFixed(2)} MT
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card shadow-sm border-0 mt-2" style={{ borderLeft: '4px solid #0549e9' }}>
          <div className="card-body p-2">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 fw-bold text-primary" style={{ fontSize: '0.8rem' }}>Sistema BiblioGere</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Gestão de Empréstimos Bibliográficos</small>
              </div>
              <div className="col-md-6 text-md-end">
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                  Relatório gerado em: {new Date().toLocaleString('pt-PT')}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
)

EmprestimoReport.displayName = 'EmprestimoReport'

export default EmprestimoReport
