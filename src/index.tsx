import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './app/store'
import { Provider } from 'react-redux'
import { CartProvider } from './features/emprestimo/cart/CartContext'
import './assets/bootstrap-icons.css'
import './assets/bootstrap.bundle'
import './assets/main.min.css'
import localizacaoApi from './features/localizacoes/localizacaoApi'
import App from './App'
import estanteApi from './features/estantes/data/estanteApi'
import obraApi from './features/obra/data/obraApi'
import { questaoApi } from './app/services/questaoApi'


// Localizações
store.dispatch(localizacaoApi.endpoints.getLocalizacoes.initiate())

// Estantes
store.dispatch(estanteApi.endpoints.getEstantes.initiate())

// Livros
store.dispatch(obraApi.endpoints.getObras.initiate())

// Questao
store.dispatch(questaoApi.endpoints.getQuestoes.initiate())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
        <CartProvider>
          <App />
        </CartProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
