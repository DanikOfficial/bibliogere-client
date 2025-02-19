import { FC, memo } from 'react'
import { ObraEntity } from '../data/ObraInterfaces'

interface Props extends ObraEntity {}

let Livro: FC<Props> = ({ editora }) => (
  <div className="row">
    <p className="mb-1">
      <span className="text-primary fw-bold me-1">Editora:</span>
      <span className="span text-secondary">{editora}</span>
    </p>
  </div>
)

Livro = memo(Livro)

export default Livro
