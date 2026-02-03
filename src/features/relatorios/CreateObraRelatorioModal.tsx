import { FC, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '@/app/store'
import { renderEstantesOptions } from '../estantes/EstanteList/business.logic'
import { selectEstantesByTipoEstante } from '../estantes/data/estanteSlice'
import ComboBox from '@/components/reusable/ComboBox'
import { EMPTY, EMPTY_OPTION } from '@/components/reusable/data/Constants'
import { onChangeSelect, onInputChange } from '@/utils/reusable/CommonFormEventsHandler'
import { sendGenerateObraRelatorioRequest } from './business.logic'
import {
  ObraReportRequest,
  GenerateObraReportForm,
  ObraReportErrorResponse,
  defaultGenerateObraReportFormState,
  defaultObraReportErrorResponse,
  initialTipoObraOptionsState
} from '../obra/data/ObraInterfaces'
import { useGenerateObraRelatorioMutation } from '../obra/data/obraApi'

interface CreateObraRelatorioModalInterface {
  toggleGerarObraRelatorioModal: () => void
}

const CreateObraRelatorioModal: FC<CreateObraRelatorioModalInterface> = ({
  toggleGerarObraRelatorioModal,
}) => {
  const navigate = useNavigate()

  const [formState, setFormState] = useState<GenerateObraReportForm>(defaultGenerateObraReportFormState)
  const [errorState, setErrorState] = useState<ObraReportErrorResponse>(defaultObraReportErrorResponse)
  const [generateObraRelatorio, { isLoading }] = useGenerateObraRelatorioMutation()

  // Filter estantes based on selected tipoObra
  const estanteEntities = useSelector((state: RootState) =>
    selectEstantesByTipoEstante(state, formState.tipoObra.label as string)
  )
  const estanteOptions = renderEstantesOptions(estanteEntities)
  const tipoObraOptions = initialTipoObraOptionsState

  const handleGerar = () => {
    const obraRelatorioRequest: ObraReportRequest = {
      dataInicio: formState.dataInicio,
      dataFim: formState.dataFim,
      ...(formState.tipoObra.value && { tipoObra: formState.tipoObra.value as string }),
      ...(formState.estante.label && { nomeEstante: formState.estante.label as string }),
    }

    sendGenerateObraRelatorioRequest(
      obraRelatorioRequest,
      generateObraRelatorio,
      (data) => {
        if (data) {
          navigate('/dashboard/relatorios/obras', {
            state: {
              obras: data,
              startDate: formState.dataInicio,
              endDate: formState.dataFim,
              tipoObra: formState.tipoObra,
              estante: formState.estante
            }
          })
        }
      },
      setErrorState
    )
  }

  const isFormValid = formState.dataInicio && formState.dataFim

  const onChangeEstante = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeSelect(setFormState, name, value, label)

  const onChangeTipoObra = (
    name: string,
    value: string | number,
    label: string = EMPTY
  ) => onChangeSelect(setFormState, name, value, label)

  // Reset estante when tipoObra changes
  useEffect(() => {
    setFormState((prev) => ({ ...prev, estante: EMPTY_OPTION }))
  }, [formState.tipoObra])

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop-custom"
        onClick={toggleGerarObraRelatorioModal}
      />

      {/* Modal */}
      <div className="modal-container-custom">
        <div className="modal-content-custom">
          {/* Close button */}
          <button
            type="button"
            className="modal-close-btn"
            onClick={toggleGerarObraRelatorioModal}
            aria-label="Fechar"
          >
            <i className="bi bi-x-lg"></i>
          </button>

          {/* Header with icon */}
          <div className="modal-header-custom">
            <div className="icon-wrapper">
              <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="modal-title">Gerar Relatório de Obras</h2>
            <p className="modal-subtitle">Configure os filtros para visualizar o relatório detalhado</p>
          </div>

          {/* Top-level error message */}
          {(errorState.error || errorState.message) && (
            <div className="error-banner">
              <i className="bi bi-exclamation-triangle-fill"></i>
              <span><strong>Erro:</strong> {errorState.message}</span>
            </div>
          )}

          {/* Info banner */}
          <div className="info-banner">
            <i className="bi bi-info-circle"></i>
            <span>Selecione o período e os filtros opcionais para gerar o relatório</span>
          </div>

          {/* Form */}
          <div className="modal-form">
            {/* Date Range Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="bi bi-calendar-range"></i>
                <span>Período do Relatório</span>
              </div>

              <div className="date-inputs-grid">
                <div className="form-group">
                  <label htmlFor="dataInicio" className="form-label">
                    <i className="bi bi-calendar-check me-1"></i>
                    Data Inicial
                  </label>
                  <input
                    type="date"
                    className={`form-input ${errorState.errors?.dataInicio ? 'input-error' : ''}`}
                    name="dataInicio"
                    id="dataInicio"
                    value={formState.dataInicio}
                    onChange={(e) => onInputChange(e, setFormState)}
                    placeholder="Selecione a data inicial"
                  />
                  {errorState.errors?.dataInicio && (
                    <span className="field-error">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errorState.errors.dataInicio}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="dataFim" className="form-label">
                    <i className="bi bi-calendar-x me-1"></i>
                    Data Final
                  </label>
                  <input
                    type="date"
                    className={`form-input ${errorState.errors?.dataFim ? 'input-error' : ''}`}
                    name="dataFim"
                    id="dataFim"
                    value={formState.dataFim}
                    onChange={(e) => onInputChange(e, setFormState)}
                    placeholder="Selecione a data final"
                  />
                  {errorState.errors?.dataFim && (
                    <span className="field-error">
                      <i className="bi bi-exclamation-circle me-1"></i>
                      {errorState.errors.dataFim}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Tipo de Obra Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="bi bi-bookmark"></i>
                <span>Tipo de Obra (Opcional)</span>
              </div>

              <div className="form-group">
                <ComboBox
                  id="tipoObra"
                  label="Selecione um tipo"
                  color="primary"
                  value={formState.tipoObra}
                  name="tipoObra"
                  options={tipoObraOptions}
                  onChange={onChangeTipoObra}
                />
              </div>
            </div>

            {/* Estante Section */}
            <div className="form-section">
              <div className="section-header">
                <i className="bi bi-bookshelf"></i>
                <span>Filtrar por Estante (Opcional)</span>
              </div>

              <div className="form-group">
                <ComboBox
                  id="estante"
                  label="Selecione uma estante"
                  color="primary"
                  value={formState.estante}
                  name="estante"
                  options={estanteOptions}
                  onChange={onChangeEstante}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary-custom"
              onClick={toggleGerarObraRelatorioModal}
              disabled={isLoading}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancelar
            </button>

            <button
              type="button"
              className="btn-primary-custom"
              onClick={handleGerar}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <i className="bi bi-arrow-clockwise rotate me-2"></i>
                  Gerando...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-bar-graph me-2"></i>
                  Gerar Relatório
                  <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>

          {/* Footer hint */}
          <div className="modal-footer-hint">
            <i className="bi bi-lightbulb"></i>
            <span>O relatório incluirá todas as obras do período selecionado</span>
          </div>
        </div>
      </div>

      <style>{`
        .modal-backdrop-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1040;
          animation: fadeIn 0.2s ease-out;
          overflow: hidden;
        }

        .modal-container-custom {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          padding: 1rem;
          animation: slideUp 0.3s ease-out;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .modal-content-custom {
          background: white;
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          width: 100%;
          max-width: 600px;
          max-height: calc(100vh - 2rem);
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          margin: auto;
        }

        .modal-close-btn {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          border: none;
          background: #f3f4f6;
          color: #6b7280;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          z-index: 10;
        }

        .modal-close-btn:hover {
          background: #e5e7eb;
          color: #374151;
          transform: rotate(90deg);
        }

        .modal-header-custom {
          text-align: center;
          padding: 2.5rem 2rem 1.5rem;
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          border-radius: 1.5rem 1.5rem 0 0;
          color: white;
        }

        .icon-wrapper {
          width: 4rem;
          height: 4rem;
          margin: 0 auto 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .icon {
          width: 2rem;
          height: 2rem;
          color: white;
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: white;
        }

        .modal-subtitle {
          font-size: 0.95rem;
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 400;
        }

        .error-banner {
          margin: 1.5rem 2rem 0;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          border-left: 4px solid #dc2626;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #991b1b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .error-banner i {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .info-banner {
          margin: 1.5rem 2rem;
          padding: 1rem 1.25rem;
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
          border-left: 4px solid #007bff;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #1e40af;
          font-size: 0.9rem;
        }

        .info-banner i {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .modal-form {
          padding: 0 2rem 1.5rem;
        }

        .form-section {
          margin-bottom: 2rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #007bff;
          font-weight: 600;
          font-size: 1rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .section-header i {
          font-size: 1.1rem;
        }

        .date-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 576px) {
          .date-inputs-grid {
            grid-template-columns: 1fr;
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
        }

        .form-input:hover:not(:focus) {
          border-color: #cbd5e1;
        }

        .form-input.input-error {
          border-color: #dc2626;
        }

        .form-input.input-error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        .field-error {
          display: flex;
          align-items: center;
          margin-top: 0.5rem;
          color: #dc2626;
          font-size: 0.825rem;
          font-weight: 500;
        }

        .field-error i {
          font-size: 0.875rem;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 0 2rem 1.5rem;
        }

        .btn-secondary-custom,
        .btn-primary-custom {
          flex: 1;
          padding: 0.875rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
        }

        .btn-secondary-custom {
          background: #f3f4f6;
          color: #6b7280;
        }

        .btn-secondary-custom:hover:not(:disabled) {
          background: #e5e7eb;
          color: #374151;
        }

        .btn-secondary-custom:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .btn-primary-custom {
          background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
        }

        .btn-primary-custom:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
        }

        .btn-primary-custom:active:not(:disabled) {
          transform: translateY(0);
        }

        .btn-primary-custom:disabled {
          background: #cbd5e1;
          color: #94a3b8;
          cursor: not-allowed;
          box-shadow: none;
        }

        .modal-footer-hint {
          padding: 1rem 2rem 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
          margin: 0 2rem;
        }

        .modal-footer-hint i {
          color: #fbbf24;
          font-size: 1rem;
        }

        .rotate {
          animation: rotate 1s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Scrollbar styling */
        .modal-content-custom::-webkit-scrollbar {
          width: 8px;
        }

        .modal-content-custom::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 0 1.5rem 1.5rem 0;
        }

        .modal-content-custom::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        .modal-content-custom::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </>
  )
}

export default CreateObraRelatorioModal
