import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import './style.css';

import LogoImg from '../../assets/logo-riot.svg';

import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const [toggleSate, setToggleSate] = useState('')
  const [toggleCard, setToggleCard] = useState('')
  const [toggleCard2, setToggleCard2] = useState('')
  const [toggleCard3, setToggleCard3] = useState('')

  const userName = localStorage.getItem('username')

  const history = useHistory()

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  function handleToggleCard(id) {
    if (id === '1') {
      setToggleCard(toggleCard === '' ? 'active' : '')
    }
    if (id === '2') {
      setToggleCard2(toggleCard2 === '' ? 'active' : '')
    }
    if (id === '3') {
      setToggleCard3(toggleCard3 === '' ? 'active' : '')
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    history.push('/')
  }
  return (
    <div className="dashboard-container">
      <header className="header">
        <img onClick={handleToggle} src={LogoImg} alt="" />

        <div className="info">
          <span>Bem Vindo, {userName}</span>
          <button className="logout" onClick={handleLogout}> 
            Sair
          </button>
        </div>
      </header>
      <aside className={`aside ${toggleSate}`}>
        <Sidebar />
      </aside>
      <main className="main">
        <div className="head-help">
          <h1>Smart Agro</h1>
          <span>Projeto Base</span>
        </div>

        <div className="info-help">
          <aside>
            <p>
              <strong>Descrição: </strong>
              Projeto para monitoramento de consumo de água, energia e implatação de um sistema de irrigação inteligente 
              em uma fazenda no interior do Amazonas
            </p>
          </aside>

          <aside>
            <p>
              <strong>Tipo de Projeto: </strong>
              IoT
            </p>
          </aside>

          <aside>
            <p>
              <strong>Domínio: </strong>
              Agricultura
            </p>
          </aside>
        </div>

        <div className="section-cards">
          <div className={`card-help ${toggleCard}`} onClick={() => handleToggleCard('1')}>
            <div className="title-card-help">
              <div className="icon">!</div>
              <span>Módulos</span>
            </div>

            <div className="card-help-text">
              Os módulos representam partes do sistema com o objetivo de separar as responsabilidades do mesmo. 
              Ex: O módulo (software) é responsável por apresentar os requisitos referentes a dashboard do sistema, 
              desde o cadastro de um usuário, até o acompanhamento de equipamentos na interface.
              Já o módulo (Broker MQTT) é responsável por apresentar os requisitos referentes ao protocolo de comunicação.
            </div>
          </div>

          <div className={`card-help ${toggleCard2}`} onClick={() => handleToggleCard('2')}>
            <div className="title-card-help">
              <div className="icon">!</div>
              <span>Requisitos Funcionais</span>
            </div>

            <div className="card-help-text">
              Um requisito especificado é uma descrição da funcionalidade de um sistema. 
              Os requisitos funcionais de software descrevem as funções que o software deve executar, como por exemplo:
              O sistema deve apresentar uma dashboard com as informações de monitoramento de temperatura e umidade do ambiente.
            </div>
          </div>

          <div className={`card-help ${toggleCard3}`} onClick={() => handleToggleCard('3')}>
            <div className="title-card-help">
              <div className="icon">!</div>
              <span>Requisitos Não Funcionais</span>
            </div>

            <div className="card-help-text">
            Os requisitos não-funcionais são requisitos que expressam condições que o software deve atender ou qualidades 
            específicas que o sistema deve ter. Em vez de informar o que o sistema fará, os requisitos não-funcionais colocam restrições no sistema.
            Como por exemplo: Um requisito não-funcional de Disponibilidade (O sistema deve manter conexão com o servidor CloudMQTT)
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
