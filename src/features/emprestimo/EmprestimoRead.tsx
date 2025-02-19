import React, { forwardRef } from "react";
import { EmprestimoEntityResponse } from "./data/EmprestimoInterfaces";

interface ItemEmprestimoInterface {
  data: EmprestimoEntityResponse;
}

const EmprestimoRead = forwardRef<HTMLDivElement, ItemEmprestimoInterface>(
  ({ data }, ref) => {
    const { utente, contacto, email, itens } = data;

    return (
      <div className="container mt-4" ref={ref}>
        <div className="card shadow-lg" style={{ fontSize: "0.8rem" }}>
          <div className="card-header bg-primary text-white text-center">
            <h4 className="mb-1" style={{ fontSize: "1rem" }}>
              Recibo de Empréstimo
            </h4>
            <p className="mb-0" style={{ fontSize: "0.9rem" }}>
              Informações do Empréstimo - Utente: {utente}
            </p>
          </div>
          <div className="card-body">
            <div className="row">
              {/* User Info */}
              <div className="col-md-6">
                <h6 className="text-primary mb-1">Utente</h6>
                <p className="mb-1">
                  <strong>Utente:</strong> {utente}
                </p>
                <p className="mb-1">
                  <strong>Contacto:</strong> {contacto}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {email}
                </p>
              </div>
              <div className="col-md-6">
                <h6 className="text-primary mb-1">Detalhes do Item</h6>
                {itens.map((item, index) => {
                  const { codigo: itemCodigo, obra, situacao, data_devolucao, data_realizacao } = item;
                  const { titulo, autor, tipoObra, editora, nomeEstante, localizacaoDesignacao } = obra;

                  return (
                    <div key={index} className="mb-3">
                      <p className="mb-1">
                        <strong>Código:</strong> {itemCodigo}
                      </p>
                      <p className="mb-1">
                        <strong>Titulo:</strong> {titulo}
                      </p>
                      <p className="mb-1">
                        <strong>Autor:</strong> {autor}
                      </p>
                      <p className="mb-1">
                        <strong>Tipo:</strong> {tipoObra}
                      </p>
                      <p className="mb-1">
                        <strong>Editora:</strong> {editora}
                      </p>
                      <p className="mb-1">
                        <strong>Estante:</strong> {nomeEstante}
                      </p>
                      <p className="mb-1">
                        <strong>Localização:</strong> {localizacaoDesignacao}
                      </p>
                      <div className="row mt-2">
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>Data de Realização:</strong> {new Date(data_realizacao).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>Data de Devolução:</strong> {new Date(data_devolucao).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="mb-1">
                        <strong>Situacão:</strong> {situacao}
                      </p>
                      <hr className="my-2" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="card-footer text-center bg-light">
            <p className="text-muted mb-0" style={{ fontSize: "0.75rem" }}>
              Obrigado por utilizar os nossos serviços!
            </p>
          </div>
        </div>
      </div>
    );
  }
);

export default EmprestimoRead;
