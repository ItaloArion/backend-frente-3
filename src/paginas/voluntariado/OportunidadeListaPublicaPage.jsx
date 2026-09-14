import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rota publica /oportunidades - funciona sem login (RF17).
 *
 * O backend (GET /api/oportunidades) devolve TODAS as situacoes, porque
 * o mesmo endpoint tambem alimenta a tela administrativa. Aqui, na tela
 * publica, mostramos somente as oportunidades ABERTAS.
 */
export default function OportunidadeListaPublicaPage() {
  const [oportunidades, setOportunidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    carregar()
  }, [])

  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      const dados = await api.get('/api/oportunidades')
      setOportunidades(dados.filter((o) => o.situacao === 'ABERTA'))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div>
      <div className="titulo-pagina"><h1>Oportunidades de voluntariado</h1></div>

      {erro && <div className="alerta erro">{erro}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : oportunidades.length === 0 ? (
          <div className="vazio">Nenhuma oportunidade aberta no momento.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Titulo</th><th>Data</th><th>Local</th><th>Vagas livres</th><th></th>
              </tr>
            </thead>
            <tbody>
              {oportunidades.map((o) => (
                <tr key={o.id}>
                  <td>{o.titulo}</td>
                  <td>{o.dataAtividade}</td>
                  <td>{o.local}</td>
                  <td>{o.vagasLivres} de {o.vagas}</td>
                  <td className="acoes">
                    <Link className="botao pequeno" to={`/oportunidades/${o.id}`}>Ver detalhes</Link>
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
