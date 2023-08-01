import type Option from '../../../app/interfaces/Option'
import Estante from '../Estante'
import type { EstanteComponentProps } from '../Estante'
import { EstanteEntity } from '../data/EstanteInterfaces'

export const renderEstantes = (
  estantes: EstanteEntity[],
  onAlterarEstante: (estante: EstanteEntity) => void,
  onApagarEstante: ({ codigo }: EstanteEntity) => void
) => {
  const renderedEstantes = estantes.map((estante) => {
    const estanteComponentProps: EstanteComponentProps = {
      estante,
      onAlterarEstante,
      onApagarEstante,
    }

    return <Estante key={estante.codigo} {...estanteComponentProps} />
  })

  return renderedEstantes
}

export const renderEstantesOptions = (estantes: EstanteEntity[]) => {
  const renderedEstantesOptions = estantes.map(
    (estante) => ({ value: estante.codigo, label: estante.nome } as Option)
  )

  return renderedEstantesOptions
}
