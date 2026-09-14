import { Link } from 'react-router-dom'
import AuthLogo from '../componentes/AuthLogo'

export default function RecoverPasswordPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <AuthLogo />

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" required />
          </div>

          <button className="auth-button" type="submit">
            Recuperar Senha
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" className="auth-link">Voltar para página inicial</Link>
        </div>
      </div>
    </div>
  )
}
