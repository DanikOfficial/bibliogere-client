import { type } from 'os'
import { api } from '../../api/apiSlice'
import { Estante } from '../../estantes/EstanteInterfaces'
import { ObraResponse, ObraRequest, SingleObra } from './ObraInterfaces'

const obraApi = api.injectEndpoints({
  endpoints: (build) => ({
    // refactor this <ObraResponse, ObraRequest>
    addObra: build.mutation({
      query: ({ codigoLocalizacao, codigoEstante, obra }) => ({
        url: `/admin/obras/estante/${codigoEstante}/localizacao/${codigoLocalizacao}`,
        method: 'POST',
        body: obra,
      }),
      transformResponse: (responseData) => {
        console.log(responseData)

        return responseData
      },
    }),
  }),
})

export const { useAddObraMutation } = obraApi
