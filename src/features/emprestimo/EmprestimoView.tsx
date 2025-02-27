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

  const handlePrint = useReactToPrint({
    contentRef: emprestimoRef,
  })

  const handleDevolver = (codigoEmprestimo: number) => {
    sendDevolverEmprestimoRequest(
      codigoEmprestimo,
      devolverEmprestimo,
      setFormError,
      (isSuccess) => {
        toast.dismiss()
        if (isSuccess) {
          toast.success('Obras devolvidas com sucesso', {
            duration: 4000,
          })
          navigate('/dashboard/emprestimos/list')
        } else {
          toast.error(`Erro: ${formError.message}`)
        }
      }
    )
  }

  useEffect(() => {
    isLoadingDevolverEmprestimoRequest && toast.loading('Processando...')
  }, [isLoadingDevolverEmprestimoRequest])

  // Convert codigo to a number
  const codigoNumber = parseInt(codigo || '', 10)

  const { data, error, isLoading } = useGetEmprestimoByCodigoQuery(
    codigoNumber,
    { skip: isNaN(codigoNumber) }
  )

  if (isNaN(codigoNumber)) {
    return <NotFound />
  }

  if (isLoading) return <p>Loading...</p>
  if (error) return <NotFound />

  const emprestimoData = data as EmprestimoEntityResponse

  return (
    <section id="definicoes" className="col pt-2 ms-4">
      <SectionName>Visualizar Empréstimo</SectionName>
      <div id="actions" className="d-flex flex-wrap mb-2 ms-4">
        <button
          className="btn shadow-none btn-primary custom-btn d-flex align-items-center me-3"
          onClick={() => handlePrint()}
        >
          <span className="me-1">Imprimir</span>
        </button>
        <button
          className="btn shadow-none btn-primary custom-btn d-flex align-items-center me-3"
          onClick={() => handleDevolver(emprestimoData.codigo)}
        >
          <span className="me-1">Devolver</span>
        </button>
      </div>

      <EmprestimoRead ref={emprestimoRef} data={emprestimoData} />
    </section>
  )
}

export default EmprestimoView
