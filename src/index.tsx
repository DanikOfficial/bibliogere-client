import React from 'react'
import ReactDOM from 'react-dom'
import { store } from './app/store'
import { Provider } from 'react-redux'
import './assets/main.min.css'
import './assets/bootstrap-icons.css'
import './assets/bootstrap.bundle'
import localizacaoApi from './features/localizacoes/localizacaoApi'
import App from './App'
import estanteApi from './features/estantes/data/estanteApi'

// Initialize

// Localizações
store.dispatch(localizacaoApi.endpoints.getLocalizacoes.initiate())

// Estantes
store.dispatch(estanteApi.endpoints.getEstantes.initiate())

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)
