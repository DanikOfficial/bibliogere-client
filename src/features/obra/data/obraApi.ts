import { api } from '../../api/apiSlice'
import { ObraEntity, ObraRequest, ObraResponse } from './ObraInterfaces'

const obraApi = api.injectEndpoints({
  endpoints: (build) => ({
    addObra: build.mutation<ObraResponse, ObraRequest>({
      query: ({ codigoLocalizacao, codigoEstante, obra }) => ({
        url: `/admin/obras/estante/${codigoEstante}/localizacao/${codigoLocalizacao}`,
        method: 'POST',
        body: obra,
      }),
      transformResponse: (responseData: ObraEntity) => {
        console.log(responseData)

        return responseData
      },
    }),
  }),
})

export const { useAddObraMutation } = obraApi
