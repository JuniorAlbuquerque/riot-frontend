import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import './style.css'

import LogoImg from '../../assets/logo-riot.svg'

export default function Dashboard() {
  const [toggleSate, setToggleSate] = useState('')
  const [toggleCard, setToggleCard] = useState('')
  const [toggleCard2, setToggleCard2] = useState('')
  const [toggleCard3, setToggleCard3] = useState('')

  const userName = localStorage.getItem('username')
  const userId = localStorage.getItem('userId')

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
        <nav>
          <ul>
            <Tippy content="Home" placement="right">
            <li>
              <Link to="/home">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 15L20 3.33333L35 15V33.3333C35 34.2174 34.6488 35.0652 34.0237 35.6904C33.3986 36.3155 32.5507 36.6667 31.6667 36.6667H8.33333C7.44928 36.6667 6.60143 36.3155 5.97631 35.6904C5.35119 35.0652 5 34.2174 5 33.3333V15Z"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 36.6667V20H25V36.6667"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>       
            </Tippy>
            <Tippy content="Template" placement="right">
            <li>
              <a href="https://drive.google.com/file/d/133qGQJyYTm-cgzx9TPXW4aLk00GIVpag/view" target="_blank" without rel="noopener noreferrer">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  className="project"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0)">
                    <path
                      d="M12.3333 21.3333H2.33325C1.04663 21.3333 0 22.3799 0 23.6667V29.6667C0 30.9534 1.04663 32 2.33325 32H12.3333C13.6201 32 14.6667 30.9534 14.6667 29.6667V23.6667C14.6667 22.3799 13.6201 21.3333 12.3333 21.3333ZM2.33325 30C2.14941 30 2 29.8506 2 29.6667V23.6667C2 23.4827 2.14941 23.3333 2.33325 23.3333H12.3333C12.5173 23.3333 12.6667 23.4827 12.6667 23.6667V29.6667C12.6667 29.8506 12.5173 30 12.3333 30H2.33325Z"
                      fill="#000051"
                    />
                    <path
                      d="M12.3333 0H2.33325C1.04663 0 0 1.04663 0 2.33325V16.3333C0 17.6201 1.04663 18.6667 2.33325 18.6667H12.3333C13.6201 18.6667 14.6667 17.6201 14.6667 16.3333V2.33325C14.6667 1.04663 13.6201 0 12.3333 0ZM2.33325 16.6667C2.14941 16.6667 2 16.5173 2 16.3333V2.33325C2 2.14941 2.14941 2 2.33325 2H12.3333C12.5173 2 12.6667 2.14941 12.6667 2.33325V16.3333C12.6667 16.5173 12.5173 16.6667 12.3333 16.6667H2.33325Z"
                      fill="#000051"
                    />
                    <path
                      d="M29.6668 -3.5604e-05H19.6668C18.3799 -3.5604e-05 17.3333 1.0466 17.3333 2.33322V8.33323C17.3333 9.6201 18.3799 10.6667 19.6668 10.6667H29.6668C30.9534 10.6667 32 9.6201 32 8.33323V2.33322C32 1.0466 30.9534 -3.5604e-05 29.6668 -3.5604e-05V-3.5604e-05ZM19.6668 8.66673C19.4827 8.66673 19.3333 8.51731 19.3333 8.33323V2.33322C19.3333 2.14938 19.4827 1.99997 19.6668 1.99997H29.6668C29.8506 1.99997 30 2.14938 30 2.33322V8.33323C30 8.51731 29.8506 8.66673 29.6668 8.66673H19.6668Z"
                      fill="#000051"
                    />
                    <path
                      d="M29.6668 13.3333H19.6668C18.3799 13.3333 17.3333 14.3799 17.3333 15.6667V29.6667C17.3333 30.9534 18.3799 32 19.6668 32H29.6668C30.9534 32 32 30.9534 32 29.6667V15.6667C32 14.3799 30.9534 13.3333 29.6668 13.3333V13.3333ZM19.6668 30C19.4827 30 19.3333 29.8506 19.3333 29.6667V15.6667C19.3333 15.4827 19.4827 15.3333 19.6668 15.3333H29.6668C29.8506 15.3333 30 15.4827 30 15.6667V29.6667C30 29.8506 29.8506 30 29.6668 30H19.6668Z"
                      fill="#000051"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0">
                      <rect
                        width="32"
                        height="32"
                        transform="matrix(1 0 0 -1 0 32)"
                        fill="white"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </a>
            </li>      
            </Tippy>
            <Tippy content="Perfil" placement="right">
            <li>
              <Link to={`/profile/${userId}`}>
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M33.3333 35V31.6667C33.3333 29.8986 32.6309 28.2029 31.3807 26.9526C30.1304 25.7024 28.4347 25 26.6666 25H13.3333C11.5652 25 9.86949 25.7024 8.61925 26.9526C7.369 28.2029 6.66663 29.8986 6.66663 31.6667V35"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 18.3333C23.6819 18.3333 26.6667 15.3486 26.6667 11.6667C26.6667 7.98477 23.6819 5 20 5C16.3181 5 13.3334 7.98477 13.3334 11.6667C13.3334 15.3486 16.3181 18.3333 20 18.3333Z"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>      
            </Tippy>
            <Tippy content="Ajuda (em desenvolvimento)" placement="right">
            <li>
              <Link to="/help">
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 33C26.2843 33 33 26.2843 33 18C33 9.71573 26.2843 3 18 3C9.71573 3 3 9.71573 3 18C3 26.2843 9.71573 33 18 33Z"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.635 13.5C13.9877 12.4975 14.6837 11.6522 15.5999 11.1137C16.5161 10.5752 17.5934 10.3784 18.6408 10.5581C19.6882 10.7377 20.6382 11.2823 21.3226 12.0953C22.007 12.9083 22.3816 13.9373 22.38 15C22.38 18 17.88 19.5 17.88 19.5"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 25.5H18.015"
                    stroke="#000051"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </li>        
            </Tippy>
          </ul>
        </nav>
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
