import React from 'react'
import { Link } from 'react-router-dom'

import './style.css'

import LogoImg from '../../assets/Logo.svg'
import TeamImg from '../../assets/team.png'

export default function Register() {
  return (
    <div className="bg">
      <div className="register-container">
        <section className="form">
          <img src={LogoImg} alt="RIoT" />
          <form action="/home">
            {/* <h1>Login</h1> */}
            <input type="text" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <button className="button" type="submit">
              Cadastar-se
            </button>
            <Link to="/">Login</Link>
          </form>
        </section>
        <img className="team-img" src={TeamImg} alt="" />
      </div>
    </div>
  )
}
