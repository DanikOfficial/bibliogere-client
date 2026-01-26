import { AtendenteInfo } from "./data/atendenteInterfaces";

export interface UtilizadorPros {
  atendente: AtendenteInfo;
  onApagar: (codigo: number) => void;
  onDesativar: (codigo: number) => void;
}

const Utilizador: React.FC<UtilizadorPros> = ({ atendente, onApagar, onDesativar }) => {
  const { codigo, isActive, nome, username } = atendente;

  return (
    <div className="col-lg-3 col-md-4 col-sm-6 mb-4">
      <div
        className={`
          h-100
          bg-white
          rounded-3
          shadow-sm
          position-relative
          overflow-hidden
          util-card
        `}
        style={{
          transition: 'all 0.3s ease',
          minHeight: '200px'
        }}
      >
        {/* Header with Gradient */}
        <div 
          className="card-header border-0 p-3 position-relative"
          style={{
            background: isActive 
              ? 'linear-gradient(135deg, #4a64d8 0%, #3a56d4 100%)'
              : 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
            minHeight: '80px'
          }}
        >
          <div className="position-relative z-1 text-white">
            <div className="d-flex align-items-center">
              <div className="icon-wrapper me-3">
                <i className="bi bi-person-circle" style={{ fontSize: '1.8rem' }}></i>
              </div>
              <div>
                <h6 className="mb-0 fw-semibold">{nome}</h6>
                <small className="opacity-80">@{username}</small>
              </div>
            </div>
          </div>
          <div className="gradient-overlay"></div>
          
          {/* Status Badge */}
          <div 
            className={`position-absolute top-0 end-0 m-2 rounded-pill px-2 py-1 small fw-semibold ${
              isActive 
                ? "bg-success bg-opacity-25 text-white" 
                : "bg-danger bg-opacity-25 text-white"
            }`}
            style={{ fontSize: '0.7rem' }}
          >
            {isActive ? "Ativo" : "Inativo"}
          </div>
        </div>

        {/* Card Body */}
        <div className="card-body p-3">
          {/* User Info */}
          <div className="mb-3">
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-person text-primary me-2" style={{ fontSize: '0.9rem' }}></i>
              <span className="text-dark small">{nome}</span>
            </div>
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-at text-primary me-2" style={{ fontSize: '0.9rem' }}></i>
              <span className="text-dark small">{username}</span>
            </div>
            <div className="d-flex align-items-center">
              <i className={`bi ${isActive ? "bi-check-circle text-success" : "bi-x-circle text-danger"} me-2`} style={{ fontSize: '0.9rem' }}></i>
              <span className={`small ${isActive ? "text-success" : "text-danger"}`}>
                {isActive ? "Conta ativa" : "Conta desativada"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex gap-2">
            <button
              className={`
                btn
                btn-sm
                d-flex
                align-items-center
                justify-content-center
                flex-1
                transition-all
                ${isActive 
                  ? "btn-outline-warning" 
                  : "btn-outline-success"
                }
              `}
              onClick={() => onDesativar(codigo)}
              style={{
                borderRadius: '6px',
                padding: '6px 10px',
                borderWidth: '1.5px',
                fontWeight: '500',
                fontSize: '0.8rem'
              }}
            >
              <i className={`bi ${isActive ? "bi-pause" : "bi-play"} me-1`}></i>
              {isActive ? "Desativar" : "Ativar"}
            </button>
            
            <button
              className="
                btn
                btn-sm
                btn-outline-danger
                d-flex
                align-items-center
                justify-content-center
                flex-1
                transition-all
              "
              onClick={() => onApagar(codigo)}
              style={{
                borderRadius: '6px',
                padding: '6px 10px',
                borderWidth: '1.5px',
                fontWeight: '500',
                fontSize: '0.8rem'
              }}
            >
              <i className="bi bi-trash me-1"></i>
              Apagar
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .util-card {
          transition: all 0.3s ease;
        }

        .util-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12) !important;
        }

        .elegant-border {
          border: 2px solid;
          border-image: linear-gradient(135deg, #dc3545 0%, #e35d6a 25%, #ff6b7a 50%, #e35d6a 75%, #dc3545 100%) 1;
          box-shadow: 0 0 15px rgba(220, 53, 69, 0.15);
        }

        .util-card.elegant-border:hover {
          box-shadow: 0 8px 25px rgba(220, 53, 69, 0.2) !important;
          border-image: linear-gradient(135deg, #dc3545 0%, #e35d6a 25%, #ff6b7a 50%, #e35d6a 75%, #dc3545 100%) 1;
        }

        .icon-wrapper {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .util-card:hover .icon-wrapper {
          transform: scale(1.05) rotate(3deg);
          background: rgba(255, 255, 255, 0.3);
        }

        .gradient-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(255, 255, 255, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .util-card:hover .gradient-overlay {
          opacity: 1;
        }

        .btn {
          transition: all 0.2s ease;
        }

        .btn:hover {
          transform: translateY(-1px);
        }

        .btn-outline-warning:hover {
          background-color: #ffc107;
          color: #000 !important;
        }
        
        .btn-outline-success:hover {
          background-color: #198754;
          color: #fff !important;
        }
        
        .btn-outline-danger:hover {
          background-color: #dc3545;
          color: #fff !important;
        }
      `}</style>
    </div>
  );
};

export default Utilizador;