import { ObraEntity } from '@/features/obra/data/ObraInterfaces'
import { forwardRef, useMemo } from 'react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import 'bootstrap/dist/css/bootstrap.min.css'

interface ObrasReportProps {
  obras: ObraEntity[]
  startDate?: string
  endDate?: string
  tipoObra?: string
  estante?: string
}

const ObrasReport = forwardRef<HTMLDivElement, ObrasReportProps>(
  ({ obras = [], startDate, endDate, tipoObra, estante }, ref) => {
    const summary = useMemo(() => {
      const totalQuantidadeAtual = obras.reduce((sum, obra) => sum + (obra.quantidadeAtual || 0), 0)
      const totalQuantidade = obras.reduce((sum, obra) => sum + (obra.quantidadeInicial || 0), 0)
      const quantidadeEmFalta = Math.max(0, totalQuantidade - totalQuantidadeAtual)

      // Group by author
      const byAuthor = obras.reduce((acc, obra) => {
        const autor = obra.autor || 'Desconhecido'
        if (!acc[autor]) {
          acc[autor] = { total: 0, emStock: 0 }
        }
        acc[autor].total += obra.quantidadeInicial || 0
        acc[autor].emStock += obra.quantidadeAtual || 0
        return acc
      }, {} as Record<string, { total: number; emStock: number }>)

      const topAuthors = Object.entries(byAuthor)
        .map(([autor, data]) => ({ autor, ...data }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 5)

      // Status distribution for pie chart
      const statusData = [
        { name: 'Em Stock', value: totalQuantidadeAtual, color: '#0549e9' },
        { name: 'Em Falta', value: quantidadeEmFalta, color: '#ffc107' }
      ].filter(item => item.value > 0)

      return {
        totalQuantidadeAtual,
        totalQuantidade,
        quantidadeEmFalta,
        topAuthors,
        statusData
      }
    }, [obras])

    const displayStartDate = startDate || new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    const displayEndDate = endDate || new Date().toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    // Empty state
    if (!obras || obras.length === 0) {
      return (
        <div ref={ref} className="container-fluid p-4" style={{ backgroundColor: '#ffffff', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
          <div className="card shadow-sm border-0" style={{ borderLeft: '6px solid #0549e9' }}>
            <div className="card-body p-3">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="text-primary mb-1 fw-bold">Relatório de Obras</h3>
                  <p className="text-muted mb-0 small">Sistema BiblioGere</p>
                </div>
                <div className="col-md-4 text-md-end">
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Período do Relatório</small>
                  <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{displayStartDate} - {displayEndDate}</strong>
                  {tipoObra && (
                    <div className="mt-1">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Tipo de Obra</small>
                      <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{tipoObra}</strong>
                    </div>
                  )}
                  {estante && (
                    <div className="mt-1">
                      <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Estante</small>
                      <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{estante}</strong>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow border-0 mt-4">
            <div className="card-body text-center py-5">
              <i className="bi bi-book text-muted" style={{ fontSize: '5rem', opacity: 0.3 }}></i>
              <h4 className="text-muted mt-4 mb-2">Nenhuma Obra Encontrada</h4>
              <p className="text-muted mb-0">Não há obras cadastradas no sistema para o período selecionado.</p>
            </div>
          </div>

          <div className="card shadow-sm border-0 mt-4" style={{ borderLeft: '4px solid #0549e9' }}>
            <div className="card-body p-2">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <p className="mb-0 fw-bold text-primary" style={{ fontSize: '0.8rem' }}>Sistema BiblioGere</p>
                  <small className="text-muted" style={{ fontSize: '0.7rem' }}>Gestão de Obras Bibliográficas</small>
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
      <div ref={ref} className="container-fluid p-3" style={{ backgroundColor: '#ffffff', minHeight: '100vh', maxWidth: '1400px', margin: '0 auto' }}>
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
            .no-print { display: none !important; }
            .print-border {
              border: 1px solid #dee2e6 !important;
            }
          }

          .text-white {
            color: #fff !important;
          }

          .chart-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
          }
        `}</style>
        {/* Header */}
        <div className="card shadow-sm mb-3 border-0" style={{ borderLeft: '6px solid #0549e9' }}>
          <div className="card-body p-3">
            <div className="row align-items-center">
              <div className="col-md-8">
                <h3 className="text-primary mb-1 fw-bold">Relatório de Obras</h3>
                <p className="text-muted mb-0 small">Sistema BiblioGere</p>
                {/* Filters Applied Section */}
                {(tipoObra || estante) && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {tipoObra && (
                      <span className="badge bg-primary bg-opacity-10 text-primary border border-primary" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                        <i className="bi bi-bookmark-fill me-1"></i>
                        Tipo: {tipoObra}
                      </span>
                    )}
                    {estante && (
                      <span className="badge bg-success bg-opacity-10 text-success border border-success" style={{ fontSize: '0.75rem', fontWeight: '500' }}>
                        <i className="bi bi-bookshelf me-1"></i>
                        Estante: {estante}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="col-md-4 text-md-end">
                <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Período do Relatório</small>
                <strong className="text-primary" style={{ fontSize: '0.85rem' }}>{displayStartDate} - {displayEndDate}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="row g-2 mb-3">
          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100 chart-container print-border">
              <div className="card-body p-3">
                <h6 className="card-title text-primary fw-bold mb-3" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-pie-chart me-2"></i>Distribuição de Stock
                </h6>
                {summary.statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={summary.statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent, value }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                      >
                        {summary.statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center text-muted py-4">Sem dados</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card shadow-sm border-0 h-100 chart-container print-border">
              <div className="card-body p-3">
                <h6 className="card-title text-primary fw-bold mb-3" style={{ fontSize: '0.9rem' }}>
                  <i className="bi bi-bar-chart me-2"></i>Top 5 Autores
                </h6>
                {summary.topAuthors.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={summary.topAuthors} margin={{ top: 5, right: 5, left: 5, bottom: 60 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                      <XAxis
                        dataKey="autor"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                        fontSize={10}
                        stroke="#666"
                      />
                      <YAxis fontSize={10} stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.98)',
                          border: '2px solid #ddd',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}
                      />
                      <Legend
                        wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                        iconType="circle"
                      />
                      <Bar
                        dataKey="total"
                        fill="#0549e9"
                        name="Total"
                        radius={[8, 8, 0, 0]}
                        label={{ position: 'top', fontSize: 10, fill: '#666' }}
                      />
                      <Bar
                        dataKey="emStock"
                        fill="#198754"
                        name="Em Stock"
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
        <div className="row g-2 mb-3">
          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(135deg, #0549e9 0%, #0d6efd 100%)' }}></div>
              <div className="card-body position-relative p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Total em Stock</p>
                    <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalQuantidadeAtual}</h3>
                    <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-check-circle-fill me-1"></i>
                      Livros disponíveis
                    </small>
                  </div>
                  <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                    <i className="bi bi-box-seam text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)' }}></div>
              <div className="card-body position-relative p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Quantidade Total</p>
                    <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.totalQuantidade}</h3>
                    <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-journal-bookmark-fill me-1"></i>
                      Total cadastrado
                    </small>
                  </div>
                  <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                    <i className="bi bi-collection text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm h-100 border-0 position-relative overflow-hidden">
              <div className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)' }}></div>
              <div className="card-body position-relative p-2">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-white mb-1 fw-semibold" style={{ fontSize: '0.7rem' }}>Em Falta</p>
                    <h3 className="text-white fw-bold mb-1" style={{ fontSize: '1.5rem' }}>{summary.quantidadeEmFalta}</h3>
                    <small className="text-white opacity-75" style={{ fontSize: '0.65rem' }}>
                      <i className="bi bi-exclamation-circle-fill me-1"></i>
                      {summary.totalQuantidade > 0
                        ? `${((summary.quantidadeEmFalta / summary.totalQuantidade) * 100).toFixed(1)}% do total`
                        : 'N/A'}
                    </small>
                  </div>
                  <div className="bg-white bg-opacity-25 rounded-3 d-flex align-items-center justify-content-center"
                    style={{ width: '44px', height: '44px', minWidth: '44px' }}>
                    <i className="bi bi-clipboard-x text-white" style={{ fontSize: '1.2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="card shadow border-0">
          <div className="card-header bg-primary text-white py-2">
            <h6 className="mb-0 fw-bold">Detalhes das Obras</h6>
            <small style={{ fontSize: '0.75rem' }}>Total de {obras.length} obra{obras.length !== 1 ? 's' : ''} cadastrada{obras.length !== 1 ? 's' : ''}</small>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover table-sm mb-0" style={{ fontSize: '0.8rem' }}>
                <thead className="table-light">
                  <tr>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Cód.</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Título</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Autor</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Ano</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Estante</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-uppercase fw-bold">Localização</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Stock</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Total</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Falta</th>
                    <th style={{ fontSize: '0.7rem' }} className="text-center text-uppercase fw-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {obras.map((obra, index) => {
                    const faltando = (obra.quantidadeInicial || 0) - (obra.quantidadeAtual || 0)
                    const percentagemStock = obra.quantidadeInicial > 0
                      ? ((obra.quantidadeAtual / obra.quantidadeInicial) * 100).toFixed(0)
                      : 0

                    return (
                      <tr key={obra.codigo || index}>
                        <td className="align-middle">
                          <span className="text-primary fw-bold" style={{ fontSize: '0.75rem' }}>#{obra.codigo}</span>
                        </td>
                        <td className="align-middle">
                          <div className="fw-bold" style={{ fontSize: '0.8rem' }}>{obra.titulo}</div>
                          {obra.editora && (
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>{obra.editora}</small>
                          )}
                        </td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>{obra.autor}</td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>{obra.ano}</td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>
                          {obra.nomeEstante || obra.estante?.nome || '-'}
                        </td>
                        <td className="align-middle" style={{ fontSize: '0.8rem' }}>
                          {obra.localizacaoDesignacao || obra.localizacao?.designacao || '-'}
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge bg-primary rounded-pill" style={{ fontSize: '0.7rem' }}>
                            {obra.quantidadeAtual || 0}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span className="badge bg-success rounded-pill" style={{ fontSize: '0.7rem' }}>
                            {obra.quantidadeInicial || 0}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <span className={`badge rounded-pill ${faltando > 0 ? 'bg-warning text-dark' : 'bg-secondary'
                            }`} style={{ fontSize: '0.7rem' }}>
                            {Math.max(0, faltando)}
                          </span>
                        </td>
                        <td className="text-center align-middle">
                          <div className="d-flex align-items-center justify-content-center gap-1">
                            <div className="progress" style={{ width: '60px', height: '6px' }}>
                              <div
                                className={`progress-bar ${Number(percentagemStock) >= 75 ? 'bg-success' :
                                  Number(percentagemStock) >= 50 ? 'bg-primary' :
                                    Number(percentagemStock) >= 25 ? 'bg-warning' : 'bg-danger'
                                  }`}
                                role="progressbar"
                                style={{ width: `${percentagemStock}%` }}
                                aria-valuenow={Number(percentagemStock)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              />
                            </div>
                            <small className="text-muted" style={{ fontSize: '0.65rem' }}>{percentagemStock}%</small>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="card shadow-sm border-0 mt-3" style={{ borderLeft: '4px solid #0549e9' }}>
          <div className="card-body p-2">
            <div className="row align-items-center">
              <div className="col-md-6">
                <p className="mb-0 fw-bold text-primary" style={{ fontSize: '0.8rem' }}>Sistema BiblioGere</p>
                <small className="text-muted" style={{ fontSize: '0.7rem' }}>Gestão de Obras Bibliográficas</small>
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

ObrasReport.displayName = 'ObrasReport'

export default ObrasReport
