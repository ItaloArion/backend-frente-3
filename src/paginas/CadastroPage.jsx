import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../servicos/api'
import AuthLogo from '../componentes/AuthLogo'

export default function CadastroPage() {
  const [formulario, setFormulario] = useState({
    nome: '', email: '', senha: '', confirmacaoSenha: '',
    telefone: '', dataNascimento: '', aceiteTermos: false
  })
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  function aoDigitar(evento) {
    const { name, value, type, checked } = evento.target
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await api.post('/api/auth/cadastro', formulario)
      navegar('/login')
    } catch (e) {
      alert(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'left', marginBottom: '1rem' }}>
          <Link to="/" className="auth-link">Voltar</Link>
        </div>
        <AuthLogo />

        <form onSubmit={aoEnviar} className="auth-form">
          <div className="auth-field">
            <label htmlFor="nome">Nome Completo</label>
            <input id="nome" name="nome" value={formulario.nome} onChange={aoDigitar} required />
          </div>
          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" value={formulario.email} onChange={aoDigitar} required />
          </div>
          <div className="auth-field">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" name="telefone" value={formulario.telefone} onChange={aoDigitar} />
          </div>
          <div className="auth-field">
            <label htmlFor="senha">Criar Senha</label>
            <input id="senha" name="senha" type="password" value={formulario.senha} onChange={aoDigitar} required />
          </div>

          <div className="auth-password-rules">
            Necessário para senha:<br />
            - 8 caracteres<br />
            - Letras<br />
            - Números
          </div>

          <div className="auth-field">
            <label htmlFor="confirmacaoSenha">Confirmar Senha</label>
            <input id="confirmacaoSenha" name="confirmacaoSenha" type="password"
                   value={formulario.confirmacaoSenha} onChange={aoDigitar} required />
          </div>

          {/* Fields required by backend but not in reference image are kept hidden or handled internally */}
          <input type="hidden" name="dataNascimento" value="2000-01-01" />
          <input type="hidden" name="aceiteTermos" value="true" />

          <button className="auth-button" type="submit" disabled={enviando}>
            {enviando ? 'Cadastrando...' : 'Criar Conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
