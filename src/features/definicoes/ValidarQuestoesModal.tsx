import React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUserData, selectQuestoes } from "../user/userSlice";
import ControlledInput from "../../components/reusable/ControlledInput";
import { defaultValidarQuestoesErrorResponse, defaultValidarQuestoesRequest, ValidarQuestoesErrorResponse, ValidarQuestoesRequest, ValidarQuestoesResponse } from "../user/data/userInterfaces";
import { useValidarQuestoesMutation } from "../../app/services/userApi";
import { sendValidarQuestoesRequest } from "./data/business.logic";
import { onInputChange } from "../../utils/reusable/CommonFormEventsHandler";

export interface ValidarQuestoesModalProps {
    close: () => void
    GoToUpdate: () => void
}

const ValidarQuestoesModal: React.FC<ValidarQuestoesModalProps> = ({ close, GoToUpdate }) => {
    const { questoes, codigo } = useAppSelector(selectCurrentUserData)
    const [formState, setFormState] = React.useState<ValidarQuestoesRequest>(defaultValidarQuestoesRequest)
    const [error, setError] = React.useState<ValidarQuestoesErrorResponse>(defaultValidarQuestoesErrorResponse)
    const [validarQuestoes, { isLoading, isError }] = useValidarQuestoesMutation()

    const onConfirm = () => {
        const requestPayload: ValidarQuestoesRequest = {
            ...formState,
            codigoUtilizador: codigo || 0,
            primeiraQuestao: questoes.primeiraQuestao,
            segundaQuestao: questoes.segundaQuestao
        }

        sendValidarQuestoesRequest(requestPayload, validarQuestoes, setError, (validarQuestoesResponse: ValidarQuestoesResponse) => {
            if (validarQuestoesResponse.valid) {
                GoToUpdate()
            } else {
                const fullError: ValidarQuestoesErrorResponse = {
                    message: validarQuestoesResponse.message,
                    error: true,
                    errors: {
                        primeiraQuestao: validarQuestoesResponse.firstQuestionMessage,
                        segundaQuestao: validarQuestoesResponse.secondQuestionMessage,
                        primeiraResposta: "",
                        segundaResposta: "",
                        codigoUtilizador: -1
                    },
                    firstQuestionValid: validarQuestoesResponse.firstQuestionValid,
                    secondQuestionValid: validarQuestoesResponse.secondQuestionValid
                };

                setError(fullError);
            }
        })
    }

    return (
        <div
            className="modal fade modal-custom-bg show d-block"
            id="alterarQuestoesModal"
            tabIndex={-1}
            aria-labelledby="validarQuestoesModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content custom-radius p-2">
                    <div className="modal-body">
                        <h4
                            className="modal-title w-100 text-primary text-center fw-light text-primary mb-3"
                            id="validarQuestoesModalLabel"
                        >
                            Validar Questões de Segurança
                        </h4>
                        <hr />
                        <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
                            Confirme a sua identidade respondendo as seguintes questões abaixo:
                        </p>
                        <hr />
                        <div id="fields-alterar-senha" className="d-flex flex-column">
                            <div className="row">
                                {(isError || error.error) && (
                                    <span className="text-danger mb-3">
                                        <strong>Erro:</strong> {error.message}
                                    </span>
                                )}
                                <div className="col-lg-12 mb-3">
                                    <ControlledInput
                                        name="primeiraResposta"
                                        color="primary"
                                        value={formState.primeiraResposta}
                                        id="primeiraResposta"
                                        label={`${questoes.primeiraQuestao}`}
                                        onChange={(event) => onInputChange(event, setFormState)}
                                        placeholder="Digite a resposta da primeira questão"
                                        error={error.errors?.primeiraResposta}
                                        type="text"
                                    />
                                    {error.firstQuestionValid === false && (
                                        <span className="text-danger small d-block mt-1">
                                            {error.errors?.primeiraQuestao}
                                        </span>
                                    )}
                                </div>
                                <hr />
                                <div className="col-lg-12 mb-3">
                                    <ControlledInput
                                        name="segundaResposta"
                                        color="primary"
                                        value={formState.segundaResposta}
                                        id="segundaResposta"
                                        label={`${questoes.segundaQuestao}`}
                                        onChange={(event) => onInputChange(event, setFormState)}
                                        placeholder="Digite a resposta da segunda questão"
                                        error={error.errors?.segundaResposta}
                                        type="text"
                                    />
                                    {error.secondQuestionValid === false && (
                                        <span className="text-danger small d-block mt-1">
                                            {error.errors?.segundaQuestao}
                                        </span>
                                    )}
                                </div>
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

export default ValidarQuestoesModal;