import { TipoEstante } from './interfaces'
import type Option from '../../app/interfaces/Option'

export const renderTipoEstantesOptions = (tipoEstantes: TipoEstante[]) => {
  const renderedTipoEstantes = tipoEstantes.map(
    (tipoEstante) =>
      ({
        value: tipoEstante.designacao,
        label: tipoEstante.designacao,
      } as Option)
  )

  return renderedTipoEstantes
}
