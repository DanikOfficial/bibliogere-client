import { AtendenteInfo } from "./data/atendenteInterfaces";

export interface UtilizadorPros {
  atendente: AtendenteInfo;
  onApagar: (codigo: number) => void;
  onDesativar: (codigo: number) => void;
}

const Utilizador: React.FC<UtilizadorPros> = ({ atendente, onApagar, onDesativar }) => {
  const { codigo, isActive, nome, username } = atendente;

  return (
    <div
      className={`col-lg- col-md-3
        bg-white
        p-3
        custom-radius
        card-shadow
        ${isActive ? "" : "border border-danger"}
        mb-3
        me-5
      `} 
    >
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Nome:</span>
        <span className="text-secondary">{nome}</span>
      </p>
      <p className="mb-1">
        <span className="text-primary fw-bold me-1">Utilizador:</span>
        <span className="text-secondary">{username}</span>
      </p>
      <p className="mb-3">
        <span className="text-primary fw-bold me-1">Situação:</span>
        <span className="text-secondary">{isActive ? "Activo" : "Desativado"}</span>
      </p>
      <div id="actions" className="d-flex flex-wrap mb-2">
        <button
          className="
            btn
            shadow-none
            btn-primary
            custom-btn
            d-flex
            align-items-center
            me-3
          "
          onClick={() => onDesativar(codigo)}
        >
          <span className="me-1">Desativar</span>
          <i className="bi bi-x-octagon"></i>
        </button>
        
        <button
          className="
            btn
            shadow-none
            btn-danger
            text-light
            custom-btn
            d-flex
            align-items-center
          "
          onClick={() => onApagar(codigo)}
        >
          <span className="me-1">Apagar</span>
          <i className="bi bi-trash text-light"></i>
        </button>
      </div>
    </div>
  );
};

export default Utilizador;
