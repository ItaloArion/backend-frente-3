import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rota /admin/oportunidades - somente administrador (RotaProtegida no App.jsx).
 * Usa o MESMO endpoint publico GET /api/oportunidades, mas aqui mostramos
 * TODAS as situacoes (PLANEJADA, ABERTA, ENCERRADA, CANCELADA) para que o
 * administrador consiga gerenciar o ciclo de vida completo.
 */
export default function OportunidadeAdminPage() {
  const [oportunidades, setOportunidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      setOportunidades(await api.get('/api/oportunidades'))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function abrir(oportunidade) {
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/oportunidades/${oportunidade.id}/abrir`)
      setAviso('Oportunidade aberta.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function encerrar(oportunidade) {
    if (!window.confirm(`Encerrar a oportunidade "${oportunidade.titulo}"?`)) return
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/oportunidades/${oportunidade.id}/encerrar`)
      setAviso('Oportunidade encerrada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>Gerir oportunidades</h1>
        <Link className="botao primario" to="/admin/oportunidades/nova">Nova oportunidade</Link>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : oportunidades.length === 0 ? (
          <div className="vazio">Nenhuma oportunidade cadastrada.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Titulo</th><th>Data</th><th>Vagas</th><th>Situacao</th><th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {oportunidades.map((o) => (
                <tr key={o.id}>
                  <td>{o.titulo}</td>
                  <td>{o.dataAtividade}</td>
                  <td>{o.vagasOcupadas} / {o.vagas}</td>
                  <td><span className={'etiqueta ' + corSituacao(o.situacao)}>{o.situacao}</span></td>
                  <td className="acoes">
                    <Link className="botao pequeno" to={`/admin/oportunidades/${o.id}`}>Editar</Link>
                    {o.situacao === 'PLANEJADA' && (
                      <button className="botao pequeno" onClick={() => abrir(o)}>Abrir</button>
                    )}
                    {o.situacao === 'ABERTA' && (
                      <button className="botao pequeno perigo" onClick={() => encerrar(o)}>Encerrar</button>
                    )}
                    <Link className="botao pequeno" to={`/admin/oportunidades/${o.id}/candidatos`}>
                      Candidatos
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function corSituacao(situacao) {
  if (situacao === 'ABERTA') return 'verde'
  if (situacao === 'PLANEJADA') return 'amarela'
  if (situacao === 'CANCELADA') return 'vermelha'
  return 'cinza'
}
