import Monografia from './Monografia'
import Livro from './Livro'
import { ObraEntity } from '../data/ObraInterfaces'

interface Component {
  [key: string]: (props: ObraEntity) => JSX.Element
}

const types: Component = {
  monografia: (props: ObraEntity) => <Monografia {...props} />,
  livro: (props: ObraEntity) => <Livro {...props} />,
}

export const getType = (props: ObraEntity): JSX.Element =>
  types[props.tipoObra.toLowerCase()](props)
