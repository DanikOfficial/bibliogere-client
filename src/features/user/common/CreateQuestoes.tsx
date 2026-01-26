import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { selectAllQuestoes } from "../questaoSlice";
import { renderQuestoes } from "../data/business.logic";
import ComboBox from "../../../components/reusable/ComboBox";
import ControlledInput from "../../../components/reusable/ControlledInput";
import { onChangeSelect, onInputChange } from "../../../utils/reusable/CommonFormEventsHandler";
import { EMPTY } from "../../../components/reusable/data/Constants";
import {
    AlterarQuestoesErroResponse,
    AlterarQuestoesForm,
    AtualizarQuestoesRequest,
    defaultAlterarQuestoesErrorResponse,
    defaultAlterarQuestoesForm
} from "../data/userInterfaces";
import { selectCurrentUserData } from "../userSlice";
import { useSaveQuestoesMutation } from "../../../app/services/userApi";
import { sendUpdateQuestoesRequest } from "../../definicoes/data/business.logic";
import toast from "react-hot-toast";

interface CreateQuestoesState {
    username?: string;
    userData?: any;
}

const CreateQuestoes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as CreateQuestoesState;

    // Get user data from Redux store
    const { codigo, currentUser } = useAppSelector(selectCurrentUserData);
    const questoesState = useAppSelector(selectAllQuestoes);

    const [formState, setFormState] = useState<AlterarQuestoesForm>(defaultAlterarQuestoesForm);
    const [error, setError] = useState<AlterarQuestoesErroResponse>(defaultAlterarQuestoesErrorResponse);
    const [saveQuestoes, { isLoading, isError }] = useSaveQuestoesMutation();

    // Verificar se o usuário tem permissão para acessar esta página
    useEffect(() => {
        // Se não tiver state com username e não tiver codigo no Redux, redirecionar para login
        if (!state?.username && !codigo) {
            toast.error("Acesso não autorizado. Faça login primeiro.");
            navigate("/");
        }
    }, [state, codigo, navigate]);

    const questoesOptions = renderQuestoes(questoesState.questoes);

    const onChangeQuestao = (
        name: string,
        value: string | number,
        label: string = EMPTY
    ) => onChangeSelect(setFormState, name, value, label);

    const onConfirm = () => {
        // Client-side validation
        if (!formState.primeiraQuestao.value) {
            setError({
                message: "Selecione a primeira questão de segurança",
                error: true,
                errors: {
                    primeiraQuestao: "Selecione a primeira questão de segurança",
                    primeiraResposta: "",
                    segundaQuestao: "",
                    segundaResposta: "",
                    updating: false,
                    codigoUtilizador: -1
                }
            });
            return;
        }

        if (!formState.primeiraResposta.trim()) {
            setError({
                message: "A resposta da primeira questão é obrigatória",
                error: true,
                errors: {
                    primeiraQuestao: "",
                    primeiraResposta: "A resposta da primeira questão é obrigatória",
                    segundaQuestao: "",
                    segundaResposta: "",
                    updating: false,
                    codigoUtilizador: -1
                }
            });
            return;
        }

        if (!formState.segundaQuestao.value) {
            setError({
                message: "Selecione a segunda questão de segurança",
                error: true,
                errors: {
                    primeiraQuestao: "",
                    primeiraResposta: "",
                    segundaQuestao: "Selecione a segunda questão de segurança",
                    segundaResposta: "",
                    updating: false,
                    codigoUtilizador: -1
                }
            });
            return;
        }

        if (!formState.segundaResposta.trim()) {
            setError({
                message: "A resposta da segunda questão é obrigatória",
                error: true,
                errors: {
                    primeiraQuestao: "",
                    primeiraResposta: "",
                    segundaQuestao: "",
                    segundaResposta: "A resposta da segunda questão é obrigatória",
                    updating: false,
                    codigoUtilizador: -1
                }
            });
            return;
        }

        if (formState.primeiraQuestao.value === formState.segundaQuestao.value) {
            setError({
                message: "As questões de segurança devem ser diferentes",
                error: true,
                errors: {
                    primeiraQuestao: "",
                    primeiraResposta: "",
                    segundaQuestao: "Escolha uma questão diferente da primeira",
                    segundaResposta: "",
                    updating: false,
                    codigoUtilizador: -1
                }
            });
            return;
        }

        // Clear errors
        setError(defaultAlterarQuestoesErrorResponse);

        const atualizarQuestoesRequest: AtualizarQuestoesRequest = {
            codigoUtilizador: codigo || 0,
            primeiraQuestao: formState.primeiraQuestao.value as string,
            primeiraResposta: formState.primeiraResposta as string,
            segundaQuestao: formState.segundaQuestao.value as string,
            segundaResposta: formState.segundaResposta,
            updating: false // First time setup
        };

        sendUpdateQuestoesRequest(atualizarQuestoesRequest, saveQuestoes, setError, (isSuccess) => {
            if (isSuccess) {
                toast.success("Questões de segurança definidas com sucesso!", { duration: 3000 });
                // Navigate to create password step with username
                const username = state?.username || currentUser;
                navigate("/activate/criar-senha", {
                    state: {
                        username,
                        fromActivation: true
                    }
                });
            }
        });
    };

    const onCancel = () => {
        toast.error("Ativação cancelada pelo utilizador.", { duration: 3000 });
        navigate("/");
    };

    const isFormValid =
        formState.primeiraQuestao.value &&
        formState.primeiraResposta.trim() &&
        formState.segundaQuestao.value &&
        formState.segundaResposta.trim() &&
        formState.primeiraQuestao.value !== formState.segundaQuestao.value;

    // Se não tiver questões carregadas, mostrar loading
    if (questoesState.questoes.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <p className="text-muted mt-3">Carregando questões de segurança...</p>
            </div>
        );
    }

    return (
        <>
            {/* Icon Header */}
            <div className="text-center mb-3">
                <div
                    className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
                    style={{ width: "64px", height: "64px" }}
                >
                    <i className="bi bi-shield-plus fs-1 text-primary"></i>
                </div>
                <h3 className="text-primary text-center fw-light mb-2">
                    Definir Questões de Segurança
                </h3>
                <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    Configure suas questões para proteção da conta
                </p>
            </div>

            <hr className="my-4" />

            {/* Instructions with icon */}
            <div className="d-flex align-items-start mb-4">
                <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
                <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
                    Escolha duas questões de segurança e forneça as respostas. Estas questões serão usadas para recuperar a sua conta no futuro.
                </p>
            </div>

            <div id="fields-define-questoes" className="d-flex flex-column">
                {(isError || error.error) && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <div>
                            <strong>Erro:</strong> {error.message}
                        </div>
                    </div>
                )}

                <div className="row">
                    {/* Primeira Questão */}
                    <div className="col-lg-12 mb-4">
                        <div className="question-card p-3 border rounded-3 bg-light mb-2">
                            <div className="d-flex align-items-start mb-2">
                                <i className="bi bi-1-circle-fill text-primary me-2 fs-5"></i>
                                <strong className="text-primary">Primeira Questão</strong>
                            </div>
                        </div>
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
                        <div className="mt-2">
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
                    <div className="col-lg-12 mb-4">
                        <div className="question-card p-3 border rounded-3 bg-light mb-2">
                            <div className="d-flex align-items-start mb-2">
                                <i className="bi bi-2-circle-fill text-primary me-2 fs-5"></i>
                                <strong className="text-primary">Segunda Questão</strong>
                            </div>
                        </div>
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
                        <div className="mt-2">
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
                            <span>Guardando...</span>
                        </>
                    ) : (
                        <>
                            <span>Continuar</span>
                            <i className="bi bi-arrow-right-circle ms-2 fs-5"></i>
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
                    Cancelar ativação
                </button>
            </div>

            {/* Help text */}
            <div className="mt-4 pt-3 border-top">
                <small className="text-muted d-flex align-items-center justify-content-center">
                    <i className="bi bi-shield-check me-1"></i>
                    Suas questões de segurança serão armazenadas de forma segura
                </small>
            </div>

            <style>{`
                .rotate {
                    animation: rotate 1s linear infinite;
                }
                
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                
                .btn-primary:not(:disabled):hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
                }
            `}</style>
        </>
    );
};

export default CreateQuestoes;