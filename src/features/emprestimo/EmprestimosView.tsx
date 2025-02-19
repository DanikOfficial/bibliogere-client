import { useCallback, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import SectionName from '../../components/dashboard/SectionName'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAllEmprestimos } from './data/emprestimoSlice'
import { renderEmprestimos } from './EmprestimoList/business.logic'
import ControlledInput from '../../components/reusable/ControlledInput'
import { onInputChange } from '../../utils/reusable/CommonFormEventsHandler'
import emprestimoApi from './data/emprestimoApi'

export const EmprestimosView = () => {
  const [pesquisa, setPesquisa] = useState({ utente: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const emprestimosArr = useAppSelector(selectAllEmprestimos)

  const onClickVisualizar = (codigo: number) => {
    navigate(`/dashboard/emprestimos/${codigo}`)
  }

  const emprestimosJSX = renderEmprestimos(emprestimosArr, onClickVisualizar)

  const createNovoEmprestimo = () => {
    navigate('/dashboard/emprestimos/create')
  }

  const onClickPesquisar = useCallback(() => {
    toast.loading('Processando...')
    dispatch(
      emprestimoApi.endpoints.searchEmprestimosByUtente.initiate(
        pesquisa.utente,
        {
          forceRefetch: true,
        }
      )
    ).then(() => toast.dismiss())
  }, [pesquisa.utente, dispatch])

  return (
    <>
      <SectionName>Gestão de Emprestimos</SectionName>
      <div id="novo-emprestimo-wrapper" className="mb-3">
        <button
          className="
        btn
        shadow-none
        btn-primary
        custom-height-btn
        d-flex
        align-items-center
        shadow-none
        mb-2
      "
          onClick={createNovoEmprestimo}
        >
          <span>Novo Emprestimo</span>
          <i className="ms-2 bi bi-plus-square fs-5"></i>
        </button>
      </div>
      <div id="search-utente" className="rounded bg-white py-2 px-3 mb-2">
        <div className="row align-items-center">
          <div className="col-lg mb-2">
            <ControlledInput
              label="Codigo de utente"
              name="utente"
              color="secondary"
              id="utente"
              value={pesquisa.utente}
              onChange={(event) => onInputChange(event, setPesquisa)}
              type="text"
              placeholder="Pesquise o codigo do utente aqui!"
            />
          </div>
          <div className="col-lg-2 d-flex pt-3 align-items-stretch">
            <button
              disabled={!Boolean(pesquisa.utente)}
              onClick={onClickPesquisar}
              className="btn shadow-none btn-primary custom-height-btn d-flex align-items-center"
            >
              <span>Pesquisar</span>
              <i className="bi bi-search ms-2"></i>
            </button>
          </div>
        </div>
      </div>
      <section id="emprestimos" className="pt-4">
        <div className="container-fluid">
          <div className="row">{emprestimosJSX}</div>
        </div>
      </section>
    </>
  )
}
