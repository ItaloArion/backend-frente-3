import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { entrar } from '../servicos/auth'
import AuthLogo from '../componentes/AuthLogo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  async function aoEnviar(evento) {
    evento.preventDefault()
    setEnviando(true)
    try {
      await entrar(email, senha)
      navegar('/')
    } catch (e) {
      navegar('/erro')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <AuthLogo />

        <form onSubmit={aoEnviar} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email}
                   onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="auth-field">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha}
                   onChange={(e) => setSenha(e.target.value)} required />
          </div>

          <div className="auth-links">
            <Link to="/" className="auth-link">Voltar</Link>
            <Link to="/recuperar-senha" className="auth-link">Esqueci a senha</Link>
          </div>

          <button className="auth-button" type="submit" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Acessar conta'}
          </button>
        </form>
      </div>
    </div>
  )
}
