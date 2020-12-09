import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'

import './style.css'

import api from '../../services/api'

import LogoImg from '../../assets/logo-riot.svg'

import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const [toggleSate, setToggleSate] = useState('')
  const [projects, setProjects] = useState([])

  const userName = localStorage.getItem('username')
  const userToken = localStorage.getItem('token')
  const userId = localStorage.getItem('userId')
  const level = localStorage.getItem('access_level')

  const history = useHistory()

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  function handleLogout() {
    localStorage.removeItem('token');
    history.push('/')
  }

  useEffect(() => {
    api
      .get(`/project/${userId}`, { headers: { Authorization: userToken } })
      .then((response) => {
        setProjects(response.data)
      })
  }, [userId, userToken])

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
        <div className="cards">
          {
            level === '1' ? <Link to="/create-project">
            <div className="card-project card1">
              <span>+</span>
              <p>Criar novo projeto</p>
            </div>
            </Link> :
            ''
          }
          
          {projects.map((project) => (
            <Link
              className="project-link"
              key={project.id_project}
              to={`/project/${project.id_project}`}
              // to={{
              //   pathname: '/project',
              //   state: { id: project.id_project },
              // }}
            >
              <div className="card-project card2">{project.nome}</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
