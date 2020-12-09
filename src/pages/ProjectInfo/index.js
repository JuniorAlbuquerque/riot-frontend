import React, { useState, useEffect } from 'react'
import { Link, useRouteMatch, useHistory } from 'react-router-dom'
import Swal from 'sweetalert2'
import { saveAs } from 'file-saver'
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // optional

import './style.css'

import LogoImg from '../../assets/logo-riot.svg'

import api from '../../services/api'

import Sidebar from '../../components/Sidebar';

export default function Dashboard() {
  const { params } = useRouteMatch()

  const history = useHistory()

  const userId = localStorage.getItem('userId')
  const level = localStorage.getItem('access_level')

  const [toggleSate, setToggleSate] = useState('')
  const [modalSub, setModalSub] = useState('')
  const [modalMember, setModalMember] = useState('')
  const [projectName, setProject] = useState('')
  const [projectDomain, setDomain] = useState('')
  const [projectType, setType] = useState('')
  const [projectDescription, setDescription] = useState('')
  const [subs, setSubs] = useState([])
  const [members, setMembers] = useState([])

  const [subName, setSubName] = useState('')
  const [subDescription, setSubDescription] = useState('')

  const [memberName, setMemberName] = useState('')
  const [memberEmail, setMemberEmail] = useState('')
  const [memberPassword, setMemberPassword] = useState('')
  const userToken = localStorage.getItem('token')
  const [buttonPdf, setButtonPdf] = useState('')
  const [pdfText, setPdfText] = useState('Download PDF')

  function handleToggle() {
    setToggleSate(toggleSate === '' ? 'active' : '')
  }

  function handleModalSubAdd() {
    setModalSub(modalSub === '' ? 'active' : '')
  }

  function handleModalMemberAdd() {
    setModalMember(modalMember === '' ? 'active' : '')
  }

  async function handleDeleteProject() {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Excluir o projeto não tem reversão!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir!',
      cancelButtonText: 'Cancelar!'
    }).then(async (result) => {
      if (result.value) {
        await api.delete('/project/deleteproject', {data: {id_project: params.id_project}}).then((response) => {
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
      }
    })
  }

  async function handleCreateSub(e) {
    e.preventDefault()
    const dataSub = {
      nome: subName,
      descricao: subDescription,
      id_project: params.id_project,
    }

    try {
      await api.post('/sub/create', dataSub).then((response) => {
        Swal.fire({
          title: 'Successo!',
          text: response.data.message,
          icon: 'success',
          confirmButtonText: 'Ok',
        }).then((result) => {
          if (result.value) {
            setModalSub('')
          }
        })
      })

      setSubName('')
      setSubDescription('')
      handleGetInfoProject()
    } catch (error) {
      alert('erro')
    }
  }

  async function handleCreateMember(e) {
    e.preventDefault()
    const dataMember = {
      email: memberEmail,
      nome: memberName,
      senha: memberPassword,
      id_project: params.id_project,
    }

    try {
      await api
        .post('/member/create', dataMember, {
          headers: { Authorization: userToken },
        })
        .then((response) => {
          if (response.data.erro) {
            // Swal.fire({
            //   title: 'Erro!',
            //   text: response.data.erro,
            //   icon: 'error',
            //   confirmButtonText: 'Ok',
            // })
            Swal.fire({
              title: 'E-mail já cadastrado',
              text: "Deseja associar o email a este projeto?",
              icon: 'warning',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Sim, associar!',
              cancelButtonText: 'Cancelar!'
            }).then(async (result) => {
              if (result.value) {
                await api.post('/member/associate', {email: dataMember.email, id_project: dataMember.id_project}).then((response) => {
                  Swal.fire(
                    response.data.message,
                    '',
                    'success'
                  ).then((result) => {
                    if (result.value) {
                      setModalMember('')
                      setMemberName('')
                      setMemberEmail('')
                      setMemberPassword('')
                    }
                  })
                })
              }

              handleGetInfoProject()

            })
          } else {
            Swal.fire({
              title: 'Successo!',
              text: response.data.message,
              icon: 'success',
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.value) {
                setModalMember('')
                setMemberName('')
                setMemberEmail('')
                setMemberPassword('')
              }
            })
          }
        })

      handleGetInfoProject()
    } catch (error) {
      alert('erro')
    }
  }

  async function getPdf() {
    setButtonPdf('active')
    setPdfText('Waiting...')
    await api
      .get(`/project/downloadpdf/${params.id_project}`, { responseType: 'blob' })
      .then((res) => {
        const pdfBlob = new Blob([res.data], { type: 'application/pdf' })

        saveAs(pdfBlob, `${projectName}.pdf`)
        setButtonPdf('')
        setPdfText('Download PDF')
      })
  }

  const handleGetInfoProject = async () => {
    await api.get(`/project/info/${params.id_project}`).then((response) => {
      setProject(response.data.project[0].nome)
      setDomain(response.data.project[0].dominio)
      setType(response.data.project[0].tipo)
      setDescription(response.data.project[0].descricao)
      setSubs(response.data.sub)
      setMembers(response.data.members)
    })
  }

  useEffect(() => {
    handleGetInfoProject()
  }, []);

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
        <div className="title">
          <h3>{projectName}</h3>
          <div className="actions">
            <button className={`pdf ${buttonPdf}`} onClick={getPdf}>
              {pdfText}
            </button>
            {
              level === '1' ? 
              <button onClick={handleDeleteProject} className="btn-del">
                <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14 3V2C14 1.46957 13.7893 0.960859 13.4142 0.585786C13.0391 0.210714 12.5304 0 12 0H6C5.46957 0 4.96086 0.210714 4.58579 0.585786C4.21071 0.960859 4 1.46957 4 2V3H1C0.734784 3 0.48043 3.10536 0.292893 3.29289C0.105357 3.48043 0 3.73478 0 4C0 4.26522 0.105357 4.51957 0.292893 4.70711C0.48043 4.89464 0.734784 5 1 5H2V16C2 16.7956 2.31607 17.5587 2.87868 18.1213C3.44129 18.6839 4.20435 19 5 19H13C13.7956 19 14.5587 18.6839 15.1213 18.1213C15.6839 17.5587 16 16.7956 16 16V5H17C17.2652 5 17.5196 4.89464 17.7071 4.70711C17.8946 4.51957 18 4.26522 18 4C18 3.73478 17.8946 3.48043 17.7071 3.29289C17.5196 3.10536 17.2652 3 17 3H14ZM12 2H6V3H12V2ZM14 5H4V16C4 16.2652 4.10536 16.5196 4.29289 16.7071C4.48043 16.8946 4.73478 17 5 17H13C13.2652 17 13.5196 16.8946 13.7071 16.7071C13.8946 16.5196 14 16.2652 14 16V5Z" fill="black"/>
                  <path d="M6 7H8V15H6V7Z" fill="black"/>
                  <path d="M10 7H12V15H10V7Z" fill="black"/>
                </svg>
              </button> :
              ''
            }
          </div>
        </div>
        <div className="project-container">
          <div className="subs">
            <div className="card-header">
              <span>Módulos</span>
              {
                level === '1' ? <Tippy content="Cadastrar novo módulo">
                <div className="add" onClick={handleModalSubAdd}>
                  +
                </div>
              </Tippy> :
                ''
              }
              
            </div>
            { 
            subs.map((sub) => (
              <Link
                key={sub.id_sub}
                className="sub-card"
                to={{
                  pathname: `/subsystem/${sub.id_sub}/${params.id_project}`,
                  state: {
                    projectName
                  }
                }}
              >
                {sub.nome}
              </Link>
            )) 
            }
          </div>

          <div className="members">
            <div className="card-header">
              <span>Membros</span>
              
              {
                level === '1' ? <Tippy content="Cadastrar novo membro">
                <div className="add" onClick={handleModalMemberAdd}>
                  +
                </div>
              </Tippy> :
                ''
              }
              
            </div>
            <table className="content-table" style={{marginTop: '10px'}} id="table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member.id_member}>
                    <td>{member.nome}</td>
                    <td>{member.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="info">
            <div className="dominio">
              <span>Domínio</span>
              <input type="text" defaultValue={projectDomain} disabled />
            </div>

            <div className="tipo">
              <span>Tipo</span>
              <input type="text" defaultValue={projectType} disabled />
            </div>

            <div className="descricao">
              <span>Descrição</span>
              <div className="desc-info">{projectDescription}</div>
            </div>
          </div>
        </div>

        <div className={`modal modal-sub ${modalSub}`}>
          <div className="card-modal-sub">
            <div className="card-header">
              Cadastrar Módulo
              <div className="close" onClick={handleModalSubAdd}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleCreateSub}>
                <label htmlFor="">Nome</label>
                <input
                  type="text"
                  value={subName}
                  required
                  onChange={(e) => setSubName(e.target.value)}
                />
                <label htmlFor="">Descrição</label>
                <textarea
                  cols="30"
                  rows="4"
                  value={subDescription}
                  required
                  onChange={(e) => setSubDescription(e.target.value)}
                />
                <button type="submit">Cadastrar</button>
              </form>
            </div>
          </div>
        </div>

        <div className={`modal modal-member ${modalMember}`}>
          <div className="card-modal-sub">
            <div className="card-header">
              Cadastrar Membro
              <div className="close" onClick={handleModalMemberAdd}>
                x
              </div>
            </div>

            <div className="card-body">
              <form onSubmit={handleCreateMember}>
                <label htmlFor="">Nome</label>
                <input
                  type="text"
                  value={memberName}
                  required
                  onChange={(e) => setMemberName(e.target.value)}
                />

                <label htmlFor="">Email</label>
                <input
                  type="email"
                  value={memberEmail}
                  required
                  onChange={(e) => setMemberEmail(e.target.value)}
                />

                <label htmlFor="">Senha</label>
                <input
                  type="password"
                  value={memberPassword}
                  required
                  onChange={(e) => setMemberPassword(e.target.value)}
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
