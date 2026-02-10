import React, { useEffect, useRef, useState } from 'react'
import SectionName from '../../components/dashboard/SectionName'
import { useNavigate, useParams } from 'react-router-dom'
import NotFound from '../../components/NotFound'
import {
  useDevolverEmprestimoMutation,
  useGetEmprestimoByCodigoQuery,
} from './data/emprestimoApi'
import EmprestimoRead from './EmprestimoRead'
import {
  defaultEmprestimoErrorResponse,
  EmprestimoEntityResponse,
  EmprestimoFormErrorResponse,
} from './data/EmprestimoInterfaces'
import { useReactToPrint } from 'react-to-print'
import { sendDevolverEmprestimoRequest } from './data/business.logic'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'

const EmprestimoView: React.FC = () => {
  const { codigo } = useParams<{ codigo: string }>()
  const navigate = useNavigate()
  const emprestimoRef = useRef<HTMLDivElement>(null)
  const [formError, setFormError] = useState<EmprestimoFormErrorResponse>(
    defaultEmprestimoErrorResponse
  )

  const [
    devolverEmprestimo,
    { isLoading: isLoadingDevolverEmprestimoRequest },
  ] = useDevolverEmprestimoMutation()

  const codigoNumber = parseInt(codigo || '', 10)

  const { data, error, isLoading } = useGetEmprestimoByCodigoQuery(
    codigoNumber,
    { skip: isNaN(codigoNumber) }
  )

  const handlePrint = useReactToPrint({
    content: () => emprestimoRef.current,
    documentTitle: `Emprestimo_${codigo}_${new Date().toLocaleDateString('pt-PT')}`,
    onAfterPrint: () => {
      toast.success('Recibo impresso com sucesso!')
    },
  })

  const handleDevolver = async (codigoEmprestimo: number) => {
    const result = await Swal.fire({
      title: 'Confirmar Devolução',
      html: `
        <p>Tem a certeza que deseja marcar este empréstimo como devolvido?</p>
        <p class="text-muted small mt-2">Esta ação não pode ser revertida.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#6c757d',
      confirmButtonText: '<i class="bi bi-check-circle me-1"></i> Sim, devolver',
      cancelButtonText: '<i class="bi bi-x-circle me-1"></i> Cancelar',
      reverseButtons: true,
      focusCancel: true,
    })

    if (!result.isConfirmed) {
      return
    }

    sendDevolverEmprestimoRequest(
      codigoEmprestimo,
      devolverEmprestimo,
      setFormError,
      (isSuccess) => {
        toast.dismiss()
        if (isSuccess) {
          toast.success('Obras devolvidas com sucesso', {
            duration: 4000,
            icon: '✅',
          })
          setTimeout(() => {
            navigate('/dashboard/emprestimos/list')
          }, 1000)
        } else {
          toast.error(`Erro: ${formError.message}`, {
            duration: 5000,
            icon: '❌',
          })
        }
      }
    )
  }

  const handleGoBack = () => {
    navigate("/dashboard/emprestimos/list")
  }

  useEffect(() => {
    if (isLoadingDevolverEmprestimoRequest) {
      toast.loading('Processando devolução...', {
        id: 'devolver-loading',
      })
    } else {
      toast.dismiss('devolver-loading')
    }
  }, [isLoadingDevolverEmprestimoRequest])

  // Early returns for error states
  if (isNaN(codigoNumber)) {
    return <NotFound />
  }

  if (isLoading) {
    return (
      <section id="definicoes" className="col pt-3 px-3">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">A carregar...</span>
            </div>
            <p className="text-muted">A carregar empréstimo...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return <NotFound />
  }

  const emprestimoData = data as EmprestimoEntityResponse
  const isDevolvido = emprestimoData.itens.every(
    item => item.situacao.toLowerCase() === 'devolvido'
  )

  return (
    <section id="definicoes" className="col pt-3 px-3 position-relative">
      <div className="d-flex align-items-center justify-content-between mb-3">

        <div></div>

        <SectionName
          align="center"
          withIcon="bi-shield-check"
          subtitle="Visualizar detalhes do empréstimo selecionado"
        >
          Visualizar Empréstimo
        </SectionName>

        <button
          className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
          onClick={handleGoBack}
          aria-label="Voltar"
        >
          <i className="bi bi-arrow-left"></i>
          <span>Voltar</span>
        </button>
      </div>

      {/* Action Buttons */}
      <div id="actions" className="d-flex flex-wrap gap-2 mb-3 ms-4">
        <button
          className="btn btn-primary d-flex align-items-center gap-2 shadow-sm"
          onClick={handlePrint}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
          }}
        >
          <i className="bi bi-printer-fill"></i>
          <span>Imprimir</span>
        </button>

        <button
          className={`btn ${isDevolvido ? 'btn-secondary' : 'btn-success'} d-flex align-items-center gap-2 shadow-sm`}
          onClick={() => handleDevolver(emprestimoData.codigo)}
          disabled={isDevolvido || isLoadingDevolverEmprestimoRequest}
          style={{
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            cursor: isDevolvido ? 'not-allowed' : 'pointer',
          }}
        >
          {isLoadingDevolverEmprestimoRequest ? (
            <>
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              <span>Processando...</span>
            </>
          ) : (
            <>
              <i className={`bi ${isDevolvido ? 'bi-check-circle-fill' : 'bi-arrow-return-left'}`}></i>
              <span>{isDevolvido ? 'Já Devolvido' : 'Devolver Obras'}</span>
            </>
          )}
        </button>
      </div>

      {/* Status Badge */}
      {isDevolvido && (
        <div className="alert alert-success d-flex align-items-center gap-2 ms-4 me-4" role="alert">
          <i className="bi bi-check-circle-fill fs-5"></i>
          <div>
            <strong>Empréstimo Concluído</strong>
            <p className="mb-0 small">Todas as obras deste empréstimo já foram devolvidas.</p>
          </div>
        </div>
      )}

      {/* Receipt Component */}
      <EmprestimoRead ref={emprestimoRef} data={emprestimoData} />

      {/* Styles */}
      <style>{`
        #actions button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
        }

        #actions button:not(:disabled):active {
          transform: translateY(0);
        }

        #actions button:disabled {
          opacity: 0.6;
        }

        @media (max-width: 768px) {
          #actions {
            flex-direction: column;
            align-items: stretch;
          }

          #actions button {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}

export default EmprestimoView
