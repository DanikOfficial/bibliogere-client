import { SetStateAction } from "react";
import { LoginErrorResponse, LoginRequest, LoginResponse, Questao } from "./userInterfaces";
import { handleErrorResponse } from "../../../utils/reusable/ResponseHandler";
import { ErrorResponse } from "../../../app/interfaces/ErrorResponse";
import Option from "../../../app/interfaces/Option";

export const sendLoginRequest = async (
    request: LoginRequest,
    login: any,
    setUIError: React.Dispatch<SetStateAction<LoginErrorResponse>>,
    onLoginSuccess: (loginResponse: LoginResponse) => void
) => {
    try {
        const response = await login(request).unwrap()
        onLoginSuccess(response)
    } catch (error: unknown) {
        handleErrorResponse(
            error as ErrorResponse<LoginErrorResponse>,
            setUIError
        )
    }
}

export const renderQuestoes = (questoes: Questao[]) => {
    const renderedQuestoesOptions = questoes.map((questao) => ({
        value: questao.nome, label: questao.nome
    } as Option))

    return renderedQuestoesOptions
}
