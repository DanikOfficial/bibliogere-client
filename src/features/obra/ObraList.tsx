import { FC, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useDeleteObraMutation } from './data/obraApi'
import {
  ObraEntity,
  ObraFormErrorResponse,
  defaultObraFormErrorResponse,
} from './data/ObraInterfaces'
import { DeleteOptions } from '../../components/reusable/data/CommonInterfaces'
import { selectAllObras } from './data/obraSlice'
import { renderObras } from './ObraList/business.logic'
import { confirmDelete } from '../../utils/reusable/CommonBusinessLogic'
import {
  sendDeleteObraRequest,
  sendGetObraRequest,
} from './manage/business.logic'
import toast from 'react-hot-toast'

const deleteOptions: DeleteOptions = {
  promptTitle: 'Deseja apagar esta obra?',
  confirmedText: 'Obra Apagada com sucesso!.',
  confirmedTitle: 'Apagada!',
}

export interface ObraListProps {
  showModal: () => void
}

const ObraList: FC<ObraListProps> = ({ showModal }) => {
  const obrasArr = useAppSelector(selectAllObras)
  const dispatch = useAppDispatch()
  const [uiError, setUIError] = useState<ObraFormErrorResponse>(
    defaultObraFormErrorResponse
  )

  const [
    deleteObra,
    {
      isError: isDeleteFailed,
      isSuccess: isDeleteSuccessfull,
      isLoading: isDeleteLoading,
    },
  ] = useDeleteObraMutation()

  const onClickALterarObra = (obra: ObraEntity) => {
    sendGetObraRequest(dispatch, obra.codigo, (isSuccess) => {
      isSuccess && showModal()
    })
  }

  const onCLickApagarObra = ({ codigo }: ObraEntity) => {
    confirmDelete(
      deleteOptions,
      (isConfirmed) =>
        isConfirmed && sendDeleteObraRequest(codigo, setUIError, deleteObra)
    )
  }

  // TODO: isManaging is determined by the role of the logged user, only admins can manage, for now this will be true
  let obras: JSX.Element[] = renderObras(
    obrasArr,
    onClickALterarObra,
    onCLickApagarObra,
    true,
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

  return <section id="obras">{obras}</section>
}

export default ObraList
