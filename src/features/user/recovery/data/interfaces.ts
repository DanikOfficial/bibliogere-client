import { ApiError } from "../../../../components/reusable/data/CommonInterfaces"
import { Questoes } from "../../data/userInterfaces"

export interface FetchUserQuestoesByUsernameFormState {
    username: string
}

export interface FetchUserQuestoesByUsernameRequest extends FetchUserQuestoesByUsernameFormState { }

export interface FetchUserQuestoesResponseError extends ApiError<FetchUserQuestoesByUsernameRequest> { }

export interface FetchUserQuestoesByUsernameResponse extends Questoes {
    userActive: boolean,
    firstLogin: boolean
}

export const defaultFetchUserQuestoesResponseErrorState: FetchUserQuestoesResponseError = {
    error: false,
    message: "",
    errors: {
        username: ""
    }
}

export const defaultFormState: FetchUserQuestoesByUsernameFormState = {
    username: ""
}

export interface ValidateSecurityQuestionsState {
  username: string;
  primeiraQuestao: string;
  segundaQuestao: string;
}
