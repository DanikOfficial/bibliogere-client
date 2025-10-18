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

    return (
        <>
            {isAlterarSenhaModalVisible && <AlterarSenhaModal {...alterarSenhaModalProps} />}
            {isValidarQuestoesModalVisible && <ValidarQuestoesModal  {...validarQuestoesModal} />}
            {isAlterarQuestoesModalVisible && <AtualizarQuestoesModal {...atualizarQuestoesModalProps} />}

            <SectionName>
                Definições de Utilizador
            </SectionName>
            <section id="definicoes" className="py-3">
                <div className="container-fluid">
                    <div className="d-flex flex-wrap">
                        <button
                            className="
                    btn btn-white btn-big
                    text-primary
                    card-shadow
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    me-5
                    mb-3
                  "
                            onClick={toggleAlterarSenhaModal}
                        >
                            <i className="bi bi-fingerprint display-1"></i>
                            <span className="my-3 fw-normal fs-3">Alterar Senha</span>
                        </button>
                        <button
                            className="
                    btn btn-white btn-big
                    text-primary
                    card-shadow
                    d-flex
                    flex-column
                    align-items-center
                    justify-content-center
                    me-5
                    mb-3
                  "
                            onClick={toggleValidarQuestoesModal}
                        >
                            <i className="bi bi-question-circle display-1"></i>
                            <span className="my-3 fw-normal fs-3">Alterar Questões</span>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default DefinicoesView;