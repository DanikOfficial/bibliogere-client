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

    return (
        <div
            className="modal fade modal-custom-bg  show d-block"
            id="alterarQuestoesModal"
            tabIndex={-1}
            aria-labelledby="atualizarQuestoesModal"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content custom-radius p-2">
                    <div className="modal-body">
                        <h4
                            className="
                    modal-title
                    w-100
                    text-secondary text-center
                    fw-light
                    mb-3
                  "
                            id="atualizarQuestoesModal"
                        >
                            Atualizar Questões de Seguranca
                        </h4>
                        <hr />
                        <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                            Escolha duas novas questões de segurança e forneça as respostas. Estas questões serão usadas para recuperar a sua conta no futuro.
                        </p><hr />
                        <div id="Fields" className="d-flex flex-column">
                            {(isError || error.error) && (
                                <span className="text-danger mb-3">
                                    <strong>Erro:</strong> {error.message}
                                </span>
                            )}
                            <div className="row">
                                <div className="col-lg-12 mb-2">
                                    <ComboBox
                                        id="primeiraQuestao"
                                        label="Escolha a primera questão"
                                        color="secondary"
                                        value={formState.primeiraQuestao}
                                        name="primeiraQuestao"
                                        options={questoesOptions}
                                        onChange={onChangeQuestao}
                                        error={error.errors?.primeiraQuestao}
                                    />
                                    <ControlledInput
                                        name="primeiraResposta"
                                        color="primary"
                                        value={formState.primeiraResposta}
                                        id="segundaResposta"
                                        onChange={(event) => onInputChange(event, setFormState)}
                                        placeholder="Digite a primeira resposta"
                                        error={error.errors?.primeiraResposta}
                                        type="text"
                                    />
                                </div>
                                <hr />
                                <div className="col-lg-12 mb-2">
                                    <div className="col-lg-12 mb-2">
                                        <ComboBox
                                            id="segundaQuestao"
                                            label="Escolha a segunda questão"
                                            color="secondary"
                                            value={formState.segundaQuestao}
                                            name="segundaQuestao"
                                            options={questoesOptions}
                                            onChange={onChangeQuestao}
                                        />
                                        <ControlledInput
                                            name="segundaResposta"
                                            color="primary"
                                            value={formState.segundaResposta}
                                            id="segundaResposta"
                                            onChange={(event) => onInputChange(event, setFormState)}
                                            placeholder="Digite a segunda resposta"
                                            error={error.errors?.segundaResposta}
                                            type="text"
                                        />
                                    </div>

                                </div>
                                <hr />
                            </div>
                        </div>

                        <div id="actions" className="d-flex">
                            <button
                                type="button"
                                className="btn shadow-none btn-primary text-light d-flex align-items-center me-3"
                                onClick={onConfirm}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <i className="bi bi-arrow-clockwise rotate fs-4"></i>
                                ) : (
                                    <>
                                        <span className="me-1">Validar</span>
                                        <i className="bi bi-save text-light"></i>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="btn shadow-none btn-danger text-light d-flex align-items-center"
                                onClick={close}
                            >
                                <span className="me-1">Cancelar</span>
                                <i className="bi bi-x-square text-light"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AtualizarQuestoesModal;
