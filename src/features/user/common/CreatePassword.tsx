import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCreatePasswordMutation, userApi } from "../../../app/services/userApi";
import ControlledInput from "../../../components/reusable/ControlledInput";
import { onInputChange } from "../../../utils/reusable/CommonFormEventsHandler";
import toast from "react-hot-toast";
import {
  CreatePasswordRequest,
  defaultCreatePasswordRequest,
  CreatePasswordErrorResponse,
  defaultCreatePasswordErrorResponse,
  CreatePasswordState
} from "@/features/definicoes/data/DefinicoesInterfaces";
import { questaoApi } from "@/app/services/questaoApi";
import { store } from "@/app/store";
import estanteApi from "@/features/estantes/data/estanteApi";
import localizacaoApi from "@/features/localizacoes/localizacaoApi";
import obraApi from "@/features/obra/data/obraApi";
import { getEntryPoint } from "@/utils/entrypoint";
import { LoginResponse } from "../data/userInterfaces";
import { sendCreatePasswordRequest } from "../recovery/data/business.logic";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

const calculatePasswordStrength = (password: string): PasswordStrength => {
  const requirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[@$!%*?&]/.test(password),
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;

  let score = 0;
  let label = "";
  let color = "";

  if (metRequirements === 0) {
    score = 0;
    label = "";
    color = "";
  } else if (metRequirements <= 2) {
    score = 25;
    label = "Fraca";
    color = "danger";
  } else if (metRequirements === 3) {
    score = 50;
    label = "Média";
    color = "warning";
  } else if (metRequirements === 4) {
    score = 75;
    label = "Boa";
    color = "info";
  } else {
    score = 100;
    label = "Forte";
    color = "success";
  }

  return { score, label, color, requirements };
};

const CreatePassword = () => {
  const [formState, setFormState] = useState<CreatePasswordRequest>(defaultCreatePasswordRequest);
  const [error, setError] = useState<CreatePasswordErrorResponse>(defaultCreatePasswordErrorResponse);
  const [createPassword, { isLoading }] = useCreatePasswordMutation();
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(
    calculatePasswordStrength("")
  );

  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as CreatePasswordState;

  // Redirect if no state
  if (!state?.username) {
    navigate("/");
    return null;
  }

  const { username } = state;

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event, setFormState);
    const newPassword = event.target.value;
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const onConfirm = () => {
    // Client-side validation
    if (!formState.newPassword.trim()) {
      setError({
        message: "A nova senha é obrigatória",
        error: true,
        errors: {
          newPassword: "A nova senha é obrigatória",
          confirmPassword: "",
          username: ""
        }
      });
      return;
    }

    if (!formState.confirmPassword.trim()) {
      setError({
        message: "A confirmação de senha é obrigatória",
        error: true,
        errors: {
          confirmPassword: "A confirmação de senha é obrigatória",
          newPassword: "",
          username: ""
        }
      });
      return;
    }

    if (formState.newPassword !== formState.confirmPassword) {
      setError({
        message: "As senhas não coincidem",
        error: true,
        errors: {
          confirmPassword: "As senhas não coincidem",
          newPassword: "",
          username: ""
        }
      });
      return;
    }

    // Validate password strength (all requirements must be met)
    if (passwordStrength.score < 100) {
      setError({
        message: "A senha não atende aos requisitos mínimos de segurança",
        error: true,
        errors: {
          newPassword: "A senha deve atender a todos os requisitos de segurança",
          confirmPassword: "",
          username: ""
        }
      });
      return;
    }

    // Clear errors before submission
    setError(defaultCreatePasswordErrorResponse);

    const updatedFormState: CreatePasswordRequest = {
      ...formState,
      username: username
    };

    sendCreatePasswordRequest(
      updatedFormState,
      createPassword,
      setError,
      (createPasswordResponse: LoginResponse) => {
        toast.success("Activação concluída com sucesso!", { duration: 3000 });
        setFormState(defaultCreatePasswordRequest);

        // Livros
        store.dispatch(obraApi.endpoints.getObras.initiate());

        // Questao
        store.dispatch(questaoApi.endpoints.getQuestoes.initiate());

        // We only need to load restricted data for admin usersro
        if (createPasswordResponse.permissoes[0].nome === 'ROLE_ADMIN') {
          // Localizações
          store.dispatch(localizacaoApi.endpoints.getLocalizacoes.initiate());

          // Estantes
          store.dispatch(estanteApi.endpoints.getEstantes.initiate());

          // Atendentes
          store.dispatch(userApi.endpoints.listAtendentes.initiate());
        }

        const entrypoint = getEntryPoint(createPasswordResponse.permissoes[0].nome);
        navigate(entrypoint.url);
      }
    );
  };

  const onCancel = () => {
    toast.error("Operação cancelada pelo utilizador.", { duration: 3000 });
    navigate("/");
  };

  const isFormValid = formState.newPassword.trim() &&
    formState.confirmPassword.trim() &&
    passwordStrength.score === 100;

  return (
    <>
      {/* Icon Header */}
      <div className="text-center mb-3">
        <div
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
          style={{ width: "64px", height: "64px" }}
        >
          <i className="bi bi-key-fill fs-1 text-primary"></i>
        </div>
        <h4 className="text-primary text-center fw-light mb-2">
          Definir Palavra Passe
        </h4>
        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
          Crie uma senha segura para proteger a sua conta
        </p>
      </div>

      <hr className="my-4" />

      {/* Instructions with icon */}
      <div className="d-flex align-items-start mb-4">
        <i className="bi bi-shield-lock text-primary me-2 mt-1"></i>
        <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
          Sua senha deve atender a todos os requisitos de segurança abaixo.
        </p>
      </div>

      <div id="fields-criar-senha" className="d-flex flex-column">
        <div className="row">
          {error.error && (
            <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <div>
                <strong>Erro:</strong> {error.message}
              </div>
            </div>
          )}

          <div className="col-lg-12 mb-4">
            <ControlledInput
              name="newPassword"
              color="primary"
              value={formState.newPassword}
              id="newPassword"
              label="Nova Senha"
              onChange={handlePasswordChange}
              placeholder="Digite a nova senha"
              error={error.errors?.newPassword}
              type="password"
              autoFocus
            />

            {/* Password Strength Meter */}
            {formState.newPassword && (
              <div className="mt-3 p-3 border rounded-3 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted fw-medium">Força da senha:</small>
                  {passwordStrength.label && (
                    <span className={`badge bg-${passwordStrength.color}`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="progress mb-3" style={{ height: "8px" }}>
                  <div
                    className={`progress-bar bg-${passwordStrength.color}`}
                    role="progressbar"
                    style={{ width: `${passwordStrength.score}%`, transition: "width 0.3s ease" }}
                    aria-valuenow={passwordStrength.score}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  ></div>
                </div>

                {/* Requirements Checklist */}
                <div>
                  <small className="text-muted fw-medium d-block mb-2">Requisitos de segurança:</small>
                  <ul className="list-unstyled mb-0" style={{ fontSize: "0.875rem" }}>
                    <li className={`mb-1 ${passwordStrength.requirements.minLength ? "text-success" : "text-muted"}`}>
                      <i className={`bi bi-${passwordStrength.requirements.minLength ? "check-circle-fill" : "circle"} me-2`}></i>
                      Mínimo 8 caracteres
                    </li>
                    <li className={`mb-1 ${passwordStrength.requirements.hasUppercase ? "text-success" : "text-muted"}`}>
                      <i className={`bi bi-${passwordStrength.requirements.hasUppercase ? "check-circle-fill" : "circle"} me-2`}></i>
                      Uma letra maiúscula (A-Z)
                    </li>
                    <li className={`mb-1 ${passwordStrength.requirements.hasLowercase ? "text-success" : "text-muted"}`}>
                      <i className={`bi bi-${passwordStrength.requirements.hasLowercase ? "check-circle-fill" : "circle"} me-2`}></i>
                      Uma letra minúscula (a-z)
                    </li>
                    <li className={`mb-1 ${passwordStrength.requirements.hasNumber ? "text-success" : "text-muted"}`}>
                      <i className={`bi bi-${passwordStrength.requirements.hasNumber ? "check-circle-fill" : "circle"} me-2`}></i>
                      Um número (0-9)
                    </li>
                    <li className={passwordStrength.requirements.hasSpecialChar ? "text-success" : "text-muted"}>
                      <i className={`bi bi-${passwordStrength.requirements.hasSpecialChar ? "check-circle-fill" : "circle"} me-2`}></i>
                      Um caractere especial (@$!%*?&)
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-12 mb-4">
            <ControlledInput
              name="confirmPassword"
              color="primary"
              value={formState.confirmPassword}
              id="confirmPassword"
              label="Confirmar Nova Senha"
              onChange={(event) => onInputChange(event, setFormState)}
              placeholder="Digite a nova senha novamente"
              error={error.errors?.confirmPassword}
              type="password"
            />
            {formState.confirmPassword && formState.newPassword === formState.confirmPassword && (
              <div className="d-flex align-items-center mt-2 text-success">
                <i className="bi bi-check-circle-fill me-2"></i>
                <small>As senhas coincidem</small>
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
              <span>Criando senha...</span>
            </>
          ) : (
            <>
              <span>Confirmar e Entrar</span>
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
          <i className="bi bi-info-circle me-1"></i>
          Você será automaticamente autenticado após criar a senha
        </small>
      </div>
    </>
  );
};

export default CreatePassword;
