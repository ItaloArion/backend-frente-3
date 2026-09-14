import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './componentes/Layout'
import RotaProtegida from './componentes/RotaProtegida'

import LoginPage from './paginas/LoginPage'
import CadastroPage from './paginas/CadastroPage'
import HomePage from './paginas/HomePage'
import ErrorPage from './paginas/ErrorPage'
import RecoverPasswordPage from './paginas/RecoverPasswordPage'
import ResetPasswordPage from './paginas/ResetPasswordPage'

import NecessidadesPublicasPage from './paginas/necessidades/NecessidadesPublicasPage'
import NecessidadeListaPage from './paginas/necessidades/NecessidadeListaPage'
import NecessidadeFormPage from './paginas/necessidades/NecessidadeFormPage'

import CategoriaListaPage from './paginas/categorias/CategoriaListaPage'
import CategoriaFormPage from './paginas/categorias/CategoriaFormPage'

import OportunidadeListaPublicaPage from './paginas/voluntariado/OportunidadeListaPublicaPage'
import OportunidadeDetalhePage from './paginas/voluntariado/OportunidadeDetalhePage'
import OportunidadeAdminPage from './paginas/voluntariado/OportunidadeAdminPage'
import OportunidadeFormPage from './paginas/voluntariado/OportunidadeFormPage'
import CandidatosPage from './paginas/voluntariado/CandidatosPage'
import MeuVoluntariadoPage from './paginas/voluntariado/MeuVoluntariadoPage'

/**
 * ====================================================================
 * MAPA de ENDERECOS DO SITE.
 * ====================================================================
 */
export default function App() {
  return (
    <Layout>
      <Routes>

        {/* ---------- publico / autenticação ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/erro" element={<ErrorPage />} />
        <Route path="/recuperar-senha" element={<RecoverPasswordPage />} />
        <Route path="/redefinir-senha" element={<ResetPasswordPage />} />
        <Route path="/necessidades" element={<NecessidadesPublicasPage />} />

        {/* ---------- administrativo: categorias (MOLDE) ---------- */}
        <Route path="/admin/categorias"
               element={<RotaProtegida somenteAdmin><CategoriaListaPage /></RotaProtegida>} />
        <Route path="/admin/categorias/nova"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />
        <Route path="/admin/categorias/:id"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />

        {/* ---------- administrativo: necessidades ---------- */}
        <Route path="/admin/necessidades"
               element={<RotaProtegida somenteAdmin><NecessidadeListaPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/nova"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/:id"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />

        {/* ================= FRENTE 1 - DOACOES ================= */}
        {/* adicione suas rotas aqui */}

        {/* ================= FRENTE 2 - CAMPANHAS ================= */}
        {/* adicione suas rotas aqui */}

        {/* ================= FRENTE 3 - VOLUNTARIADO ================= */}
        <Route path="/oportunidades" element={<OportunidadeListaPublicaPage />} />
        <Route path="/oportunidades/:id" element={<OportunidadeDetalhePage />} />

        <Route path="/admin/oportunidades"
               element={<RotaProtegida somenteAdmin><OportunidadeAdminPage /></RotaProtegida>} />
        <Route path="/admin/oportunidades/nova"
               element={<RotaProtegida somenteAdmin><OportunidadeFormPage /></RotaProtegida>} />
        <Route path="/admin/oportunidades/:id"
               element={<RotaProtegida somenteAdmin><OportunidadeFormPage /></RotaProtegida>} />
        <Route path="/admin/oportunidades/:id/candidatos"
               element={<RotaProtegida somenteAdmin><CandidatosPage /></RotaProtegida>} />

        <Route path="/meu-voluntariado"
               element={<RotaProtegida><MeuVoluntariadoPage /></RotaProtegida>} />

        {/* ================= FRENTE 4 - ACOES SOCIAIS ================= */}
        {/* adicione suas rotas aqui */}

        {/* endereco que nao existe volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
