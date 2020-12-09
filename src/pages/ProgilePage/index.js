import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'

import './style.css'

import api from '../../services/api'

import LogoImg from '../../assets/logo-riot.svg'
import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const [toggleSate, setToggleSate] = useState('')

  const userName = localStorage.getItem('username')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const userId = localStorage.getItem('userId')
  const [buttonUpdate, setButtonUpdate] = useState('')
  const [buttonText, setButtonText] = useState('Salvar')
  const [disable, setDisable] = useState('')

  const history = useHistory()

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  async function handleGetProfile() {
    try {
      const response = await api.get(`/user/profile/${userId}`)

      setName(response.data.nome)
      setEmail(response.data.email)
    } catch (error) {
      alert(error)
    }
  }

  async function updateUser(e) {
    e.preventDefault()
    setButtonUpdate('active')
    setButtonText('Aguarde...')
    setDisable('disabled')

    try {
      await api.post('/user/update', {
        id_user: userId,
        nome: name,
        email,
        senha,
      }).then(response => {
        localStorage.setItem('username', name)
        setButtonUpdate('')
        setButtonText('Salvar')
        setDisable('')
        Swal.fire({
          title: 'Successo!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            history.push('/home')
          }
        })
      })

    } catch (error) {
      
    }
  }

  useEffect(() => {
    handleGetProfile()
  }, [])

  return (
    <div className="dashboard-container">
      <header className="header">
        <img onClick={handleToggle} src={LogoImg} alt="" />

        <div className="info">
          <span>Bem Vindo, {userName}</span>
          <Link className="logout" to="/">
            Sair
          </Link>
        </div>
      </header>
      <aside className={`aside ${toggleSate}`}>
        <Sidebar />
      </aside>
      <main className="profile-main">
        <div className="title">
          <h4>Usuário</h4>
        </div>

        <form onSubmit={updateUser}className="profile-form">
          <h4>Editar Dados</h4>

          <label htmlFor="">Nome</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor="">E-mail</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="">Nova Senha</label>
          <input
            type="password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <input
            type="submit"
            required
            value={buttonText}
            disabled={disable}
            className={`${buttonUpdate}`}
          />
        </form>
      </main>
    </div>
  )
}
