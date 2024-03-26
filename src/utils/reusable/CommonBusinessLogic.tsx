import toast from 'react-hot-toast'
import type Option from '../../app/interfaces/Option'
import {
  DeleteOptions,
  ToastOptions,
} from '../../components/reusable/data/CommonInterfaces'
import Swal from 'sweetalert2'

export const findSelectedOption =
  <T extends Option>(options: T[]) =>
  (value: String) =>
    options.find(
      (option) => option.value.toString().toUpperCase() === value.toUpperCase()
    ) || ({ value: '', label: '' } as Option)

export const confirmDelete = (
  deleteOptions: DeleteOptions,
  sendDelete: (confirmed: boolean) => void
) => {
  Swal.fire({
    title: deleteOptions.promptTitle,
    text: 'Esta é uma operação Irreversível!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#1000f2',
    cancelButtonColor: '#ee1212',
    confirmButtonText: 'Sim, apagar!',
  }).then((result) => {
    if (result.isConfirmed) {
      sendDelete(true)
    }
  })
}
