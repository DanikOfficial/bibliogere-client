import React from 'react';
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

const AlterarSenhaModal: React.FC<AlterarSenhaModalProps> = ({ close }) => {
  const [formState, setFormState] = React.useState<UpdatePasswordRequest>(defaultUpdatePasswordRequest);
  const [error, setError] = React.useState<UpdatePasswordErrorResponse>(defaultUpdatePasswordErrorResponse);
  const userData = useAppSelector(selectCurrentUserData)

  const [alterarSenha, {
    isLoading,
    isError
  }] = useAlterarSenhaMutation();

  const onClickAlterar = () => {
    toast.loading('Processando...')
    formState.codigoUtilizador = userData.codigo || 0
    sendUpdatePasswordRequest(formState, alterarSenha, setError, (isCreated) => {
      toast.dismiss();
      if (isCreated) {
        toast.success('Senha alterada com sucesso!', {
          duration: 3000,
        })
        setFormState(defaultUpdatePasswordRequest)
      }
    })
  }

  return (
    <div
      className="modal fade modal-custom-bg show d-block"
      id="alterarSenhaModal"
      tabIndex={-1}
      aria-labelledby="alterarSenhaModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content custom-radius p-2">
          <div className="modal-body">
            <h4
              className="
                modal-title
                w-100
                text-primary text-center
                fw-bold
                mb-3
              "
              id="alterarSenhaModalLabel"
            >
              Alterar Senha
            </h4>
            <hr />
            <div id="fields-alterar-senha" className="d-flex flex-column">
              <div className="row">
                {isError && (
                  <span className="text-danger mb-1">
                    <strong>Erro:</strong> {error.message}
                  </span>
                )}
                <div className="col-lg-12 mb-2">
                  <ControlledInput
                    name="oldPassword"
                    color="primary"
                    value={formState.oldPassword}
                    id="oldPassword"
                    label="Senha Atual"
                    onChange={(event) => onInputChange(event, setFormState)}
                    placeholder="Digite a senha atual"
                    error={error.errors?.oldPassword}
                    type="password"
                  />
                </div>

                <div className="col-lg-12 mb-2">
                  <ControlledInput
                    name="newPassword"
                    color="primary"
                    value={formState.newPassword}
                    id="newPassword"
                    label="Nova Senha"
                    onChange={(event) => onInputChange(event, setFormState)}
                    placeholder="Digite a nova senha"
                    error={error.errors?.newPassword}
                    type="password"
                  />
                </div>

                <div className="col-lg-12 mb-2">
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
                </div>
              </div>
            </div>
            <hr />
            <div id="actions" className="d-flex">
              <button
                type="button"
                className="
                  btn
                  shadow-none
                  btn-primary
                  text-light
                  d-flex
                  align-items-center
                  me-3
                "
                onClick={onClickAlterar}
              >
                {isLoading ? (
                  <i className="bi bi-arrow-clockwise rotate fs-4"></i>
                ) : (
                  <span className="me-1">Alterar</span>
                )}
              </button>
              <button
                type="button"
                className="
                  btn
                  shadow-none
                  btn-danger
                  text-light
                  d-flex
                  align-items-center
                  me-3
                "
                data-bs-dismiss="modal"
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

export default AlterarSenhaModal;