import { SetStateAction } from "react";
import { FetchUserQuestoesByUsernameRequest, FetchUserQuestoesByUsernameResponse, FetchUserQuestoesResponseError } from "./interfaces";
import { handleErrorResponse } from "../../../../utils/reusable/ResponseHandler";
import { ErrorResponse } from "../../../../app/interfaces/ErrorResponse";
import { LoginResponse, ValidarQuestoesFromRecoveryErrorResponse, ValidarQuestoesFromRecoveryRequest, ValidarQuestoesResponse } from "../../data/userInterfaces";
import { CreatePasswordRequest, CreatePasswordErrorResponse } from "@/features/definicoes/data/DefinicoesInterfaces";

export const sendFetchUserQuestoesByUsername = async (
    request: FetchUserQuestoesByUsernameRequest,
    fetchUserQuestoes: any,
    setUiError: React.Dispatch<SetStateAction<FetchUserQuestoesResponseError>>,
    onSuccess: (response: FetchUserQuestoesByUsernameResponse) => void
) => {

    try {
        const response = await fetchUserQuestoes(request).unwrap();
        onSuccess(response);
    } catch (error: unknown) {
        // Assuming handleErrorResponse is a utility function to handle errors
        handleErrorResponse(
            error as ErrorResponse<FetchUserQuestoesResponseError>,
            setUiError
        );
    }
};


export const sendValidarQuestoesFromRecoveryRequest = async (
    request: ValidarQuestoesFromRecoveryRequest,
    validateQuestoesFromRecovery: any,
    setUiError: React.Dispatch<SetStateAction<ValidarQuestoesFromRecoveryErrorResponse>>,
    onSuccess: (response: ValidarQuestoesResponse) => void
) => {

    try {
        const response = await validateQuestoesFromRecovery(request).unwrap();
        onSuccess(response);
    } catch (error: unknown) {
        // Assuming handleErrorResponse is a utility function to handle errors
        handleErrorResponse(
            error as ErrorResponse<ValidarQuestoesFromRecoveryErrorResponse>,
            setUiError
        );
    }
}

export const sendCreatePasswordRequest = async (
    request: CreatePasswordRequest,
    createPassword: any,
    setUiError: React.Dispatch<SetStateAction<CreatePasswordErrorResponse>>,
    onSuccess: (response: LoginResponse) => void  // Changed from boolean to LoginResponse
) => {
    try {
        const response = await createPassword(request).unwrap();
        onSuccess(response);  // Pass the response instead of true
    } catch (error: unknown) {
        handleErrorResponse(
            error as ErrorResponse<CreatePasswordErrorResponse>,
            setUiError
        );
    }
};