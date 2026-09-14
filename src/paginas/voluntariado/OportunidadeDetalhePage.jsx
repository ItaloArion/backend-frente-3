import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../../servicos/api'
import { estaLogado } from '../../servicos/auth'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rota publica /oportunidades/:id - funciona sem login.
 * O botao Candidatar-se so aparece ativo para quem esta logado; a regra
 * de verdade (situacao ABERTA, vaga, idade minima, duplicidade) e toda
 * validada no backend (RN13, RN14, RN15, RN26) - aqui so refletimos o
 * estado que o backend devolve.
 */
export default function OportunidadeDetalhePage() {
  const { id } = useParams()
  const logado = estaLogado()

  const [oportunidade, setOportunidade] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')
  const [candidatando, setCandidatando] = useState(false)

  useEffect(() => {
    carregar()
  }, [id])

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      setOportunidade(await api.get(`/api/oportunidades/${id}`))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  async function candidatar() {
    setErro('')
    setAviso('')
    setCandidatando(true)
    try {
      await api.post(`/api/candidaturas?oportunidadeId=${id}`)
      setAviso('Candidatura enviada com sucesso! Acompanhe em "Meu voluntariado".')
      carregar() // atualiza vagas ocupadas/livres na tela
    } catch (e) {
      setErro(e.message)
    } finally {
      setCandidatando(false)
    }
  }

  if (carregando) return <div className="vazio">Carregando...</div>
  if (erro && !oportunidade) return <div className="alerta erro">{erro}</div>
  if (!oportunidade) return null

  const podeCandidatar = oportunidade.situacao === 'ABERTA' && oportunidade.vagasLivres > 0

  return (
    <div>
      <div className="titulo-pagina"><h1>{oportunidade.titulo}</h1></div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      <div className="cartao">
        <p>{oportunidade.descricao}</p>

        <table className="tabela">
          <tbody>
            <tr><td><strong>Atividade</strong></td><td>{oportunidade.atividade}</td></tr>
            <tr><td><strong>Data</strong></td><td>{oportunidade.dataAtividade}</td></tr>
            <tr><td><strong>Horario</strong></td><td>{oportunidade.horario}</td></tr>
            <tr><td><strong>Local</strong></td><td>{oportunidade.local}</td></tr>
            <tr><td><strong>Idade minima</strong></td><td>{oportunidade.idadeMinima || 'Sem restricao'}</td></tr>
            <tr><td><strong>Requisitos</strong></td><td>{oportunidade.requisitos || '-'}</td></tr>
            <tr><td><strong>Vagas totais</strong></td><td>{oportunidade.vagas}</td></tr>
            <tr><td><strong>Vagas ocupadas</strong></td><td>{oportunidade.vagasOcupadas}</td></tr>
            <tr><td><strong>Vagas livres</strong></td><td>{oportunidade.vagasLivres}</td></tr>
            <tr>
              <td><strong>Situacao</strong></td>
              <td><span className={'etiqueta ' + corSituacao(oportunidade.situacao)}>{oportunidade.situacao}</span></td>
            </tr>
          </tbody>
        </table>

        <div className="acoes-form">
          {!logado && (
            <Link className="botao primario" to="/login">Entrar para se candidatar</Link>
          )}
          {logado && podeCandidatar && (
            <button className="botao primario" onClick={candidatar} disabled={candidatando}>
              {candidatando ? 'Enviando...' : 'Candidatar-se'}
            </button>
          )}
          {logado && !podeCandidatar && (
            <span>
              {oportunidade.situacao !== 'ABERTA'
                ? 'Esta oportunidade nao esta aberta para candidaturas.'
                : 'Nao ha vagas disponiveis nesta oportunidade.'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

/** Reaproveita as 4 cores de etiqueta ja definidas no styles.css. */
function corSituacao(situacao) {
  if (situacao === 'ABERTA') return 'verde'
  if (situacao === 'PLANEJADA') return 'amarela'
  if (situacao === 'CANCELADA') return 'vermelha'
  return 'cinza' // ENCERRADA
}
