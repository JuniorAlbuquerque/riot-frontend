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

import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const { params } = useRouteMatch()

  const history = useHistory()

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

  const [descriptionReq, setDescriptionReq] = useState('');
  const [idReq, setIdReq] = useState('');
  const [type, setType] = useState('');
  const [modalEdit, setModalEdit] = useState('');
  const [modalEditNonFunc, setModalEditNonFunc] = useState('');

  let data = useLocation();

  const reqsnon = ['Compatibilidade', 'Confiabilidade', 'Desempenho', 'Disponibilidade', 'Eficiência', 'Entrega',
    'Escalabilidade', 'Ético', 'Implementação', 'Interoperabilidade', 'Legal', 'Manutenabilidade',
    'Portabilidade', 'Padrão', 'Reusabilidade', 'Segurança', 'Testabilidade', 'Usabilidade'
  ]

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  function handleModalReqFunc() {
    setModalReqFunc(modalReqFunc === '' ? 'active' : '')
  }

  function handleModalReqNonFunc() {
    setModalReqNonFunc(modalReqNonFunc === '' ? 'active' : '')
  }

  function handleModalEditReq() {
    setModalEdit(modalEdit === "" ? "active" : "");
  }

  function handleModalEditReqNon() {
    setModalEditNonFunc(modalEditNonFunc === "" ? "active" : "");
  }

  function handleEditReq(id_req, description, type) {
    if (type) {
      setModalEditNonFunc("active");
      setType(type);
    } else {
      setModalEdit("active");
    }

    setDescriptionReq(description);
    setIdReq(id_req);
  }

  async function handleSubmitEditReq(e) {
    e.preventDefault()

    try {
      await api.post('/requirement/update', {
        id_req: idReq,
        description: descriptionReq
      }).then(response => {
        Swal.fire({
          title: 'Successo!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            getSubInfo();
            setModalEdit('')
            setModalEditNonFunc('')
          }
        })
      })

    } catch (error) {
      alert('Erro')
    }
  }
  
  async function handleSubmitEditReqNon(e) {
    e.preventDefault()

    try {
      await api.post('/requirement/update', {
        id_req: idReq,
        description: descriptionReq,
        type: type
      }).then(response => {
        Swal.fire({
          title: 'Successo!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            getSubInfo();
            setModalEdit('')
            setModalEditNonFunc('') 
          }
        })
      })

    } catch (error) {
      alert('Erro')
    }
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
        <Sidebar />
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
            <button onClick={handleDeleteModule} className="btn-del"> 
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
                        <td>
                          <Tippy content="Excluir Requisito">
                            <td
                              className="excluir-req"
                              style={{border: 'none'}}
                              onClick={() => handleDelete(req.id_reqfunctional)}
                            >
                              X
                            </td>
                          </Tippy>
                          <Tippy content="Editar Requisito">
                            <td
                              className="excluir-req"
                              style={{border: 'none'}}
                              onClick={() => handleEditReq(req.id_reqfunctional, req.descricao)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="black"
                                width="18px"
                                height="18px"
                              >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                              </svg>
                            </td>
                          </Tippy>
                        </td>
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
                      <td>
                        <Tippy content="Excluir Requisito">
                          <td
                            className="excluir-req"
                            style={{border: 'none'}}
                            onClick={() =>
                              handleDeleteNonFunctional(req.id_req_non_functional)
                            }
                          >
                            X
                          </td>
                        </Tippy>
                        <Tippy content="Editar Requisito">
                          <td
                            className="excluir-req"
                            style={{border: 'none'}}
                            onClick={() => handleEditReq(req.id_req_non_functional, req.descricao, req.tipo)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="black"
                              width="18px"
                              height="18px"
                            >
                              <path d="M0 0h24v24H0z" fill="none" />
                              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                            </svg>
                          </td>
                        </Tippy>
                      </td>
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

            {/* EDITAR */}
            <div className={`modal modal-req-func ${modalEdit}`}>
          <div className="card-modal">
            <div className="card-header">
              Editar Requisito Funcional
              <div className="close" onClick={handleModalEditReq}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmitEditReq}>
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="4"
                  required
                  value={descriptionReq}
                  onChange={(e) => setDescriptionReq(e.target.value)}
                />
                <button type="submit">Editar</button>
              </form>
            </div>
          </div>
        </div>

        <div className={`modal modal-req-non-func ${modalEditNonFunc}`}>
          <div className="card-modal">
            <div className="card-header">
              Editar Requisito Não-Funcional
              <div className="close" onClick={handleModalEditReqNon}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleSubmitEditReqNon}>
              <label htmlFor="">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                >
                  <option disabled>Selecione o tipo</option>
                  {
                    reqsnon.map((item) => 
                      item === type ?
                      <option defaultValue value={item}>{item}</option> :
                      <option value={item}>{item}</option> 
                    )
                  }
                </select>
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="4"
                  required
                  value={descriptionReq}
                  onChange={(e) => setDescriptionReq(e.target.value)}
                />
                <button type="submit">Editar</button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
