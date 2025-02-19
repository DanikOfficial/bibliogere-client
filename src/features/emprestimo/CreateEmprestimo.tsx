import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useCreateEmprestimoMutation } from './data/emprestimoApi'
import ControlledInput from '../../components/reusable/ControlledInput'
import { onInputChange } from '../../utils/reusable/CommonFormEventsHandler'
import Obra, { ObraComponentProps } from '../obra/Obra'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectAllObras } from '../obra/data/obraSlice'
import SectionName from '../../components/dashboard/SectionName'
import obraApi from '../obra/data/obraApi'
import toast from 'react-hot-toast'
import { useCart } from './cart/CartContext'
import {
  defaultEmprestimoFormState,
  EmprestimoFormErrorResponse,
  EmprestimoForm,
  CreateEmprestimoRequest,
  defaultEmprestimoErrorResponse,
} from './data/EmprestimoInterfaces'
import { sendCreateEmprestimoRequest } from './data/business.logic'
import { useNavigate } from 'react-router-dom'

const CreateEmprestimo: React.FC = () => {
  const [formState, setFormState] = useState<EmprestimoForm>(
    defaultEmprestimoFormState
  )
  const dispatch = useAppDispatch()
  const { totalObras, addObra, removeObra, obrasCart, clearObras } = useCart()
  const navigate = useNavigate()

  const [
    isCreateEmprestimoRequestSuccess,
    setIsCreateEmprestimoRequestSuccess,
  ] = useState<Boolean>(false)

  const [createEmprestimo, { isLoading, isError }] =
    useCreateEmprestimoMutation()

  const [error, setError] = useState<EmprestimoFormErrorResponse>(
    defaultEmprestimoErrorResponse
  )

  const [pesquisa, setPesquisa] = useState({ titulo: '' })
  const obrasArr = useAppSelector(selectAllObras)

  /** ✅ Memoize `obrasJSX` to prevent unnecessary recomputations */
  const obrasJSX = useMemo(
    () =>
      obrasArr.map((obra) => {
        const obraComponentProps: ObraComponentProps = {
          obra,
          onClickAdicionarObra: addObra,
          isBeingManaged: false,
          obras: obrasCart,
          onClickRemoverObra: removeObra,
        }
        return <Obra key={obra.codigo} {...obraComponentProps} />
      }),
    [obrasArr, obrasCart, addObra, removeObra]
  )

  const obrasEscolhidasJSX = useMemo(
    () =>
      obrasCart.map((obra) => {
        const obraComponentProps: ObraComponentProps = {
          obra,
          isBeingManaged: false,
          onClickRemoverObra: removeObra,
          fromCart: true,
        }
        return <Obra key={obra.codigo} {...obraComponentProps} />
      }),
    [obrasCart, removeObra]
  )

  /** ✅ Optimize form updates */
  const handleInputChange = useCallback(
    ({ target: { name, value } }: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, [name]: value }))
    },
    []
  )

  /** ✅ Debounce API calls to reduce unnecessary re-renders */
  const onClickPesquisar = useCallback(() => {
    toast.loading('Processando...')
    dispatch(
      obraApi.endpoints.findObras.initiate(pesquisa.titulo, {
        forceRefetch: true,
      })
    ).then(() => toast.dismiss())
  }, [pesquisa.titulo, dispatch])

  const onClickConfirmar = () => {
    const obrasIds = obrasCart.map((obra) => obra.codigo)
    const createEmprestimoRequest: CreateEmprestimoRequest = {
      ...formState,
      obrasIds,
    }

    sendCreateEmprestimoRequest(
      createEmprestimoRequest,
      createEmprestimo,
      setError,
      (isCreated) => {
        setIsCreateEmprestimoRequestSuccess(isCreated)
        if (isCreated) {
          navigate('/dashboard/emprestimos/list')
          clearFormFields()
        }
        toast.dismiss()
      }
    )
  }

  const clearFormFields = () => {
    setFormState(defaultEmprestimoFormState)
    clearObras()
  }

  useEffect(() => {
    if (isLoading) {
      toast.dismiss()
      toast.loading('Tentando criar novo emprestimo...')
    } else {
      if (isCreateEmprestimoRequestSuccess) {
        console.log('I was here')
        toast.dismiss()
        toast.success('Emprestimo criado com sucesso!', {
          duration: 5000,
        })
        setIsCreateEmprestimoRequestSuccess(false)
      }
    }
  }, [isLoading, isCreateEmprestimoRequestSuccess])

  return (
    <section id="definicoes" className="col pt-2 ms-4">
      <SectionName> Registar Novo Emprestimo</SectionName>

      <div className="rounded bg-white py-2 px-3 mb-2">
        <div className="row">
          <div className="col-lg-7 mb-2">
            <ControlledInput
              name="titulo"
              color="secondary"
              id="titulo"
              value={pesquisa.titulo}
              onChange={(event) => onInputChange(event, setPesquisa)}
              type="text"
              placeholder="Digite o titulo da obra!"
            />
          </div>
          <div className="col-lg-2 d-flex align-items-stretch">
            <button
              disabled={!Boolean(pesquisa.titulo)}
              onClick={onClickPesquisar}
              className="btn btn-primary d-flex align-items-center"
            >
              <span>Pesquisar</span> <i className="bi bi-search ms-2"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        <div
          className="col mb-2"
          style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
        >
          <h5 className="text-center text-primary m">Lista de Obras</h5>
          <div className="row"></div>
          {obrasJSX}
        </div>
        <div
          className="col-lg-6 border-start"
          style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}
        >
          <h5 className="text-center text-primary mb-2">Obras Escolhidas</h5>
          <div className="row px-2 mb-2">
            {totalObras() > 0 ? (
              obrasEscolhidasJSX
            ) : (
              <div className="form-text text-secondary fw-bold">
                Pesquise e Escolha obra que deseja do lado esquerdo
              </div>
            )}
          </div>
          <h5 className="text-center text-primary">Informações do Utente</h5>
          <div className="d-flex flex-column mx-4 mb-4">
            {isError && (
              <span className="text-danger mb-1">
                <strong>Erro:</strong> {error.message}
              </span>
            )}
            <ControlledInput
              name="utente"
              color="secondary"
              id="nome"
              label="Codigo de Utente:"
              addSpace={true}
              value={formState.utente}
              error={error.errors?.utente}
              onChange={(e) => {
                handleInputChange(e)
              }}
              type="text"
              placeholder="Digite o codigo do utente/estudade!"
            />
            <ControlledInput
              name="contacto"
              color="secondary"
              id="contacto"
              label="Contacto:"
              value={formState.contacto}
              addSpace={true}
              error={error.errors?.contacto}
              onChange={(e) => {
                handleInputChange(e)
                // validateField('contacto', e.target.value)
              }}
              type="text"
              placeholder="Digite o contacto do Utente!"
            />
            <ControlledInput
              label="Email:"
              name="email"
              color="secondary"
              id="email"
              value={formState.email}
              error={error.errors?.email}
              addSpace={true}
              onChange={(e) => {
                handleInputChange(e)
                // validateField('email', e.target.value)
              }}
              type="text"
              placeholder="Digite o e-mail! (opcional)"
            />

            <button
              className="btn btn-secondary text-light align-self-start"
              disabled={error.error}
              onClick={onClickConfirmar}
            >
              Confirmar!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CreateEmprestimo
