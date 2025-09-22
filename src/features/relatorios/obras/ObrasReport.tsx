import React, { forwardRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { data } from './data'

// Define types for the props that the Report component will receive

interface ObrasReportProps {}

// Forward ref to the root div element of the component
const ObrasReport = forwardRef<HTMLDivElement, ObrasReportProps>(
  (props, ref) => {
    const {
      obras,
      totalQuantidadeAtual,
      totalQuantidade,
      quantidadeEmFalta,
      date,
    } = data

    return (
      <div className="container my-4" ref={ref}>
        <h3 className="text-center mb-4">Relatório de Obras - {date}</h3>

        {/* Summary Section */}
        <div className="row mb-4">
          <div className="col-sm-4">
            <p className="small">
              <strong>Total Quantidade Atual:</strong> {totalQuantidadeAtual}
            </p>
          </div>
          <div className="col-sm-4">
            <p className="small">
              <strong>Total Quantidade:</strong> {totalQuantidade}
            </p>
          </div>
          <div className="col-sm-4">
            <p className="small">
              <strong>Quantidade em Falta:</strong> {quantidadeEmFalta}
            </p>
          </div>
        </div>

        {/* Detailed Table Section */}
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Ano</th>
              <th>Quantidade Atual</th>
              <th>Quantidade Total</th>
              <th>Faltando</th>
            </tr>
          </thead>
          <tbody>
            {obras.map((obra) => (
              <tr key={obra.codigo}>
                <td>{obra.codigo}</td>
                <td>{obra.titulo}</td>
                <td>{obra.autor}</td>
                <td>{obra.ano}</td>
                <td>{obra.quantidadeAtual}</td>
                <td>{obra.quantidade}</td>
                <td>{obra.quantidade - obra.quantidadeAtual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

export default ObrasReport
