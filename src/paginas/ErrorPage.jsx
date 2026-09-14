import { Link } from 'react-router-dom'

export default function ErrorPage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-error-icon">X</div>

        <h1 style={{ color: 'var(--color-dark-green)', fontSize: '22px', marginBottom: '8px' }}>
          Erro ao acessar
        </h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '2rem' }}>
          Tente novamente
        </p>

        <Link to="/login" className="auth-button" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>
          Tentar Novamente
        </Link>
      </div>
    </div>
  )
}
