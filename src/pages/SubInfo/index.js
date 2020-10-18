import React, { useState, useEffect } from 'react'
import { Link, useLocation, useRouteMatch, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import $ from 'jquery'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import './style.css'

import LogoImg from '../../assets/logo-riot.svg'

import api from '../../services/api'

export default function Dashboard() {
  const { params } = useRouteMatch()

  const history = useHistory()

  const userId = localStorage.getItem('userId')
  const level = localStorage.getItem('access_level')

  const userToken = localStorage.getItem('token')
  const [toggleSate, setToggleSate] = useState('')
  const [projectName, setProject] = useState('')
  const [subName, setSubName] = useState('')
  const [subDescription, setSubDescription] = useState('')
  const [reqFunc, setReqFunc] = useState([])
  const [reqNonFunc, setReqNonFunc] = useState([])

  const [modalReqFunc, setModalReqFunc] = useState('')
  // const [reqFuncID, setReqFuncID] = useState('')
  const [reqFuncDesc, setReqFuncDesc] = useState('')

  const [modalReqNonFunc, setModalReqNonFunc] = useState('')
  // const [reqNonFuncId, setReqNonFuncID] = useState('')
  const [reqNonFuncTipo, setReqNonFuncTipo] = useState('Confiabilidade')
  const [reqNonFuncDesc, setReqNonFuncDesc] = useState('')

  let data = useLocation()

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  function handleModalReqFunc() {
    setModalReqFunc(modalReqFunc === '' ? 'active' : '')
  }

  function handleModalReqNonFunc() {
    setModalReqNonFunc(modalReqNonFunc === '' ? 'active' : '')
  }
  
  async function handleDelete(id_req) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Excluir requisito do projeto não tem reversão!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar!'
    }).then(async (result) => {
      if (result.value) {
        await api.delete('/requirement/delete', {data: {id_req, type: 'functional'}}).then((response) => {
          Swal.fire(
            response.data.message,
            '',
            'success'
          )
        })
        getSubInfo()
      }
    })
  }

  async function handleDeleteNonFunctional(id_req) {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Excluir requisito do projeto não tem reversão!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, deletar!',
      cancelButtonText: 'Cancelar!'
    }).then(async (result) => {
      if (result.value) {
        await api.delete('/requirement/delete', {data: {id_req, type: 'nonfunctional'}}).then((response) => {
          Swal.fire(
            response.data.message,
            '',
            'success'
          )
        })
        getSubInfo()
      }
    })
  }

  async function handleDeleteModule() {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Excluir um módulo não tem reversão!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar!'
    }).then(async (result) => {
      if (result.value) {
        await api.delete('/sub/deletemodule', {data: {id_module: params.id_sub}}).then((response) => {
          Swal.fire({
            title: 'Successo!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
              history.push(`/project/${params.id_project}`)
            }
          })
        })
      }
    })
  }

  async function handleCreateReqFunc(e) {
    e.preventDefault()
    const dataReqFunc = {
      // indicador: reqFuncID,
      descricao: reqFuncDesc,
      id_sub: params.id_sub,
    }
    try {
      await api
        .post('/requirement/create', dataReqFunc, {
          headers: { Authorization: userToken },
        })
        .then((response) => {
          Swal.fire({
            title: 'Successo!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
              setModalReqFunc('')
            }
          })
        })

      // setReqFuncID('')
      setReqFuncDesc('')
      getSubInfo()
    } catch (error) {
      alert('erro')
    }
  }

  async function handleCreateReqNonFunc(e) {
    e.preventDefault()

    const dataReqNonFunc = {
      // indicador: reqNonFuncId,
      tipo: reqNonFuncTipo,
      descricao: reqNonFuncDesc,
      id_sub: params.id_sub,
    }

    try {
      await api
        .post('/requirement/create', dataReqNonFunc, {
          headers: { Authorization: userToken },
        })
        .then((response) => {
          Swal.fire({
            title: 'Successo!',
            text: response.data.message,
            icon: 'success',
            confirmButtonText: 'Ok',
          }).then((result) => {
            if (result.value) {
              setModalReqNonFunc('')
            }
          })
        })

      // setReqNonFuncID('')
      setReqNonFuncTipo('Confiabilidade')
      setReqNonFuncDesc('')
      getSubInfo()
    } catch (error) {
      alert('erro')
    }
  }

  async function getSubInfo() {
    await api.get(`/sub/${params.id_sub}`).then((response) => {
      setSubName(response.data.sub[0].nome)
      setSubDescription(response.data.sub[0].descricao)
      setReqFunc(response.data.reqFunc)
      setReqNonFunc(response.data.reqNonFunc)
    })
  }

  $('#inputSearch').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('#table tbody tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      return true
    })
  })

  $('#inputSearch2').on('keyup', function () {
    var value = $(this).val().toLowerCase()
    $('#table2 tbody tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
      return true
    })
  })

  useEffect(() => {
    setProject(data.state.projectName)
    getSubInfo()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.state.projectName])

  return (
    <div className="dashboard-container">
      <header className="header">
        <img onClick={handleToggle} src={LogoImg} alt="" />
        <Link to="/">Sair</Link>
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
              <a href="https://drive.google.com/file/d/133qGQJyYTm-cgzx9TPXW4aLk00GIVpag/view" without="true" target="_blank" rel="noopener noreferrer">
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
        <div className="action-module">
          <h3>
            <Link
              to={`/project/${params.id_project}`}
              // to={{
              //   pathname: '/project',
              //   state: { id: data.state.projectId },
              // }}
            >
              {projectName}
            </Link>{' '}
            / {subName}
          </h3>
          {
            level === '1' ?
            <button className="del-module" onClick={handleDeleteModule} className="btn-del"> 
              <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14 3V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H6C5.46957 0 4.96086 0.210714 4.58579 0.585786C4.21071 0.960859 4 1.46957 4 2V3H1C0.734784 3 0.48043 3.10536 0.292893 3.29289C0.105357 3.48043 0 3.73478 0 4C0 4.26522 0.105357 4.51957 0.292893 4.70711C0.48043 4.89464 0.734784 5 1 5H2V16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19H13C13.7956 19 14.5587 18.6839 15.1213 18.1213C15.6839 17.5587 16 16.7956 16 16V5H17C17.2652 5 17.5196 4.89464 17.7071 4.70711C17.8946 4.51957 18 4.26522 18 4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H14ZM12 2H6V3H12V2ZM14 5H4V16C4 16.2652 4.10536 16.5196 4.29289 16.7071C4.48043 16.8946 4.73478 17 5 17H13C13.2652 17 13.5196 16.8946 13.7071 16.7071C13.8946 16.5196 14 16.2652 14 16V5Z" fill="black"/>
                <path d="M6 7H8V15H6V7Z" fill="black"/>
                <path d="M10 7H12V15H10V7Z" fill="black"/>
              </svg>
            </button> :
            ''
          }
              
        </div>
        <div className="sub-container">
          <div className="sub-info">
            <div className="sub-name">
              <span>Nome</span>
              {
                subName ? <input type="text" defaultValue={subName} disabled /> :
                <SkeletonTheme color="#ddd" highlightColor="#eee">
                  <Skeleton className="skel-hover" variant="rect" width={370} height={48} style={{marginTop: '10px', marginRight: '40px'}} />
                </SkeletonTheme>
              }
            </div>
            <div className="sub-desc">
              <span>Descrição</span>
              <div className="desc">
                {subDescription ? subDescription : 
                  <SkeletonTheme color="#ddd" highlightColor="#eee">
                    <Skeleton className="skel-hover" variant="rect" width={210} height={'auto'} />
                  </SkeletonTheme>
                }
              </div>
            </div>
          </div>

          <div className="sub-reqs">
            <div className="req"> 
              <div className="req-header">
                <span>Requisitos Funcionais</span>
                <input
                  type="search"
                  id="inputSearch"
                  className="search"
                  placeholder="Pesquisar por ID ou descrição"
                />
                <Tippy content="Cadastrar Requisito Funcional">
                  <div className="add" onClick={handleModalReqFunc}>
                    +
                  </div>
                </Tippy>
              </div>

                <table className="content-table2" id="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Descrição</th>
                      <th>Ação</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reqFunc.map((req) => (
                      <tr key={req.id_reqfunctional}>
                        <td className="border-right">{req.indicador}</td>
                        <td className="desc-table">{req.descricao}</td>
                        <Tippy content="Excluir Requisito">
                          <td className="excluir-req" onClick={() => handleDelete(req.id_reqfunctional)}>X</td>
                        </Tippy>
                      </tr>
                    ))}
                  </tbody>
                </table>      

            </div>

            <div className="scroll-table" style={{overflowX: 'auto'}}>
            <div className="req req-non-func">
              <div className="req-header">
                <span>Requisitos Não Funcionais</span>
                <input
                  type="search"
                  id="inputSearch2"
                  className="search"
                  placeholder="Pesquisar por ID ou descrição"
                />
                <Tippy content="Cadastrar Requisito Não Funcional">
                  <div className="add" onClick={handleModalReqNonFunc}>
                    +
                  </div>
                </Tippy>
              </div>
              
              <div className="scroll-table" style={{overflowX: 'auto'}}>
              <table className="content-table2" id="table2">
                <thead>
                  <tr>
                    <th className="id-table">ID</th>
                    <th className="tipo-table">Tipo</th>
                    <th className="desc-table">Descrição</th>
                    <th className="">Ação</th>
                  </tr>
                </thead>

                <tbody>
                  {reqNonFunc.map((req) => (
                    <tr key={req.id_req_non_functional}>
                      <td className="id-tabl border-right">{req.indicador}</td>
                      <td className="border-right">{req.tipo}</td>
                      <td className="desc-table">{req.descricao}</td>
                      <Tippy content="Excluir Requisito">
                        <td className="excluir-req" onClick={() => handleDeleteNonFunctional(req.id_req_non_functional)}>X</td>
                      </Tippy>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
            </div>
          </div>
        </div>

        <div className={`modal modal-req-func ${modalReqFunc}`}>
          <div className="card-modal">
            <div className="card-header">
              Cadastrar Requisito Funcional
              <div className="close" onClick={handleModalReqFunc}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleCreateReqFunc}>
                {/* <label htmlFor="">Indicador</label>
                <input
                  type="text"
                  placeholder="Ex: RF01"
                  required
                  value={reqFuncID}
                  onChange={(e) => setReqFuncID(e.target.value)}
                /> */}
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="4"
                  required
                  value={reqFuncDesc}
                  onChange={(e) => setReqFuncDesc(e.target.value)}
                  placeholder="Ex: O sistema deve..."
                />
                <button type="submit">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>

        <div className={`modal modal-req-non-func ${modalReqNonFunc}`}>
          <div className="card-modal">
            <div className="card-header">
              Cadastrar Requisito Não Funcional
              <div className="close" onClick={handleModalReqNonFunc}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleCreateReqNonFunc}>
                {/* <label htmlFor="">Indicador</label>
                <input
                  type="text"
                  placeholder="Ex: RNF01"
                  required
                  value={reqNonFuncId}
                  onChange={(e) => setReqNonFuncID(e.target.value)}
                /> */}
                <label htmlFor="">Tipo</label>
                <select
                  value={reqNonFuncTipo}
                  onChange={(e) => setReqNonFuncTipo(e.target.value)}
                  required
                >
                  <option
                    disabled
                  >
                    Selecione o tipo
                  </option>
                  <option defaultValue value="Confiabilidade">Confiabilidade</option>
                  <option value="Compatibilidade">Compatibilidade</option>
                  <option value="Desempenho">Desempenho</option>
                  <option value="Disponibilidade">Disponibilidade</option>
                  <option value="Eficiência">Eficiência</option>
                  <option value="Entrega">Entrega</option>
                  <option value="Ético">Ético</option>
                  <option value="Implementação">Implementação</option>
                  <option value="Interoperabilidade">Interoperabilidade</option>
                  <option value="Legal">Legal</option>
                  <option value="Manutenibilidade">Manutenibilidade</option>
                  <option value="Portabilidade">Portabilidade</option>
                  <option value="Padrão">Padrão</option>
                  <option value="Reusabilidade">Reusabilidade</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Testabilidade">Testabilidade</option>
                  <option value="Usabilidade">Usabilidade</option>
                </select>
                {/* <input
                  type="text"
                  placeholder="Ex: Usabilidade"
                  required
                  value={reqNonFuncTipo}
                  onChange={(e) => setReqNonFuncTipo(e.target.value)}
                /> */}
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="4"
                  required
                  value={reqNonFuncDesc}
                  onChange={(e) => setReqNonFuncDesc(e.target.value)}
                  placeholder="Ex: O sistema deve..."
                />
                <button type="submit">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
