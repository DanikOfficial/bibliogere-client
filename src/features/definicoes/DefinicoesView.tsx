import React, { useState } from 'react';
import SectionName from '../../components/dashboard/SectionName';
import AlterarSenhaModal, { AlterarSenhaModalProps } from './AlterarSenhaModal';
import ValidarQuestoesModal, { ValidarQuestoesModalProps } from './ValidarQuestoesModal';
import AtualizarQuestoesModal, { AtualizarQuestoesModalProps } from './AtualizarQuestoesModal';
import toast from 'react-hot-toast';

const DefinicoesView: React.FC = () => {
    const [isAlterarSenhaModalVisible, setIsAlterarSenhaModalVisible] = useState<Boolean>(false);
    const [isAlterarQuestoesModalVisible, setIsAlterarQuestoesModalVisible] = useState<Boolean>(false);
    const [isValidarQuestoesModalVisible, setIsValidarQuestoesModalVisible] = useState<Boolean>(false);

    const alterarSenhaModalProps: AlterarSenhaModalProps = {
        close: () => {
            toggleAlterarSenhaModal()
        }
    }

    const validarQuestoesModal: ValidarQuestoesModalProps = {
        close() {
            toggleValidarQuestoesModal()
        },
        GoToUpdate() {
            toggleValidarQuestoesModal()
            toggleAlterarQuestoesModal()
            toast.success("Pode agora alterar as suas questões de segurança na próxima janela.", { duration: 2000 })
        },
    }

    const atualizarQuestoesModalProps: AtualizarQuestoesModalProps = {
        close: () => {
            toggleAlterarQuestoesModal();
        }
    }

    const toggleAlterarSenhaModal = () => {
        setIsAlterarSenhaModalVisible(prev => !prev)
    }

    const toggleValidarQuestoesModal = () => {
        setIsValidarQuestoesModalVisible(prev => !prev)
    }

    const toggleAlterarQuestoesModal = () => {
        setIsAlterarQuestoesModalVisible(prev => !prev)
    }

    const settingsCards = [
        {
            id: 'password',
            icon: 'bi-shield-lock',
            title: 'Alterar Senha',
            description: 'Atualize sua senha de acesso',
            gradient: 'linear-gradient(135deg, #3a56d4 0%, #2e46b8 100%)',
            onClick: toggleAlterarSenhaModal
        },
        {
            id: 'security',
            icon: 'bi-patch-question',
            title: 'Questões de Segurança',
            description: 'Gerir questões de recuperação',
            gradient: 'linear-gradient(135deg, #4f6beb 0%, #3a56d4 100%)',
            onClick: toggleValidarQuestoesModal
        }
    ];

    return (
        <>
            {isAlterarSenhaModalVisible && <AlterarSenhaModal {...alterarSenhaModalProps} />}
            {isValidarQuestoesModalVisible && <ValidarQuestoesModal  {...validarQuestoesModal} />}
            {isAlterarQuestoesModalVisible && <AtualizarQuestoesModal {...atualizarQuestoesModalProps} />}

            <section id="definicoes" className="col pt-3 px-3">
                <div className="mb-4">
                    <SectionName
                        align="center"
                        withIcon="bi-shield-check"
                        subtitle="Gerir configurações de segurança da sua conta"
                    >
                        Definições de Utilizador
                    </SectionName>                   
                </div>

                <div className="row g-4">
                    {settingsCards.map((card) => (
                        <div key={card.id} className="col-lg-6 col-xl-4">
                            <button
                                className="settings-card w-100 border-0 text-start p-0"
                                onClick={card.onClick}
                            >
                                <div className="card border-0 shadow-sm h-100 overflow-hidden">
                                    <div
                                        className="card-header border-0 p-4 position-relative"
                                        style={{
                                            background: card.gradient,
                                            minHeight: '140px'
                                        }}
                                    >
                                        <div className="position-relative z-1">
                                            <div className="icon-wrapper mb-3">
                                                <i className={`bi ${card.icon} text-white`} style={{ fontSize: '3rem' }}></i>
                                            </div>
                                        </div>
                                        <div className="gradient-overlay"></div>
                                    </div>
                                    <div className="card-body p-4">
                                        <h5 className="card-title mb-2 fw-semibold">{card.title}</h5>
                                        <p className="card-text text-muted mb-0 small">{card.description}</p>
                                        <div className="mt-3 d-flex align-items-center text-primary">
                                            <span className="small fw-semibold me-2">Configurar</span>
                                            <i className="bi bi-arrow-right"></i>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional Info Card */}
                <div className="row mt-4">
                    <div className="col-12">
                        <div className="card border-0 bg-light">
                            <div className="card-body p-4">
                                <div className="d-flex align-items-start">
                                    <div className="flex-shrink-0">
                                        <i className="bi bi-info-circle text-primary" style={{ fontSize: '1.5rem' }}></i>
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h6 className="mb-2 fw-semibold">Dicas de Segurança</h6>
                                        <ul className="mb-0 text-muted small ps-3">
                                            <li className="mb-1">Use uma senha forte com pelo menos 8 caracteres</li>
                                            <li className="mb-1">Inclua letras maiúsculas, minúsculas, números e símbolos</li>
                                            <li className="mb-1">Altere sua senha regularmente</li>
                                            <li>Mantenha suas questões de segurança atualizadas</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <style>{`
                .settings-card {
                    background: none;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                    cursor: pointer;
                }

                .settings-card:hover {
                    transform: translateY(-8px);
                }

                .settings-card:hover .card {
                    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
                }

                .settings-card:active {
                    transform: translateY(-4px);
                }

                .settings-card .card {
                    transition: all 0.3s ease;
                }

                .card-header {
                    position: relative;
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

                .settings-card:hover .gradient-overlay {
                    opacity: 1;
                }

                .icon-wrapper {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 80px;
                    height: 80px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s ease;
                }

                .settings-card:hover .icon-wrapper {
                    transform: scale(1.1) rotate(5deg);
                    background: rgba(255, 255, 255, 0.3);
                }

                .settings-card .bi-arrow-right {
                    transition: transform 0.3s ease;
                }

                .settings-card:hover .bi-arrow-right {
                    transform: translateX(5px);
                }

                .card-title {
                    color: #2d3748;
                }

                .z-1 {
                    z-index: 1;
                }

                /* Responsive adjustments */
                @media (max-width: 991px) {
                    .settings-card:hover {
                        transform: translateY(-4px);
                    }
                }

                /* Focus states for accessibility */
                .settings-card:focus {
                    outline: 2px solid #667eea;
                    outline-offset: 2px;
                }

                .settings-card:focus:not(:focus-visible) {
                    outline: none;
                }
            `}</style>
        </>
    );
};

export default DefinicoesView;