import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ObraEntity } from '../../obra/data/ObraInterfaces'
import toast from 'react-hot-toast'

const CartContext = createContext<
  | {
    obrasCart: ObraEntity[]
    addObra: (
      obra: ObraEntity,
      callback: (isSuccess: boolean) => void
    ) => void
    removeObra: (codigo: number) => void
    totalObras: () => number
    clearObras: () => void
  }
  | undefined
>(undefined)

// Provider component
const CartProvider = ({ children }: { children: ReactNode }) => {
  const [obrasCart, setObrasCart] = useState<ObraEntity[]>([])

  const addObra = (newObra: ObraEntity, callback: (isSuccess: boolean) => void) => {
    const obraExists = obrasCart?.find((obra) => obra.codigo === newObra.codigo)

    toast.dismiss()
    if (!obraExists) {
      if (obrasCart.length === 2) {
        toast.error('Erro: So e possivel adicionar 2 obras no momento')
        callback(false)
      } else {
        setObrasCart([...obrasCart, newObra])
        toast.success('Obra adicionada com sucesso')
        callback(true)
      }
    } else {
      toast.error('Esta obra ja foi adicionada a lista')
      callback(false)
    }
  }

  const removeObra = (codigo: number) => {
    const obraExists = obrasCart?.find((obra) => obra.codigo === codigo)
    if (obraExists) {
      const newObras = obrasCart.filter((obra) => obra.codigo !== codigo)
      setObrasCart(newObras)
      toast.success('Obra removida com sucesso')
    }
  }

  const clearObras = () => setObrasCart([])

  const totalObras = () => obrasCart.length

  return (
    <CartContext.Provider
      value={{ obrasCart, addObra, removeObra, totalObras, clearObras }}
    >
      {children}
    </CartContext.Provider>
  )
}

// Custom hook to use the context
const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useEmprestimo must be used within an EmprestimoProvider')
  }
  return context
}

export { CartProvider, useCart, CartContext }
