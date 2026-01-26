import { SetStateAction } from "react";
import emprestimoApi from "../emprestimo/data/emprestimoApi";
import { EmprestimoEntity, GenerateEmprestimoRequest, GenerateEmprestimoRequestErrorResponse } from "../emprestimo/data/EmprestimoInterfaces";
import { ObraReportRequest, ObraReportErrorResponse, ObraResponse } from "../obra/data/ObraInterfaces"
import { handleErrorResponse } from "@/utils/reusable/ResponseHandler";
import { ErrorResponse } from "@/app/interfaces/ErrorResponse";
import Option from "@/app/interfaces/Option";

/**
 * Send generate obra relatorio request
 * @param request the request to be sent
 * @param generateObraRelatorio mutation function
 * @param onSuccess in case of success, pass data
 * @param setUiError in case of error, update error state
 */
export const sendGenerateObraRelatorioRequest = async (
    request: ObraReportRequest,
    generateObraRelatorio: any,
    onSuccess: (data: ObraResponse[]) => void,
    setUiError: React.Dispatch<SetStateAction<ObraReportErrorResponse>>
) => {
    try {
        const response = await generateObraRelatorio(request).unwrap();
        onSuccess(response);
    } catch (error) {
        handleErrorResponse(error as ErrorResponse<ObraReportErrorResponse>, setUiError);
    }
}

export const sendGenerateEmprestimoRelatorioRequest = async (
    request: GenerateEmprestimoRequest,
    generateEmprestimo: any,
    onSuccess: (data: EmprestimoEntity[]) => void,
    setUiError: React.Dispatch<SetStateAction<GenerateEmprestimoRequestErrorResponse>>
) => {
    try {
        const response = await generateEmprestimo(request).unwrap();
        onSuccess(response);
    } catch (error) {
        handleErrorResponse(error as ErrorResponse<GenerateEmprestimoRequestErrorResponse>, setUiError);
    }
}

export const situacaoOptions: Option[] = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Expirado', value: 'Expirado' },
    { label: 'Devolvido', value: 'Devolvido' }
];
