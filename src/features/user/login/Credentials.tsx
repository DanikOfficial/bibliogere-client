import React, { useState, FC } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation, userApi } from '../../../app/services/userApi'
import Input from '../../../components/reusable/Input'
import { getEntryPoint } from '../../../utils/entrypoint'
import { defaultLoginErrorResponse, defaultLoginFormState, LoginErrorResponse, LoginRequest, LoginResponse } from '../data/userInterfaces'
import { sendLoginRequest } from '../data/business.logic'
import { store } from '../../../app/store'
import localizacaoApi from '../../localizacoes/localizacaoApi'
import { questaoApi } from '../../../app/services/questaoApi'
import estanteApi from '../../estantes/data/estanteApi'
import obraApi from '../../obra/data/obraApi'

const Credentials: FC = () => {
  const navigate = useNavigate()


  const [formState, setFormState] = useState<LoginRequest>(defaultLoginFormState)

  const [error, setError] = useState<LoginErrorResponse>(defaultLoginErrorResponse)

  const [login, { isLoading, isError }] = useLoginMutation()

  let canLogin: boolean = Object.values(formState).every(Boolean)

  const handleOnChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }))

  const handleLogin = async () => {
    if (canLogin) {

      sendLoginRequest(formState, login, setError, (loginResponse: LoginResponse) => {
        // Livros
        store.dispatch(obraApi.endpoints.getObras.initiate())

        // Questao
        store.dispatch(questaoApi.endpoints.getQuestoes.initiate())

        // We only need to load restricted data for admin users
        if (loginResponse.permissoes[0].nome === 'ROLE_ADMIN') {

          // Localizações
          store.dispatch(localizacaoApi.endpoints.getLocalizacoes.initiate())

          // Estantes
          store.dispatch(estanteApi.endpoints.getEstantes.initiate())

          // Atendentes
          store.dispatch(userApi.endpoints.listAtendentes.initiate())
        }

        const entrypoint = getEntryPoint(loginResponse.permissoes[0].nome)
        navigate(entrypoint.url)
      }
      )
    }
  }

  return (
    <>
      <div className="credentials mb-4">
        {isError && (
          <span className="text-danger mb-1">
            <strong>Erro:</strong> {error.message}
          </span>
        )}

        <div className="row mb-2">
          <div className="col-12">
            <Input
              id="username"
              label="Utilizador"
              name="username"
              type="text"
              onChange={handleOnChange}
              error={error.errors?.username}
              color="primary"
              placeholder="Nome do utilizador"
            />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <Input
              id="password"
              label="Palavra-passe"
              name="password"
              type="password"
              error={error.errors?.password}
              onChange={handleOnChange}
              color="primary"
              placeholder="Palavra-passe do utilizador"
            />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column actions">
        <div className="login-btn-wrapper">
          <button
            type="button"
            className="
              btn
              shadow-none
              btn-secondary
              custom-btn
              d-flex
              align-items-center
              me-3
              mb-2              
              px-5
            "
            onClick={handleLogin}
            disabled={!canLogin}
          >
            {isLoading ? (
              <i className="bi bi-arrow-clockwise rotate fs-4"></i>
            ) : (
              <span className="me-1">Entrar</span>
            )}
          </button>
        </div>
        <div className="recover d-flex">
          <p>
            Esqueceu a senha?
            <Link className="ms-1 recover-link" to="/recover">
              clique aqui para recuperar.
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Credentials

