import { SetStateAction } from "react";
import Utilizador, { UtilizadorPros } from "../Utilizador";
import { AtendenteInfo, AtendenteRequest, AtendenteResponseError } from "./atendenteInterfaces";
import { handleErrorResponse } from "../../../../utils/reusable/ResponseHandler";
import { ErrorResponse } from "../../../../app/interfaces/ErrorResponse";

export const renderUtilizadores = (
    atendentes: AtendenteInfo[],
    onApagar: (codigo: number) => void,
    onDesativar: (codigo: number) => void
) => {
    const rendered = atendentes.map((atendente) => {
        const utilizadorProps: UtilizadorPros = {
            atendente,
            onApagar,
            onDesativar,
        };

        const key = (atendente as any).codigo ?? (atendente as any).id ?? (atendente as any).uuid;
        return <Utilizador key={String(key)} {...utilizadorProps} />;
    });

    return rendered;
};

export const sendCreateAtendenteRequest = async (
    atendenteRequest: AtendenteRequest,
    createAtendente: any,
    setUiError: React.Dispatch<SetStateAction<AtendenteResponseError>>,
    onSuccess: (isSuccess: boolean) => void
) => {
    try {
        await createAtendente(atendenteRequest).unwrap();
        onSuccess(true)
    } catch (error: unknown) {
        handleErrorResponse(error as ErrorResponse<AtendenteResponseError>, setUiError)
    }
}

export const sendToggleAtendenteStatus = async (
    atendenteCodigo: number,
    setUiError: React.Dispatch<SetStateAction<AtendenteResponseError>>,
    toggleAtendente: any,
    onSuccess: (isSuccess: boolean) => void
) => {
    try {
        await toggleAtendente(atendenteCodigo).unwrap();
        onSuccess(true)
    } catch (error: unknown) {
        handleErrorResponse(error as ErrorResponse<AtendenteResponseError>, setUiError)
    }
}

export const sendDeleteAtendenteRequest = async (
    atendenteCodigo: number,
    deleteAtendente: any,
    setUiError: React.Dispatch<SetStateAction<AtendenteResponseError>>,
    onSuccess: (isSuccess: boolean) => void
) => {
    try {
        await deleteAtendente(atendenteCodigo).unwrap();
        onSuccess(true)
    } catch (error: unknown) {
        handleErrorResponse(error as ErrorResponse<AtendenteResponseError>, setUiError)
    }
}
