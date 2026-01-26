import React from 'react'
import Header from '../../../components/hero/Header'
import Credentials from './Credentials'

const Login: React.FC = () => {
  return (
    <div className="login-container">
      <div className="text-center mb-4">
        <div 
          className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary bg-opacity-10 mb-3"
          style={{ width: "72px", height: "72px" }}
        >
          <i className="bi bi-book-fill fs-1 text-primary"></i>
        </div>
        <Header
          name="Bem Vindo!"
          description="Autentique-se para acessar o sistema de gestão de biblioteca"
        />
      </div>
      <Credentials />
    </div>
  )
}

export default Login