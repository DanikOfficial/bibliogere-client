import React from 'react'
import Header from '../../../components/hero/Header'
import Credentials from './Credentials'

const Login: React.FC = () => {
  return (
    <>
      <Header
        name="Bem Vindo!"
        description="Autentique-se usando o seu id de utilizador e a senha atribuída
              pelo administrator!"
      />
      <Credentials />
    </>
  )
}

export default Login
