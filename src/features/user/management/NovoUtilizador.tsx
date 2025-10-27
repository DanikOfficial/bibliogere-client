import React, { useEffect, useState } from "react";

import { AtendenteForm, AtendenteRequest, AtendenteResponseError, defaultAtendenteFormState, defaultAtendenteResponseError } from "./data/atendenteInterfaces";
import ControlledInput from "../../../components/reusable/ControlledInput";
import { onInputChange } from "../../../utils/reusable/CommonFormEventsHandler";
import { useCreateAtendenteMutation } from "../../../app/services/userApi";
import { sendCreateAtendenteRequest } from "./data/business.logic";
import toast from "react-hot-toast";


export default function NovoUtilizador() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState<AtendenteForm>(defaultAtendenteFormState);
    const [error, setError] = useState<AtendenteResponseError>(defaultAtendenteResponseError);

    const [createAtendente, { isLoading }] = useCreateAtendenteMutation()

    const onClickCreate = () => {
        const createAtendenteRequest: AtendenteRequest = {
            nome: form.nome,
            username: form.username
        };

        sendCreateAtendenteRequest(
            createAtendenteRequest,
            createAtendente,
            setError,
            (isSuccess) => {

                if (isSuccess) {
                    setForm(defaultAtendenteFormState);
                    setOpen(false);
                    toast.success("Utilizador criado com sucesso!", { duration: 3000 });
                }
            }
        );
    }

    const toggleCreateAtendente = () => {
        setOpen(!open);
        setError(defaultAtendenteResponseError);
    }

    return (
        <div>
            <div id="novo-utilizador-wrapper" className="mb-3">
                <button
                    type="button"
                    className="btn shadow-none btn-primary custom-height-btn d-flex align-items-center shadow-none"
                    onClick={toggleCreateAtendente}
                    aria-expanded={open}
                    aria-controls="novo-utilizador-section"
                >
                    <span>Novo Utilizador</span>
                    <i className="ms-2 bi bi-plus-square fs-5" />
                </button>
            </div>

            <section
                id="novo-utilizador-section"
                className={`custom-radius w-50 bg-white py-2 px-3 mb-2 ${open ? "d-block" : "d-none"
                    }`}
            >
                {error.error && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                        <svg className="me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
                        </svg>
                        <div>
                            <strong>Erro:</strong> {error.message}
                        </div>
                    </div>
                )}
                <div className="row mb-2">
                    <div className="col-lg-7">
                        <ControlledInput
                            id="nome"
                            name="nome"
                            label="Nome do Utilizador"
                            type="text"
                            placeholder="Digite o nome do utilizador!"
                            value={form.nome}
                            onChange={(event) => onInputChange(event, setForm)}
                            color={"secondary"}
                            error={error.errors?.nome} />
                    </div>
                    <div className="col-lg-5 mb-2">
                        <ControlledInput
                            id="username"
                            name="username"
                            label="Id do Utilizador"
                            type="text"
                            placeholder="Digite o id do utilizador!"
                            value={form.username}
                            onChange={(event) => onInputChange(event, setForm)}
                            color={"secondary"}
                            error={error.errors?.username} />
                    </div>
                </div>

                <div className="d-flex mb-2">
                    <button
                        type="submit"
                        className="btn shadow-none btn-primary custom-btn d-flex align-items-center me-2"
                        disabled={isLoading}
                        onClick={onClickCreate}
                    >
                        {isLoading ? (
                            <i className="bi bi-arrow-clockwise rotate fs-4"></i>
                        ) : (
                            <span className="me-1">Confirmar</span>
                        )}
                    </button>

                    <button
                        type="button"
                        className="btn shadow-none btn-danger text-light custom-btn d-flex align-items-center me-2"
                        onClick={toggleCreateAtendente}
                        disabled={isLoading}
                    >
                        <span>Cancelar</span>
                        <i className="bi bi-x-square ms-2" />
                    </button>
                </div>
            </section>
        </div>
    );
}
