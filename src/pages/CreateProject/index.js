import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import './style.css';

import LogoImg from '../../assets/logo-riot.svg';
import api from '../../services/api';

import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const [toggleSate, setToggleSate] = useState('')

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('')
  const [dominio, setDominio] = useState('')
  const [descricao, setDescricao] = useState('')

  const id_admin = localStorage.getItem('userId')
  const userToken = localStorage.getItem('token')

  const history = useHistory()

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  async function handleCreateProject(e) {
    e.preventDefault()
    const data = { nome, tipo, dominio, descricao, id_admin }
    try {
      await api
        .post('/project/create', data, {
          headers: {
            Authorization: userToken,
          },
        })
        .then((response) => {
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
      alert('Erro ao cadastrar caso')
    }
  }

  return (
    <div className="dashboard-container">
      <header className="header">
        <img onClick={handleToggle} src={LogoImg} alt="" />
        <Link to="/">Sair</Link>
      </header>
      <aside className={`aside ${toggleSate}`}>
        <Sidebar />
      </aside>
      <main className="main">
        <h3>Criar Projeto</h3>
        <div className="card-create">
          <form onSubmit={handleCreateProject} className="form-create">
            <div className="form-row">
              <div className="row-1">
                <div className="label-row"> 
                  <label htmlFor="">Nome</label>
                  <Tippy content="Nome do projeto, ex: Smart Home">
                    <div className="icon-tip">?</div>
                  </Tippy>
                </div>
                <input
                  className="h3"
                  type="text"
                  required
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>

              <div className="row-2">
                <div className="label-row"> 
                  <label htmlFor="">Tipo do sistema</label>
                  <Tippy content="ex: Sistema IoT, ciber-físico, ubíquo">
                    <div className="icon-tip">?</div>
                  </Tippy>
                </div>
                <input
                  type="text"
                  value={tipo}
                  required
                  onChange={(e) => setTipo(e.target.value)}
                />
              </div>

              <div className="row-3">
                <div className="label-row"> 
                  <label htmlFor="">Domínio do Sistema</label>
                  <Tippy content="ex: Cidade Inteligente, Lazer, Saúde...">
                    <div className="icon-tip">?</div>
                  </Tippy>
                </div>
                <input
                  type="text"
                  value={dominio}
                  required
                  onChange={(e) => setDominio(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="row">
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="10"
                  value={descricao}
                  required
                  onChange={(e) => setDescricao(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">
              Cadastrar Projeto
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
