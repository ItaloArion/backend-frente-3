import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rota /meu-voluntariado - exige login (RotaProtegida no App.jsx).
 * RN18/RF19 - o backend (GET /api/candidaturas/minhas) ja filtra pelo
 * usuario autenticado; esta tela nunca mostra candidatura de outra pessoa.
 */
export default function MeuVoluntariadoPage() {
  const [candidaturas, setCandidaturas] = useState([])
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
      setCandidaturas(await api.get('/api/candidaturas/minhas'))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function cancelar(candidatura) {
    if (!window.confirm(`Cancelar sua candidatura para "${candidatura.oportunidadeTitulo}"?`)) return
    setErro('')
    setAviso('')
    try {
      await api.patch(`/api/candidaturas/${candidatura.id}/cancelar`)
      setAviso('Candidatura cancelada.')
      carregar()
    } catch (e) {
      setErro(e.message)
    }
  }

  return (
    <div>
      <div className="titulo-pagina"><h1>Meu voluntariado</h1></div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : candidaturas.length === 0 ? (
          <div className="vazio">Voce ainda nao se candidatou a nenhuma oportunidade.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Oportunidade</th><th>Situacao</th><th>Participacao</th><th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {candidaturas.map((c) => (
                <tr key={c.id}>
                  <td>{c.oportunidadeTitulo}</td>
                  <td><span className={'etiqueta ' + corSituacao(c.situacao)}>{c.situacao}</span></td>
                  <td>{c.resultadoParticipacao || '-'}</td>
                  <td className="acoes">
                    {(c.situacao === 'PENDENTE' || c.situacao === 'APROVADA') && (
                      <button className="botao pequeno perigo" onClick={() => cancelar(c)}>Cancelar</button>
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
