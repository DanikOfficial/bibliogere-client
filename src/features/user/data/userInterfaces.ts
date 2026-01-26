import { ApiError } from "../../../components/reusable/data/CommonInterfaces"
import type Option from "../../../app/interfaces/Option"

export interface ErrorState {
  error: boolean
  message: string | null
  errors: {
    username: string | null
  }
}

export interface Questao {
  codigo: number;
  nome: string;
}


export interface LoginRequest {
  username: string
  password: string
}

export interface UserData {
  nome: string
  username: string
  token: string
  permissoes: []
}

export interface Permissao {
  codigo: number;
  nome: string;
}

export interface LoginResponse {
  codigo: number;
  username: string;
  nome: string;
  permissoes: Permissao[];
  questoes: Questoes,
  token: string;
  isActive: boolean;
  firstLogin: boolean;
}

export interface UserQuestoesResponse {
  primeiraQuestao: string,
  segundaQuestao: string
}

export interface LoginErrorResponse extends ApiError<LoginRequest> { }

export const defaultLoginFormState: LoginRequest = {
  username: "",
  password: "",
}

export const defaultLoginErrorResponse: LoginErrorResponse = {
  message: "",
  error: false,
  errors: {
    username: "",
    password: ""
  },
}

export interface Questoes {
  primeiraQuestao: string,
  segundaQuestao: string
}

export interface BaseValidarQuestoesRequest extends Questoes {
  primeiraResposta: string,
  segundaResposta: string
}

export interface ValidarQuestoesFromRecoveryRequest extends BaseValidarQuestoesRequest {
  username: string,
}

export const defaultValidarQuestoesFromRecoveryRequest: ValidarQuestoesFromRecoveryRequest = {
  username: "",
  primeiraQuestao: "",
  segundaQuestao: "",
  primeiraResposta: "",
  segundaResposta: ""
}

export interface ValidarQuestoesFromRecoveryErrorResponse extends ApiError<ValidarQuestoesFromRecoveryRequest> {
  firstQuestionValid: Boolean,
  secondQuestionValid: Boolean,
}

export const defaultValidarQuestoesFromRecoveryErrorResponse: ValidarQuestoesFromRecoveryErrorResponse = {
  message: "",
  firstQuestionValid: true,
  secondQuestionValid: true,
  error: false,
  errors: {
    primeiraQuestao: "",
    segundaQuestao: "",
    primeiraResposta: "",
    segundaResposta: "",
    username: ""
  },
}

export interface ValidarQuestoesRequest extends BaseValidarQuestoesRequest {
  codigoUtilizador: number,
}

export interface ValidarQuestoesResponse {
  message: string,
  valid: boolean,
  firstQuestionValid: Boolean,
  secondQuestionValid: Boolean,
  firstQuestionMessage: string,
  secondQuestionMessage: string
}

export const defaultValidarQuestoesRequest: ValidarQuestoesRequest = {
  codigoUtilizador: 0o0,
  primeiraQuestao: "",
  segundaQuestao: "",
  primeiraResposta: "",
  segundaResposta: ""
}

export interface ValidarQuestoesErrorResponse extends ApiError<ValidarQuestoesRequest> {
  firstQuestionValid: Boolean,
  secondQuestionValid: Boolean,
}


export const defaultValidarQuestoesErrorResponse: ValidarQuestoesErrorResponse = {
  firstQuestionValid: true,
  secondQuestionValid: true,
  message: "",
  error: false,
  errors: {
    primeiraQuestao: "",
    segundaQuestao: "",
    primeiraResposta: "",
    segundaResposta: "",
    codigoUtilizador: -1
  },
}

export interface AlterarQuestoesForm {
  primeiraQuestao: Option,
  segundaQuestao: Option,
  primeiraResposta: string,
  segundaResposta: string
}

export const defaultAlterarQuestoesForm: AlterarQuestoesForm = {
  primeiraQuestao: { value: "", label: "" },
  segundaQuestao: { value: "", label: "" },
  primeiraResposta: "",
  segundaResposta: ""
}

export interface AtualizarQuestoesRequest {
  codigoUtilizador: number,
  primeiraQuestao: string,
  segundaQuestao: string,
  primeiraResposta: string,
  segundaResposta: string,
  updating: boolean;
}

export const defaultAlterarQuestaoRequest: AtualizarQuestoesRequest = {
  codigoUtilizador: 0o0,
  primeiraQuestao: "",
  segundaQuestao: "",
  primeiraResposta: "",
  segundaResposta: "",
  updating: true
}

export interface AlterarQuestoesErroResponse extends ApiError<AtualizarQuestoesRequest> { }

export const defaultAlterarQuestoesErrorResponse: AlterarQuestoesErroResponse = {
  error: false,
  message: "",
  errors: {
    codigoUtilizador: -1,
    primeiraQuestao: "",
    segundaQuestao: "",
    segundaResposta: "",
    primeiraResposta: "",
    updating: false
  }
}
