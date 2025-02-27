import React, { useState, FC } from 'react'
import { useAppDispatch } from '../../../app/hooks'
import { useNavigate, Link } from 'react-router-dom'
import { useLoginMutation } from '../../../app/services/userApi'
import { setCredentials } from '../userSlice'
import type { AuthState } from '../userSlice'
import type { LoginRequest, ErrorState } from '../../../app/services/userApi'
import Input from '../../../components/reusable/Input'
import { getEntryPoint } from '../../../utils/entrypoint'

const Credentials: FC = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const initialErrorState: ErrorState = {
    error: false,
    message: '',
    errors: { username: '' },
  }

  const [formState, setFormState] = useState<LoginRequest>({
    username: '',
    password: '',
  })

  const [error, setError] = useState<ErrorState>(initialErrorState)

  const [login, { isLoading, isError }] = useLoginMutation()

  let canLogin: boolean = Object.values(formState).every(Boolean)

  const handleOnChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) =>
    setFormState((prev) => ({ ...prev, [name]: value }))

  const handleLogin = async () => {
    if (canLogin) {
      try {
        setError(initialErrorState)

        const { nome, token, permissoes } = await login(formState).unwrap()

        dispatch(
          setCredentials({
            currentUser: nome,
            token,
            role: permissoes[0],
          } as AuthState)
        )

        const entrypoint = getEntryPoint(permissoes[0].nome)
        console.log('Entrypoint ', entrypoint)

        if (entrypoint) {
          navigate(entrypoint.url)
        } else {
          console.error('Invalid Role: ', permissoes[0].nome)
          setError({
            error: true,
            message: 'Utilizador Invalido',
            errors: { username: '' },
          })
        }
      } catch (err) {
        const data = err as ErrorState
        setError((prev) => ({ ...prev, ...data }))
      }
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
              error={error.errors.username}
              color="prevent"
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
              onChange={handleOnChange}
              color="prevent"
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
