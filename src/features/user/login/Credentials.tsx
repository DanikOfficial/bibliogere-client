import React, { useState, FC } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation, userApi } from '../../../app/services/userApi'
import Input from '../../../components/reusable/Input'
import { getEntryPoint } from '../../../utils/entrypoint'
import { 
  defaultLoginErrorResponse, 
  defaultLoginFormState, 
  LoginErrorResponse, 
  LoginRequest, 
  LoginResponse 
} from '../data/userInterfaces'
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

  const canLogin: boolean = Object.values(formState).every(Boolean)

  const handleOnChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }))

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canLogin && !isLoading) {
      handleLogin()
    }
  }

 const handleLogin = async () => {
  if (canLogin) {
    sendLoginRequest(formState, login, setError, (loginResponse: LoginResponse) => {
      // Check if it's the first login - redirect to activation flow
      if (loginResponse.firstLogin) {

        // Load questoes for the user to choose from
        store.dispatch(questaoApi.endpoints.getQuestoes.initiate())
        
        // Redirect to activation flow
        navigate('/activate/criar-questoes', {
          state: {
            username: loginResponse.username || formState.username,
            userData: loginResponse
          }
        })
        return
      }

      // Normal login flow - load all necessary data
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
    })
  }
}

  return (
    <>
      <hr className="my-4" />
      
      <div className="credentials mb-4">
        {isError && (
          <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <div>
              <strong>Erro:</strong> {error.message}
            </div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-12">
            <Input
              id="username"
              label="Utilizador"
              name="username"
              type="text"
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
              error={error.errors?.username}
              color="primary"
              placeholder="Digite o seu ID de utilizador"
              autoFocus
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12">
            <Input
              id="password"
              label="Palavra-passe"
              name="password"
              type="password"
              error={error.errors?.password}
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
              color="primary"
              placeholder="Digite a sua senha"
            />
          </div>
        </div>
      </div>

      <div className="d-flex flex-column gap-3">
        <button
          type="button"
          className="btn btn-primary btn-lg d-flex align-items-center justify-content-center shadow-sm"
          onClick={handleLogin}
          disabled={!canLogin || isLoading}
          style={{ transition: "all 0.2s ease" }}
        >
          {isLoading ? (
            <>
              <i className="bi bi-arrow-clockwise rotate fs-5 me-2"></i>
              <span>Autenticando...</span>
            </>
          ) : (
            <>
              <span>Entrar</span>
              <i className="bi bi-box-arrow-in-right ms-2 fs-5"></i>
            </>
          )}
        </button>

        <div className="text-center">
          <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
            Esqueceu a senha?{' '}
            <Link 
              className="text-primary text-decoration-none fw-medium" 
              to="/recovery/validar-utilizador"
            >
              Recuperar acesso
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-top">
        <small className="text-muted d-flex align-items-center justify-content-center">
          <i className="bi bi-shield-check me-1"></i>
          Acesso seguro e protegido
        </small>
      </div>
    </>
  )
}

export default Credentials