import {
  EmprestimoComponentProps,
  EmprestimoEntity,
} from '../data/EmprestimoInterfaces'
import Emprestimo from '../Emprestimo'

export const renderEmprestimos = (
  emprestimos: EmprestimoEntity[],
  onClickVisualizar: (codigoEmprestimo: number) => void
) => {
  const renderedEmprestimos = emprestimos.map((emprestimo) => {
    const emprestimoComponentProps: EmprestimoComponentProps = {
      emprestimo,
      onClickVisualizar,
    }

    return <Emprestimo key={emprestimo.codigo} {...emprestimoComponentProps} />
  })

  return renderedEmprestimos
}
