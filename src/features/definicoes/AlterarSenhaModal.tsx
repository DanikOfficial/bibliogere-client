import React, { useState } from 'react';
import { defaultUpdatePasswordErrorResponse, UpdatePasswordErrorResponse, UpdatePasswordRequest } from './data/DefinicoesInterfaces';
import { defaultUpdatePasswordRequest } from './data/DefinicoesInterfaces';
import { onInputChange } from '../../utils/reusable/CommonFormEventsHandler';
import ControlledInput from '../../components/reusable/ControlledInput';
import { sendUpdatePasswordRequeet as sendUpdatePasswordRequest } from './data/business.logic';
import { useAlterarSenhaMutation } from '../../app/services/userApi';
import toast from 'react-hot-toast';
import { useAppSelector } from '../../app/hooks';
import { selectCurrentUserData } from '../user/userSlice';

export interface AlterarSenhaModalProps {
  close: () => void;
}

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

const AlterarSenhaModal: React.FC<AlterarSenhaModalProps> = ({ close }) => {
  const [formState, setFormState] = useState<UpdatePasswordRequest>(defaultUpdatePasswordRequest);
  const [error, setError] = useState<UpdatePasswordErrorResponse>(defaultUpdatePasswordErrorResponse);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>(
    calculatePasswordStrength("")
  );
  const userData = useAppSelector(selectCurrentUserData);

  const [alterarSenha, { isLoading, isError }] = useAlterarSenhaMutation();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event, setFormState);
    const newPassword = event.target.value;
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

  const passwordsMatch = formState.newPassword === formState.confirmPassword && formState.confirmPassword !== '';

  const onClickAlterar = () => {
    if (!formState.oldPassword.trim()) {
      setError({
        message: "A senha atual é obrigatória",
        error: true,
        errors: {
          oldPassword: "A senha atual é obrigatória",
          newPassword: "",
          confirmPassword: "",
        }
      });
      return;
    }

    if (!formState.newPassword.trim()) {
      setError({
        message: "A nova senha é obrigatória",
        error: true,
        errors: {
          newPassword: "A nova senha é obrigatória",
          oldPassword: "",
          confirmPassword: "",
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
          oldPassword: "",
          newPassword: "",
        }
      });
      return;
    }

    if (!passwordsMatch) {
      setError({
        message: "As senhas não coincidem",
        error: true,
        errors: {
          confirmPassword: "As senhas não coincidem",
          oldPassword: "",
          newPassword: "",
        }
      });
      return;
    }

    if (passwordStrength.score < 100) {
      setError({
        message: "A senha não atende aos requisitos mínimos de segurança",
        error: true,
        errors: {
          newPassword: "A senha deve atender a todos os requisitos de segurança",
          oldPassword: "",
          confirmPassword: "",
        }
      });
      return;
    }

    setError(defaultUpdatePasswordErrorResponse);

    toast.loading('Processando...');
    formState.codigoUtilizador = userData.codigo || 0;
    sendUpdatePasswordRequest(formState, alterarSenha, setError, (isCreated) => {
      toast.dismiss();
      if (isCreated) {
        toast.success('Senha alterada com sucesso!', {
          duration: 3000,
        });
        setFormState(defaultUpdatePasswordRequest);
        close();
      }
    });
  };

  const isFormValid = formState.oldPassword.trim() &&
    formState.newPassword.trim() &&
    formState.confirmPassword.trim() &&
    passwordsMatch &&
    passwordStrength.score === 100;

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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h2 className="modal-title">Alterar Senha</h2>
            <p className="modal-subtitle">Crie uma senha segura para proteger a sua conta</p>
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
            <i className="bi bi-shield-lock"></i>
            <span>Sua senha deve atender a todos os requisitos de segurança abaixo</span>
          </div>

          {/* Form */}
          <div className="modal-form">
            <div className="form-section">
              <div className="form-group">
                <ControlledInput
                  name="oldPassword"
                  color="primary"
                  value={formState.oldPassword}
                  id="oldPassword"
                  label="Senha Atual"
                  onChange={(event) => onInputChange(event, setFormState)}
                  placeholder="Digite sua senha atual"
                  error={error.errors?.oldPassword}
                  type="password"
                  autoFocus
                />
              </div>

              <div className="form-group">
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
                />

                {/* Password Strength Meter */}
                {formState.newPassword && (
                  <div className="strength-container">
                    <div className="strength-header">
                      <small className="strength-label">Força da senha:</small>
                      {passwordStrength.label && (
                        <span className={`badge bg-${passwordStrength.color}`}>
                          {passwordStrength.label}
                        </span>
                      )}
                    </div>
                    <div className="progress-container">
                      <div
                        className={`progress-bar bg-${passwordStrength.color}`}
                        style={{ width: `${passwordStrength.score}%` }}
                      ></div>
                    </div>

                    {/* Requirements Checklist */}
                    <div className="requirements-list">
                      <small className="requirements-title">Requisitos de segurança:</small>
                      <ul>
                        <li className={passwordStrength.requirements.minLength ? "met" : ""}>
                          <i className={`bi bi-${passwordStrength.requirements.minLength ? "check-circle-fill" : "circle"}`}></i>
                          Mínimo 8 caracteres
                        </li>
                        <li className={passwordStrength.requirements.hasUppercase ? "met" : ""}>
                          <i className={`bi bi-${passwordStrength.requirements.hasUppercase ? "check-circle-fill" : "circle"}`}></i>
                          Uma letra maiúscula (A-Z)
                        </li>
                        <li className={passwordStrength.requirements.hasLowercase ? "met" : ""}>
                          <i className={`bi bi-${passwordStrength.requirements.hasLowercase ? "check-circle-fill" : "circle"}`}></i>
                          Uma letra minúscula (a-z)
                        </li>
                        <li className={passwordStrength.requirements.hasNumber ? "met" : ""}>
                          <i className={`bi bi-${passwordStrength.requirements.hasNumber ? "check-circle-fill" : "circle"}`}></i>
                          Um número (0-9)
                        </li>
                        <li className={passwordStrength.requirements.hasSpecialChar ? "met" : ""}>
                          <i className={`bi bi-${passwordStrength.requirements.hasSpecialChar ? "check-circle-fill" : "circle"}`}></i>
                          Um caractere especial (@$!%*?&)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
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
                {formState.confirmPassword && passwordsMatch && (
                  <div className="match-indicator">
                    <i className="bi bi-check-circle-fill"></i>
                    <small>As senhas coincidem</small>
                  </div>
                )}
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
              onClick={onClickAlterar}
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <i className="bi bi-arrow-clockwise rotate me-2"></i>
                  Alterando...
                </>
              ) : (
                <>
                  <i className="bi bi-check-circle me-2"></i>
                  Alterar Senha
                  <i className="bi bi-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>

          {/* Footer hint */}
          <div className="modal-footer-hint">
            <i className="bi bi-info-circle"></i>
            <span>Sua senha será atualizada imediatamente após a confirmação</span>
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
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .strength-container {
          margin-top: 1rem;
          padding: 1rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
        }

        .strength-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .strength-label {
          font-weight: 600;
          color: #6b7280;
        }

        .badge {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .bg-danger { background: #dc2626; color: white; }
        .bg-warning { background: #f59e0b; color: white; }
        .bg-info { background: #3b82f6; color: white; }
        .bg-success { background: #10b981; color: white; }

        .progress-container {
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .requirements-list {
          margin-top: 0.75rem;
        }

        .requirements-title {
          display: block;
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .requirements-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .requirements-list li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0;
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .requirements-list li.met {
          color: #10b981;
        }

        .requirements-list li i {
          font-size: 1rem;
        }

        .match-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          color: #10b981;
        }

        .match-indicator i {
          font-size: 1rem;
        }

        .match-indicator small {
          font-size: 0.875rem;
          font-weight: 500;
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

export default AlterarSenhaModal;
