import { createApi, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../../app/store'
import toast from 'react-hot-toast'
import { signOut } from '../user/userSlice'

// Default fetchBaseQuery with JWT header
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const showErrorToast = (message: string, duration = 4000) => {
  toast.error(message, { duration })
}

const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions)

  const error = result.error as FetchBaseQueryError | undefined

  if (error) {
    const status = error.status

    switch (status) {
      case 'FETCH_ERROR':
        showErrorToast('Servidor indisponível. Verifique sua conexão com a internet.', 5000)
        break

      case 'PARSING_ERROR':
        showErrorToast('Erro ao processar resposta do servidor.')
        break

      case 401:
        showErrorToast('Sessão expirada. Faça login novamente.')
        api.dispatch(signOut())

        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
        break

      case 500:
        showErrorToast('Erro interno do servidor. Tente novamente mais tarde.')
        break

      case 503:
        showErrorToast('Serviço temporariamente indisponível.')
        break

      default:
        if (typeof status === 'number' && status >= 500) {
          showErrorToast('Erro no servidor. Tente novamente mais tarde.')
        }
        break
    }
  }

  return result
}

// Create API
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
})
