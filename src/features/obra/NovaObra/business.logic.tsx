import { Localizacao } from '../../localizacoes/localizacaoApi'
import type Option from '../../../app/interfaces/Option'

export const renderLocalizacoes = (localizacoes: Localizacao[]) =>
  localizacoes.map(
    (localizacao) =>
      ({
        value: localizacao.codigo,
        label: localizacao.designacao,
      } as Option)
  )
