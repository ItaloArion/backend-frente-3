import { Link } from 'react-router-dom'
import AuthLogo from '../componentes/AuthLogo'

export default function HomePage() {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <AuthLogo />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '2rem' }}>
          <Link to="/login" className="auth-button" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Fazer Login
          </Link>
          <Link to="/cadastro" className="auth-button" style={{ textAlign: 'center', textDecoration: 'none' }}>
            Criar Conta
          </Link>
        </div>
      </div>

      <div className="auth-decoration">
        <svg width="100%" height="100%" viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#315B1F" d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#F9A01B" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,192C1200,160,1320,139,1380,122.7L1440,106.7L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  )
}
