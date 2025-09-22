import React, { forwardRef } from 'react'
import { emprestimoRelatorio } from './data'

interface EmprestimoReportProps {}

const EmprestimoReport = forwardRef<HTMLDivElement, EmprestimoReportProps>(
  (props, ref) => {
    const getSituacaoColor = (situacao: string) => {
      switch (situacao) {
        case 'ativo':
          return 'bg-success'; // Green for 'ativo'
        case 'expirado':
          return 'bg-danger'; // Red for 'expirado'
        case 'devolvido':
          return 'bg-warning'; // Yellow for 'devolvido'
        default:
          return '';
      }
    }

    // Sort the emprestimos by the utente property alphabetically
    const sortedEmprestimos = [...emprestimoRelatorio.emprestimos].sort((a, b) =>
      a.utente.localeCompare(b.utente)
    )

    return (
      <div ref={ref} className="container mt-5">
        <div className="report-header">
          <h3 className="text-center text-uppercase text-primary">
            Relatório de Empréstimos
          </h3>
          <p className="text-center">
            <small>Data do Relatório: {emprestimoRelatorio.data}</small>
          </p>
        </div>

        <div className="report-summary mt-4">
          <h4 className="mb-3 text-uppercase text-primary">Resumo do Relatório</h4>
          <div className="row">
            {/* Livros Emprestados and Monografias Emprestadas stacked vertically */}
            <div className="col-md-6 d-flex flex-column">
              <div className="mb-2">
                <strong className="text-secondary">Livros Emprestados: </strong>
                {emprestimoRelatorio.totalLivrosEmprestados}
              </div>
              <div>
                <strong className="text-secondary">Monografias Emprestadas: </strong>
                {emprestimoRelatorio.totalMonografiasEmprestadas}
              </div>
            </div>
            {/* Quantidade related values stacked vertically */}
            <div className="col-md-6 d-flex flex-column align-items-end">
              <div className="mb-2">
                <strong className="text-secondary">Quantidade Disponível Total: </strong>
                {emprestimoRelatorio.totalQuantidadeDisponivel}
              </div>
              <div className="mb-2">
                <strong className="text-secondary">Quantidade Emprestada: </strong>
                {emprestimoRelatorio.quantidadeEmprestada}
              </div>
              <div>
                <strong className="text-secondary">Quantidade Total: </strong>
                {emprestimoRelatorio.totalQuantidade}
              </div>
            </div>
          </div>
        </div>

        <div className="emprestimos-table mt-4">
          <h4>Detalhes dos Empréstimos</h4>
          {/* Removed table-responsive class for fixed-width table */}
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Utente</th>
                <th scope="col">Email</th>
                <th scope="col">Data de Realização</th>
                <th scope="col">Data de Devolução</th>
                <th scope="col">Situação</th>
                <th scope="col">Obra</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmprestimos.map((emprestimo) =>
                emprestimo.itens.map((item, index) => (
                  <tr key={`${emprestimo.codigo}-${index}`}>
                    <td>{emprestimo.codigo}</td>
                    <td>{emprestimo.utente}</td>
                    <td>{emprestimo.email}</td>
                    <td>{item.data_realizacao}</td>
                    <td>{item.data_devolucao}</td>
                    {/* Add the background color based on situacao */}
                    <td className={getSituacaoColor(item.situacao)}>
                      {item.situacao}
                    </td>
                    <td>
                      {item.obra.titulo} - {item.obra.tipoDeObra}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
)

EmprestimoReport.displayName = 'EmprestimoReport'

export default EmprestimoReport
