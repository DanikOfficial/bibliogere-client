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
        if (!open) {
            setForm(defaultAtendenteFormState);
        }
    }

    useEffect(() => {
        if (isLoading) {
            toast.dismiss();
            toast.loading('Criando utilizador...');
        } else {
            toast.dismiss();
        }
    }, [isLoading]);

    useEffect(() => {
        if (error.error) {
            toast.dismiss();
        }
    }, [error.error]);

    return (
        <>
            <div id="novo-utilizador-wrapper" className="mb-3">
                <button
                    className="btn btn-primary novo-utilizador-btn d-inline-flex align-items-center position-relative overflow-hidden"
                    onClick={toggleCreateAtendente}
                    style={{
                        padding: '0.5rem 1rem',
                        fontSize: '1rem',
                        fontWeight: '500',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
                        transition: 'all 0.2s ease',
                        boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
                    }}
                >
                    <span className="btn-content d-flex align-items-center gap-2 position-relative z-1">
                        <i className="bi bi-plus-circle-fill"></i>
                        <span>Novo Utilizador</span>
                    </span>
                    <div className="btn-shine position-absolute top-0 start-0 w-100 h-100"></div>
                </button>
            </div>

            {open && (
                <section
                    id="novo-utilizador-section"
                    className="card border-0 shadow-sm mb-3 animate-slide-down"
                    style={{ borderRadius: '12px', overflow: 'hidden' }}
                >
                    {/* Card Header */}
                    <div
                        className="card-header border-0 py-2 px-3"
                        style={{
                            background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)'
                        }}
                    >
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center text-white">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle bg-white me-2"
                                    style={{ width: '32px', height: '32px' }}
                                >
                                    <i className="bi bi-person-plus-fill" style={{ color: '#2563eb', fontSize: '1rem' }}></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold">
                                        Criar Novo Utilizador
                                    </h6>
                                    <small style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                                        Adicione um novo utilizador ao sistema
                                    </small>
                                </div>
                            </div>
                            <button
                                className="btn btn-sm btn-link text-white p-0"
                                onClick={toggleCreateAtendente}
                                style={{ fontSize: '1.2rem', opacity: 0.8 }}
                            >
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="card-body p-3">
                        {error.error && (
                            <div className="alert alert-danger d-flex align-items-center mb-3 py-2" role="alert" style={{ borderRadius: '8px' }}>
                                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                <small><strong>Erro:</strong> {error.message}</small>
                            </div>
                        )}

                        <div className="row g-3">
                            <div className="col-lg-7">
                                <ControlledInput
                                    id="nome"
                                    name="nome"
                                    label="Nome do Utilizador"
                                    type="text"
                                    placeholder="Digite o nome do utilizador"
                                    value={form.nome}
                                    onChange={(event) => onInputChange(event, setForm)}
                                    color="primary"
                                    error={error.errors?.nome}
                                    autoFocus
                                />
                            </div>
                            <div className="col-lg-5">
                                <ControlledInput
                                    id="username"
                                    name="username"
                                    label="ID do Utilizador"
                                    type="text"
                                    placeholder="Digite o ID do utilizador"
                                    value={form.username}
                                    onChange={(event) => onInputChange(event, setForm)}
                                    color="primary"
                                    error={error.errors?.username}
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="d-flex gap-2 mt-3 pt-3 border-top">
                            <button
                                className="btn btn-primary flex-grow-1 d-flex align-items-center justify-content-center shadow-sm"
                                onClick={onClickCreate}
                                disabled={isLoading}
                                style={{
                                    borderRadius: '8px',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        <span>Salvando...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-check-circle me-2"></i>
                                        <span>Confirmar</span>
                                    </>
                                )}
                            </button>
                            <button
                                className="btn btn-outline-danger d-flex align-items-center justify-content-center"
                                onClick={toggleCreateAtendente}
                                disabled={isLoading}
                                style={{
                                    borderRadius: '8px',
                                    minWidth: '100px'
                                }}
                            >
                                <i className="bi bi-x-circle me-2"></i>
                                <span>Cancelar</span>
                            </button>
                        </div>
                    </div>
                </section>
            )}

            <style>{`
                .novo-utilizador-btn {
                    letter-spacing: 0.3px;
                }

                .novo-utilizador-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3) !important;
                }

                .novo-utilizador-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2) !important;
                }

                .btn-shine {
                    background: linear-gradient(
                        90deg,
                        transparent 0%,
                        rgba(255, 255, 255, 0.3) 50%,
                        transparent 100%
                    );
                    transform: translateX(-100%);
                    transition: transform 0.6s ease;
                    pointer-events: none;
                }

                .novo-utilizador-btn:hover .btn-shine {
                    transform: translateX(100%);
                }

                .novo-utilizador-btn:focus {
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3) !important;
                }

                .novo-utilizador-btn i {
                    transition: transform 0.3s ease;
                }

                .novo-utilizador-btn:hover i {
                    transform: rotate(90deg);
                }

                .z-1 {
                    z-index: 1;
                }

                .animate-slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3) !important;
                }

                .btn-outline-danger:hover:not(:disabled) {
                    transform: translateY(-2px);
                }
            `}</style>
        </>
    );
}