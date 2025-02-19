import { api } from "../../api/apiSlice";
import Logger from "../../../utils/reusable/Logger";
import { CreateEmprestimoRequest, CreateEmprestimoResponse, EmprestimoEntity } from "./EmprestimoInterfaces";
import { emprestimoAdded, emprestimoDeleted, emprestimosAdded, emprestimoSelected } from "./emprestimoSlice";

const logger = Logger.getInstance()

const emprestimoApi = api.injectEndpoints({
    endpoints: (build) => ({
        createEmprestimo: build.mutation<CreateEmprestimoResponse, CreateEmprestimoRequest>({
            query: (emprestimo: CreateEmprestimoRequest) => ({
                url: "/atendente/emprestimos",
                method: "POST",
                body: emprestimo
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled

                console.log("Created Obra")

                if (data) {
                    logger.log("Create Emprestimo Successfully executed")
                    dispatch(emprestimoAdded(data))
                }
            }
        }),
        getEmprestimoByCodigo: build.query<EmprestimoEntity, number>({
            query: (codigoEmprestimo: number) => ({
                url: `/atendente/emprestimo/${codigoEmprestimo}`
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled

                if (data) {
                    logger.log("Emprestimo fetched successfully")
                    dispatch(emprestimoSelected(data))
                }
            }
        }),
        searchEmprestimosByUtente: build.query<EmprestimoEntity[], string>({
            query: (utente: string) => ({
                url: `/atendente/emprestimos/pesquisa?utente=${utente}`
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled

                if (data) {
                    logger.log("Emprestimos fetched successfully")
                    dispatch(emprestimosAdded(data))
                }
            }
        }),
        devolverEmprestimo: build.mutation<EmprestimoEntity, number>({
            query: (codigoEmprestimo: number) => ({
                url: `/atendente/emprestimo/${codigoEmprestimo}/devolver`,
                method: "PATCH"
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data } = await queryFulfilled

                if (data) {
                    logger.log("Emprestimos fetched successfully")
                    dispatch(emprestimoDeleted(data.codigo))
                }
            }
        })
    })
})

export const { useCreateEmprestimoMutation, useDevolverEmprestimoMutation, useGetEmprestimoByCodigoQuery } = emprestimoApi

export default emprestimoApi
