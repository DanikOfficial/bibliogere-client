import { useState } from "react"

const NovaEstante: React.FC = () => {
    const [isCreating, setIsCreating] = useState<Boolean>(false)

  return (
    <>
      <div id="nova-estante-wrapper" className="mb-3">
        <button
          className="
                btn
                shadow-none
                btn-primary
                custom-height-btn
                d-flex
                align-items-center
                shadow-none
              "
        >
          <span>Nova Estante</span>
          <i className="ms-2 bi bi-plus-square fs-5"></i>
        </button>
      </div>
      <section
        id="nova-estante-section"
        className="custom-radius bg-white py-2 px-3 mb-2 d-block"
      >

        {isCreating && <div className="row mb-2">
          <div className="col-lg-4">
            <input
              type="text"
              className="
                    form-control
                    shadow-none
                    placeholder-primary
                    border-end-0
                    border-top-0
                    border-start-0
                    border-2
                    border-secondary
                    text-secondary
                  "
              id="nome-estante"
              placeholder="Digite o nome da Estante!"
            />
          </div>
          <div className="col-lg-3 mb-2">
            <select
              name=""
              id="tipo-estante"
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
                  "
            >
              <option value="">Escolha o tipo de Estante!</option>
              <option value="Livro">Monografia</option>
              <option value="Monografia">Livro</option>
            </select>
          </div>
          <div className="col-lg-5 d-flex align-items-start">
            <button
              className="
                    btn
                    shadow-none
                    btn-primary
                    d-flex
                    align-items-center
                    me-4
                  "
            >
              <span>Confirmar</span>
              <i className="bi bi-save text-light ms-2"></i>
            </button>
            <button
              className="
                    btn
                    shadow-none
                    btn-danger
                    text-light
                    d-flex
                    align-items-center
                    me-2
                  "
            >
              <span>Cancelar</span>
              <i className="bi bi-x-square ms-2"></i>
            </button>
          </div>
        </div>}

        
      </section>
    </>
  )
}

export default NovaEstante
