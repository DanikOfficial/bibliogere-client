import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../../app/store'
import toast from 'react-hot-toast'
import { signOut } from '../../features/user/userSlice'

// Base query padrão com JWT
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/v1',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).user.token
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

// Função para mostrar mensagens de erro
const showErrorToast = (message: string, duration = 4000) => {
  toast.error(message, { duration })
}

// Base query com tratamento de erros centralizado
const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions)

  if (result.error) {
    const status = result.error.status

    switch (status) {
      case 'FETCH_ERROR':
        console.error('Server is down or network error')
        showErrorToast('Servidor indisponível. Verifique sua conexão com a internet.', 5000)
        break
      case 'PARSING_ERROR':
        console.error('Invalid JSON response')
        showErrorToast('Erro ao processar resposta do servidor.')
        break
      case 401:
        console.error('Token expired or unauthorized')
        showErrorToast('Sessão expirada. Faça login novamente.')
        api.dispatch(signOut())
        setTimeout(() => {
          window.location.href = '/login'
        }, 1000)
        break
      case 500:
        console.error('Internal server error')
        showErrorToast('Erro interno do servidor. Tente novamente mais tarde.')
        break
      case 503:
        console.error('Service unavailable')
        showErrorToast('Serviço temporariamente indisponível.')
        break
      default:
        if (typeof status === 'number' && status >= 500) {
          console.error(`Server Error: ${status}`)
          showErrorToast('Erro no servidor. Tente novamente mais tarde.')
        }
        break
    }
  }

  return result
}

// Criando a API RTK Query
export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithErrorHandling,
  endpoints: () => ({}),
})
