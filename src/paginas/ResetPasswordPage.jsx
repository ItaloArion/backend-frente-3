import { Link } from 'react-router-dom'
import AuthLogo from '../componentes/AuthLogo'

export default function ResetPasswordPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <AuthLogo />

        <form className="auth-form">
          <div className="auth-field">
            <label htmlFor="senha">Insira Nova Senha</label>
            <input id="senha" type="password" required />
          </div>

          <div className="auth-password-rules">
            Necessário para senha:<br />
            - 8 caracteres<br />
            - Letras<br />
            - Números
          </div>

          <div className="auth-field">
            <label htmlFor="confirmacaoSenha">Repetir Nova Senha</label>
            <input id="confirmacaoSenha" type="password" required />
          </div>

          <button className="auth-button" type="submit">
            Redefinir Senha
          </button>
        </form>
      </div>
    </div>
  )
}
