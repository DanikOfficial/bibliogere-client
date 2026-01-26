import React, { FC, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAllQuestoes } from '../user/questaoSlice';
import { renderQuestoes } from '../user/data/business.logic';
import ComboBox from '../../components/reusable/ComboBox';
import { onChangeSelect, onInputChange } from '../../utils/reusable/CommonFormEventsHandler';
import { EMPTY } from '../../components/reusable/data/Constants';
import { AlterarQuestoesErroResponse, AlterarQuestoesForm, AtualizarQuestoesRequest, defaultAlterarQuestaoRequest, defaultAlterarQuestoesErrorResponse, defaultAlterarQuestoesForm } from '../user/data/userInterfaces';
import ControlledInput from '../../components/reusable/ControlledInput';
import { selectCurrentUserData } from '../user/userSlice';
import { useSaveQuestoesMutation } from '../../app/services/userApi';
import { sendUpdateQuestoesRequest } from './data/business.logic';
import toast from 'react-hot-toast';

export interface AtualizarQuestoesModalProps {
    close: () => void
}

const AtualizarQuestoesModal: FC<AtualizarQuestoesModalProps> = ({ close }) => {
    const { codigo } = useAppSelector(selectCurrentUserData)
    const questoesState = useAppSelector(selectAllQuestoes)
    const [formState, setFormState] = useState<AlterarQuestoesForm>(defaultAlterarQuestoesForm)
    const [error, setError] = useState<AlterarQuestoesErroResponse>(defaultAlterarQuestoesErrorResponse)
    const [saveQuestoes, { isLoading, isError }] = useSaveQuestoesMutation()

    const questoesOptions = renderQuestoes(questoesState.questoes)

    const onChangeQuestao = (
        name: string,
        value: string | number,
        label: string = EMPTY
    ) => onChangeSelect(setFormState, name, value, label)

    const onConfirm = () => {
        const atualizarQuestoesRequest: AtualizarQuestoesRequest = {
            codigoUtilizador: codigo || 0,
            primeiraQuestao: formState.primeiraQuestao.value as string,
            primeiraResposta: formState.primeiraResposta as string,
            segundaQuestao: formState.segundaQuestao.value as string,
            segundaResposta: formState.segundaResposta,
            updating: true
        }

        sendUpdateQuestoesRequest(atualizarQuestoesRequest, saveQuestoes, setError, (isSuccess) => {
            if (isSuccess) {
                toast.success("Questões Atualizadas com sucesso.", { duration: 3000 })
                close()
            }
        })
    }

    const isFormValid = formState.primeiraQuestao.value && formState.primeiraResposta.trim() &&
        formState.segundaQuestao.value && formState.segundaResposta.trim();

    return (
        <>
            {/* Backdrop */}
            <div className="modal-backdrop-custom" onClick={close} />

            {/* Modal */}
            <div className="modal-container-custom">
                <div className="modal-content-custom">
                    {/* Close button */}
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={close}
                        aria-label="Fechar"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>

                    {/* Header with icon */}
                    <div className="modal-header-custom">
                        <div className="icon-wrapper">
                            <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="modal-title">Atualizar Questões de Segurança</h2>
                        <p className="modal-subtitle">Escolha novas questões e respostas para sua conta</p>
                    </div>

                    {/* Top-level error message */}
                    {(isError || error.error) && error.message && (
                        <div className="error-banner">
                            <i className="bi bi-exclamation-triangle-fill"></i>
                            <span>{error.message}</span>
                        </div>
                    )}

                    {/* Info banner */}
                    <div className="info-banner">
                        <i className="bi bi-info-circle"></i>
                        <span>Escolha duas novas questões de segurança e forneça as respostas. Estas questões serão usadas para recuperar a sua conta no futuro.</span>
                    </div>

                    {/* Form */}
                    <div className="modal-form">
                        {/* Primeira Questão */}
                        <div className="form-section">
                            <div className="section-header">
                                <i className="bi bi-1-circle-fill"></i>
                                <span>Primeira Questão</span>
                            </div>

                            <div className="form-group">
                                <ComboBox
                                    id="primeiraQuestao"
                                    label="Escolha a primeira questão"
                                    color="primary"
                                    value={formState.primeiraQuestao}
                                    name="primeiraQuestao"
                                    options={questoesOptions}
                                    onChange={onChangeQuestao}
                                    error={error.errors?.primeiraQuestao}
                                />
                            </div>

                            <div className="form-group">
                                <ControlledInput
                                    name="primeiraResposta"
                                    color="primary"
                                    value={formState.primeiraResposta}
                                    id="primeiraResposta"
                                    label="Sua resposta"
                                    onChange={(event) => onInputChange(event, setFormState)}
                                    placeholder="Digite a resposta da primeira questão"
                                    error={error.errors?.primeiraResposta}
                                    type="text"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Segunda Questão */}
                        <div className="form-section">
                            <div className="section-header">
                                <i className="bi bi-2-circle-fill"></i>
                                <span>Segunda Questão</span>
                            </div>

                            <div className="form-group">
                                <ComboBox
                                    id="segundaQuestao"
                                    label="Escolha a segunda questão"
                                    color="primary"
                                    value={formState.segundaQuestao}
                                    name="segundaQuestao"
                                    options={questoesOptions}
                                    onChange={onChangeQuestao}
                                    error={error.errors?.segundaQuestao}
                                />
                            </div>

                            <div className="form-group">
                                <ControlledInput
                                    name="segundaResposta"
                                    color="primary"
                                    value={formState.segundaResposta}
                                    id="segundaResposta"
                                    label="Sua resposta"
                                    onChange={(event) => onInputChange(event, setFormState)}
                                    placeholder="Digite a resposta da segunda questão"
                                    error={error.errors?.segundaResposta}
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-secondary-custom"
                            onClick={close}
                            disabled={isLoading}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Cancelar
                        </button>

                        <button
                            type="button"
                            className="btn-primary-custom"
                            onClick={onConfirm}
                            disabled={isLoading || !isFormValid}
                        >
                            {isLoading ? (
                                <>
                                    <i className="bi bi-arrow-clockwise rotate me-2"></i>
                                    Atualizando...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Atualizar Questões
                                    <i className="bi bi-arrow-right ms-2"></i>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Footer hint */}
                    <div className="modal-footer-hint">
                        <i className="bi bi-shield-check"></i>
                        <span>Suas questões de segurança serão atualizadas de forma segura</span>
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

                .form-group {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 1rem;
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

                .btn-primary-custom:disabled,
                .btn-secondary-custom:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
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
                    from { opacity: 0; }
                    to { opacity: 1; }
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
    );
};

export default AtualizarQuestoesModal;
