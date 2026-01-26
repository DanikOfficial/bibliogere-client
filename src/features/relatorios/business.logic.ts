import { SetStateAction } from "react";
import emprestimoApi from "../emprestimo/data/emprestimoApi";
import { EmprestimoEntity, GenerateEmprestimoRequest, GenerateEmprestimoRequestErrorResponse } from "../emprestimo/data/EmprestimoInterfaces";
import obraApi from "../obra/data/obraApi"
import { ObraReportRequest, ObraResponse } from "../obra/data/ObraInterfaces"
import { handleErrorResponse } from "@/utils/reusable/ResponseHandler";
import { ErrorResponse } from "@/app/interfaces/ErrorResponse";
import Option from "@/app/interfaces/Option";

/**
 *
 * @param dispatch used to initiate query
 * @param request the request to be sent
 * @param onSuccess in case of success, pass data
 * @param onError in case of error,
 */
export const sendGerarObraRelatiorioRequest = (
    dispatch: any,
    request: ObraReportRequest,
    onSuccess: (obraResponse: ObraResponse[]) => void,
    onError: (errorMessage: string) => void
) => {
    dispatch(obraApi.endpoints.getObrasRelatorio.initiate(request), {
        forceRefetch: true,
    })
        .then((result: any) => {
            if (result.isError) {
                onError(result.error.data.message as string);
                return;
            } else {
                onSuccess(result.data);
            }
        });
};

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
        console.log("Error generating emprestimo report: ", error);
        handleErrorResponse(error as ErrorResponse<GenerateEmprestimoRequestErrorResponse>, setUiError);
    }
}


export const situacaoOptions: Option[] = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Expirado', value: 'Expirado' },
    { label: 'Devolvido', value: 'Devolvido' }
];
