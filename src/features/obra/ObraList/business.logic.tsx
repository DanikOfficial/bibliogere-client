import Obra, { ObraComponentProps } from '../Obra'
import { ObraEntity } from '../data/ObraInterfaces'

export const renderObras = (
  obras: ObraEntity[],
  onClickAlterarObra: (obra: ObraEntity) => void,
  onClickApagarObra: ({ codigo }: ObraEntity) => void,
  onClickAdicionarObra: (obra: ObraEntity) => void,
  isBeingManaged: boolean = false
) => {
  const renderedObras = obras.map((obra) => {
    const obraComponentProps: ObraComponentProps = {
      obra,
      onClickAlterarObra,
      onClickApagarObra,
      onClickAdicionarObra,
      isBeingManaged,
    }

    return <Obra key={obra.codigo} {...obraComponentProps} />
  })

  return renderedObras
}
