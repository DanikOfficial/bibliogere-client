import { FC, memo } from 'react'
import { ObraEntity } from '../data/ObraInterfaces'

interface Props extends ObraEntity {}

let Monografia: FC<Props> = ({ tutor }) => (
  <div className="row mx-0">
    <p className="mb-1">
      <span className="text-primary fw-bold me-1">Tutor:</span>
      <span className="span text-secondary">{tutor}</span>
    </p>
  </div>
)

Monografia = memo(Monografia)

export default Monografia
