import { useState } from "react";
import ControlledInput from "../../../components/reusable/ControlledInput";
import { onInputChange } from "../../../utils/reusable/CommonFormEventsHandler";
import {
  defaultFetchUserQuestoesResponseErrorState,
  defaultFormState,
  FetchUserQuestoesByUsernameFormState,
  FetchUserQuestoesByUsernameResponse,
  FetchUserQuestoesResponseError,
  ValidateSecurityQuestionsState,
} from "./data/interfaces";
import { useFetchUserQuestoesMutation } from "../../../app/services/userApi";
import { sendFetchUserQuestoesByUsername } from "./data/business.logic";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const UsernameStep = () => {
  const navigate = useNavigate();
  const [formState, setFormState] =
    useState<FetchUserQuestoesByUsernameFormState>(defaultFormState);
  const [error, setError] = useState<FetchUserQuestoesResponseError>(
    defaultFetchUserQuestoesResponseErrorState
  );
  const [fetchUserQuestoes, { isLoading }] = useFetchUserQuestoesMutation();

  const handleNextStep = async () => {
    // Client-side validation
    if (!formState.username.trim()) {
      setError({
        message: "O ID de utilizador é obrigatório",
        error: true,
        errors: {
          username: "O ID de utilizador é obrigatório",
        }
      });
      return;
    }

    // Clear any previous errors
    setError(defaultFetchUserQuestoesResponseErrorState);

    sendFetchUserQuestoesByUsername(
      formState,
      fetchUserQuestoes,
      setError,
      (response: FetchUserQuestoesByUsernameResponse) => {
        const { userActive: isActive, firstLogin: isFirstLogin, primeiraQuestao, segundaQuestao } = response;

        // Utilizador desativado
        if (!isActive) {
          toast.error("Este utilizador foi desativado. Contacte o Gerente.", {
            duration: 5000
          });
          navigate("/");
          return;
        }

        // Conta não totalmente ativada - BLOQUEAR ACESSO
        if (isFirstLogin) {
          toast.error(
            "Esta conta ainda não foi totalmente ativada. Contacte o Gerente para mais informações.",
            { duration: 5000 }
          );
          navigate("/");
          return;
        }

        // Sem questões de segurança configuradas
        if (!primeiraQuestao || !segundaQuestao) {
          toast.error(
            "Questões de segurança não configuradas. Contacte o Gerente.",
            { duration: 5000 }
          );
          navigate("/");
          return;
        }

        const state: ValidateSecurityQuestionsState = {
          username: formState.username,
          primeiraQuestao: primeiraQuestao,
          segundaQuestao: segundaQuestao,
        };

        // Tudo OK - prosseguir para responder questões
        navigate("/recovery/validar-questoes", { state });
      }
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && formState.username.trim() && !isLoading) {
      handleNextStep();
    }
  };

  const isFormValid = formState.username.trim();

  return (
    <>
      {/* Icon Header */}
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
          style={{ width: "64px", height: "64px" }}
        >
          <i className="bi bi-shield-lock fs-1 text-primary"></i>
        </div>
        <h2 className="modal-title w-100 text-primary text-center fw-light mb-2">
          Recuperar Utilizador
        </h2>
        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
          Vamos ajudá-lo a recuperar o acesso à sua conta
        </p>
      </div>

      <hr className="my-4" />

      {/* Instructions with icon */}
      <div className="d-flex align-items-start mb-4">
        <i className="bi bi-info-circle text-primary me-2 mt-1"></i>
        <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>
          Digite o ID de utilizador que escolheu durante o registo.
        </p>
      </div>

      {/* Input Field */}
      <div className="row mb-4">
        <div className="col-12">
          <ControlledInput
            name="username"
            color="primary"
            value={formState.username}
            id="username"
            label="Id do Utilizador"
            onChange={(event) => onInputChange(event, setFormState)}
            placeholder="Digite o seu id de utilizador"
            error={error.errors?.username}
            type="text"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex flex-column gap-2 mt-4">
        <button
          type="button"
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center shadow-sm"
          onClick={handleNextStep}
          disabled={isLoading || !isFormValid}
          style={{ transition: "all 0.2s ease" }}
        >
          {isLoading ? (
            <>
              <i className="bi bi-arrow-clockwise rotate fs-5 me-2"></i>
              <span>Processando...</span>
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
          onClick={() => navigate("/")}
          disabled={isLoading}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Voltar ao login
        </button>
      </div>

      {/* Help text */}
      <div className="mt-4 pt-3 border-top">
        <small className="text-muted d-flex align-items-center justify-content-center">
          <i className="bi bi-shield-check me-1"></i>
          Os seus dados estão protegidos e seguros
        </small>
      </div>
    </>
  );
};

export default UsernameStep;