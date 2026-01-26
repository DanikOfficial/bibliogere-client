import { useState } from "react";
import { useValidateQuestoesFromRecoveryMutation } from "../../../app/services/userApi";
import ControlledInput from "../../../components/reusable/ControlledInput";
import { onInputChange } from "../../../utils/reusable/CommonFormEventsHandler";
import { defaultValidarQuestoesFromRecoveryErrorResponse, defaultValidarQuestoesFromRecoveryRequest, ValidarQuestoesFromRecoveryErrorResponse, ValidarQuestoesFromRecoveryRequest } from "../data/userInterfaces";
import { sendValidarQuestoesFromRecoveryRequest } from "../recovery/data/business.logic";
import { useLocation, useNavigate } from "react-router-dom";
import { ValidateSecurityQuestionsState } from "../recovery/data/interfaces";
import toast from "react-hot-toast";
import { CreatePasswordState } from "@/features/definicoes/data/DefinicoesInterfaces";

const ValidateQuestoes = () => {
    const [validateQuestoesFromRecovery, { isLoading, isError }] = useValidateQuestoesFromRecoveryMutation()
    const [formState, setFormState] = useState<ValidarQuestoesFromRecoveryRequest>(defaultValidarQuestoesFromRecoveryRequest)
    const [error, setError] = useState<ValidarQuestoesFromRecoveryErrorResponse>(defaultValidarQuestoesFromRecoveryErrorResponse)
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state as ValidateSecurityQuestionsState

    if (!state?.username) {
        navigate("/");
        return null;
    }

    const { username, primeiraQuestao, segundaQuestao } = state;

    const onConfirm = () => {
        // Client-side validation
        if (!formState.primeiraResposta.trim()) {
            setError({
                message: "A resposta da primeira questão é obrigatória",
                error: true,
                errors: {
                    primeiraResposta: "A resposta da primeira questão é obrigatória",
                    segundaResposta: "",
                    primeiraQuestao: "",
                    segundaQuestao: "",
                    username: ""
                },
                firstQuestionValid: false,
                secondQuestionValid: true
            });
            return;
        }

        if (!formState.segundaResposta.trim()) {
            setError({
                message: "A resposta da segunda questão é obrigatória",
                error: true,
                errors: {
                    primeiraResposta: "",
                    segundaResposta: "A resposta da segunda questão é obrigatória",
                    primeiraQuestao: "",
                    segundaQuestao: "",
                    username: ""
                },
                firstQuestionValid: true,
                secondQuestionValid: false
            });
            return;
        }

        // Clear errors
        setError(defaultValidarQuestoesFromRecoveryErrorResponse);

        const updatedFormState: ValidarQuestoesFromRecoveryRequest = {
            ...formState,
            username: username,
            primeiraQuestao: primeiraQuestao,
            segundaQuestao: segundaQuestao
        };

        sendValidarQuestoesFromRecoveryRequest(updatedFormState, validateQuestoesFromRecovery, setError, (validarQuestoesResponse) => {
            if (validarQuestoesResponse.valid) {
                const createPasswordState: CreatePasswordState = {
                    username: username
                };

                toast.success("Questões validadas com sucesso!", { duration: 3000 });
                navigate("/recovery/criar-senha", { state: createPasswordState });
            } else {
                const fullError: ValidarQuestoesFromRecoveryErrorResponse = {
                    message: validarQuestoesResponse.message,
                    error: true,
                    errors: {
                        primeiraQuestao: validarQuestoesResponse.firstQuestionMessage,
                        segundaQuestao: validarQuestoesResponse.secondQuestionMessage,
                        primeiraResposta: "",
                        segundaResposta: "",
                        username: ""
                    },
                    firstQuestionValid: validarQuestoesResponse.firstQuestionValid,
                    secondQuestionValid: validarQuestoesResponse.secondQuestionValid
                };

                setError(fullError);
            }
        });
    }

    const onCancel = () => {
        toast.error("Operação cancelada pelo utilizador.", { duration: 3000 });
        navigate("/");
    }

    const isFormValid = formState.primeiraResposta.trim() && formState.segundaResposta.trim();

    return (
        <>
            {/* Icon Header */}
            <div className="text-center mb-3">
                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                    style={{ width: "64px", height: "64px" }}
                >
                    <i className="bi bi-patch-question-fill fs-1 text-primary"></i>
                </div>
                <h3 className="text-primary text-center fw-light mb-2">
                    Validar Questões de Segurança
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    Confirme a sua identidade para prosseguir
                </p>
            </div>

            <hr className="my-4" />

            {/* Instructions with icon */}
            <div className="d-flex align-items-start mb-4">
                <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Responda as questões de segurança que configurou durante o registo.
                </p>
            </div>

            <div id="fields-validar-questoes" className="d-flex flex-column">
                <div className="row">
                    {(isError || error.error) && (
                        <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            <div>
                                <strong>Erro:</strong> {error.message}
                            </div>
                        </div>
                    )}

                    <div className="col-lg-12 mb-4">
                        <div className="question-card p-3 border rounded-3 bg-light mb-2">
                            <div className="d-flex align-items-start mb-2">
                                <i className="bi bi-1-circle-fill text-primary me-2 fs-5"></i>
                                <strong className="text-primary">{primeiraQuestao}</strong>
                            </div>
                        </div>
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
                        {error.firstQuestionValid === false && (
                            <div className="alert alert-danger d-flex align-items-center mt-2 py-2" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                <small>{error.errors?.primeiraQuestao}</small>
                            </div>
                        )}
                    </div>

                    <div className="col-lg-12 mb-4">
                        <div className="question-card p-3 border rounded-3 bg-light mb-2">
                            <div className="d-flex align-items-start mb-2">
                                <i className="bi bi-2-circle-fill text-primary me-2 fs-5"></i>
                                <strong className="text-primary">{segundaQuestao}</strong>
                            </div>
                        </div>
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
                        {error.secondQuestionValid === false && (
                            <div className="alert alert-danger d-flex align-items-center mt-2 py-2" role="alert">
                                <i className="bi bi-x-circle-fill me-2"></i>
                                <small>{error.errors?.segundaQuestao}</small>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div id="actions" className="d-flex flex-column gap-2 mt-4">
                <button
                    type="button"
                    className="btn btn-primary btn-lg d-flex align-items-center justify-content-center shadow-sm"
                    onClick={onConfirm}
                    disabled={isLoading || !isFormValid}
                    style={{ transition: "all 0.2s ease" }}
                >
                    {isLoading ? (
                        <>
                            <i className="bi bi-arrow-clockwise rotate fs-5 me-2"></i>
                            <span>Validando...</span>
                        </>
                    ) : (
                        <>
                            <span>Confirmar</span>
                            <i className="bi bi-check-circle ms-2 fs-5"></i>
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="btn btn-link text-muted text-decoration-none"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    <i className="bi bi-arrow-left me-1"></i>
                    Cancelar operação
                </button>
            </div>

            {/* Help text */}
            <div className="mt-4 pt-3 border-top">
                <small className="text-muted d-flex align-items-center justify-content-center">
                    <i className="bi bi-shield-lock me-1"></i>
                    Suas respostas são verificadas de forma segura
                </small>
            </div>
        </>
    );
}

export default ValidateQuestoes
