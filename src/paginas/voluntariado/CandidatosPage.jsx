import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rota /admin/oportunidades/:id/candidatos - somente administrador.
 *
 * Mostra o contador de vagas (totais/ocupadas/livres) e a lista de
 * candidatos com Aprovar/Recusar/Cancelar. Para candidaturas ja
 * APROVADAS, tambem permite registrar a participacao (RN16) -
 * PRESENTE, AUSENTE ou CANCELADA - que e o outro lado do fluxo de
 * voluntariado gerenciado por esta mesma tela.
 */
export default function CandidatosPage() {
  const { id } = useParams()
  const navegar = useNavigate()

  const [oportunidade, setOportunidade] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  useEffect(() => {
    carregar()
  }, [id])

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      const [dadosOportunidade, dadosCandidatos] = await Promise.all([
        api.get(`/api/oportunidades/${id}`),
        api.get(`/api/oportunidades/${id}/candidaturas`)
      ])
      setOportunidade(dadosOportunidade)
      setCandidatos(dadosCandidatos)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function aprovar(candidatura) {
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/candidaturas/${candidatura.id}/aprovar`)
      setAviso('Candidatura aprovada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function recusar(candidatura) {
    const motivo = window.prompt('Motivo da recusa (opcional):', '') || ''
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/candidaturas/${candidatura.id}/recusar?motivo=${encodeURIComponent(motivo)}`)
      setAviso('Candidatura recusada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function cancelar(candidatura) {
    if (!window.confirm(`Cancelar a candidatura de "${candidatura.usuarioNome}"?`)) return
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/candidaturas/${candidatura.id}/cancelar`)
      setAviso('Candidatura cancelada. A vaga foi liberada, se estava aprovada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  async function registrarParticipacao(candidatura, resultado) {
    setErro('')
    setAviso('')
    try {
      await api.post(`/api/candidaturas/${candidatura.id}/participacao`, { resultado, observacao: '' })
      setAviso('Participacao registrada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>Candidatos {oportunidade ? `- ${oportunidade.titulo}` : ''}</h1>
        <button className="botao" onClick={() => navegar('/admin/oportunidades')}>Voltar</button>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      {oportunidade && (
        <div className="cartao">
          <strong>Vagas totais:</strong> {oportunidade.vagas} &nbsp;&nbsp;
          <strong>Ocupadas:</strong> {oportunidade.vagasOcupadas} &nbsp;&nbsp;
          <strong>Livres:</strong> {oportunidade.vagasLivres}
        </div>
      )}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : candidatos.length === 0 ? (
          <div className="vazio">Nenhum candidato ainda.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Candidato</th><th>Situacao</th><th>Participacao</th><th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {candidatos.map((c) => (
                <tr key={c.id}>
                  <td>{c.usuarioNome}</td>
                  <td><span className={'etiqueta ' + corSituacao(c.situacao)}>{c.situacao}</span></td>
                  <td>{c.resultadoParticipacao || '-'}</td>
                  <td className="acoes">
                    {c.situacao === 'PENDENTE' && (
                      <>
                        <button className="botao pequeno" onClick={() => aprovar(c)}>Aprovar</button>
                        <button className="botao pequeno perigo" onClick={() => recusar(c)}>Recusar</button>
                        <button className="botao pequeno" onClick={() => cancelar(c)}>Cancelar</button>
                      </>
                    )}
                    {c.situacao === 'APROVADA' && (
                      <>
                        <button className="botao pequeno" onClick={() => cancelar(c)}>Cancelar</button>
                        {!c.resultadoParticipacao && (
                          <>
                            <button className="botao pequeno" onClick={() => registrarParticipacao(c, 'PRESENTE')}>
                              Presente
                            </button>
                            <button className="botao pequeno" onClick={() => registrarParticipacao(c, 'AUSENTE')}>
                              Ausente
                            </button>
                          </>
                        )}
                      </>
                    )}
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
  if (situacao === 'APROVADA') return 'verde'
  if (situacao === 'PENDENTE') return 'amarela'
  if (situacao === 'RECUSADA' || situacao === 'CANCELADA') return 'vermelha'
  return 'cinza'
}
