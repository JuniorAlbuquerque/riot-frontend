import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

import './style.css'

import api from '../../services/api'

import LogoImg from '../../assets/Logo.svg'
import CheckImg from '../../assets/check-bg.png'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setPassword] = useState('')

  const history = useHistory()

  async function handleLogin(e) {
    e.preventDefault()

    try {
      const response = await api.post('/user/login', {
        email,
        senha,
      })

      const id =
        response.data.user[0].id_admin || response.data.user[0].id_member

      localStorage.setItem('username', response.data.user[0].nome)
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userId', id)

      history.push('/home')
    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Falha na autenticação de usuário',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
    }
  }

  return (
    <div className="login-container">
      <section className="form">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            value={senha}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="button" type="submit">
            Entrar
          </button>
          {/* <Link to="/register">Cadastre-se</Link> */}
        </form>
      </section>
      <section className="info">
        <img className="logo-img" src={LogoImg} alt="Requirements of IoT" />
        <p>
          Uma ferramenta para especificar <br></br> requisitos baseados em
          sistemas de Internet das Coisas
        </p>
        <img className="colab-img" src={CheckImg} alt="Colaborate" />
      </section>
    </div>
  )
}
