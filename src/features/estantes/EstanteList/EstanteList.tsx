import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '../../../app/hooks'
import { renderEstantes } from './business.logic'
import {
  EstanteEntity,
  EstanteForm,
  EstanteFormErrorResponse,
  defaultEstanteErrorFormState,
} from '../data/EstanteInterfaces'
import { selectAllEstantes } from '../data/estanteSlice'
import {
  sendDeleteEstanteRequest,
  setSelectedEstante,
} from '../manage/business.logic'
import { confirmDelete } from '../../../utils/reusable/CommonBusinessLogic'
import { DeleteOptions } from '../../../components/reusable/data/CommonInterfaces'
import { useDeleteEstanteMutation } from '../data/estanteApi'

const EstanteList = () => {
  const dispatch = useAppDispatch()
  const [uiError, setUIError] = useState<EstanteFormErrorResponse>(
    defaultEstanteErrorFormState
  )

  const [
    deleteEstante,
    {
      isError: isDeleteFailed,
      isSuccess: isDeleteSuccessfull,
      isLoading: isDeleteLoading,
    },
  ] = useDeleteEstanteMutation()

  const deleteOptions: DeleteOptions = {
    promptTitle: 'Deseja apagar esta estante?',
    confirmedText: 'Estante Apagada com sucesso!.',
    confirmedTitle: 'Apagada!',
  }

  const onAlterarEstante = (estante: EstanteEntity) => {
    const selectedEstante: EstanteForm = {
      codigo: estante.codigo,
      nome: estante.nome,
      tipoEstante: { label: estante.tipoEstante, value: estante.tipoEstante },
    }

    setSelectedEstante(dispatch, selectedEstante)
  }
  const onApagarEstante = ({ codigo }: EstanteEntity) =>
    confirmDelete(deleteOptions, (confirmed) => {
      if (confirmed) {
        sendDeleteEstanteRequest(codigo, setUIError, deleteEstante)
      }
    })

  const estantesArr = useAppSelector(selectAllEstantes)

  let estantes: JSX.Element[] = renderEstantes(
    estantesArr,
    onAlterarEstante,
    onApagarEstante
  )

  useEffect(() => {
    if (isDeleteLoading && !isDeleteSuccessfull && !isDeleteFailed) {
      toast.dismiss()
      toast.loading('Tentando apagar estante...')
    } else if (isDeleteFailed && !isDeleteSuccessfull) {
      toast.dismiss()
      toast.error(uiError.message, {
        duration: 5000,
      })
    } else if (isDeleteSuccessfull && !isDeleteFailed) {
      toast.dismiss()
      toast.success('Estante apagada com sucesso!', {
        duration: 5000,
      })
    }
  }, [isDeleteLoading, isDeleteSuccessfull, isDeleteFailed, uiError])

  return (
    <>
      <section id="estantes" className="pt-3">
        <div className="container-fluid">
          <div className="row">{estantes}</div>
        </div>
      </section>
    </>
  )
}

export default EstanteList
