import { useState } from "react"
import { AtendenteInfo, AtendenteResponseError, defaultAtendenteResponseError } from "./data/atendenteInterfaces"
import { renderUtilizadores, sendDeleteAtendenteRequest, sendToggleAtendenteStatus } from "./data/business.logic"
import { useAppSelector } from "../../../app/hooks"
import { selectAllAtendentes } from "./data/atendenteSlice"
import { useDeleteAtendenteMutation, useDisableAtendenteMutation } from "../../../app/services/userApi"
import toast from "react-hot-toast"

const UtilizadoresList = () => {
    const rawAtendentes = useAppSelector(selectAllAtendentes)
    const [error, setError] = useState<AtendenteResponseError>(defaultAtendenteResponseError)

    const [deleteAtendente, { isLoading: isLoadingAtendenteDelete, isSuccess, isError }] = useDeleteAtendenteMutation()
    const [disableAtendente, { isLoading: isLoadingAtendenteToggle }] = useDisableAtendenteMutation()

    const onApagar = (codigo: number) => {
        sendDeleteAtendenteRequest(codigo, deleteAtendente, setError, (success) => {
            if (success) {
                toast.success("Atendente removido com sucesso", { duration: 3000 })
            } else if (isError) {
                toast.error(error.message, { duration: 3000 })
            }
        })
    }

    const onDesativar = (codigo: number) => {
        sendToggleAtendenteStatus(codigo, setError, disableAtendente, (success) => {
            if (success) {
                toast.success("Estado do Atendente alterado com sucesso", { duration: 3000 })
            } else if (isError) {
                toast.error(error.message, { duration: 3000 })
            }
        })
    }

    let atendentes: JSX.Element[] = renderUtilizadores(
        rawAtendentes,
        onApagar,
        onDesativar
    )

    return <>{atendentes}</>
}

export default UtilizadoresList
