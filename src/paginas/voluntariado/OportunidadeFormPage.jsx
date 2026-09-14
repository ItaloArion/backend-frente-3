import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * FRENTE 3 - VOLUNTARIADO.
 * Rotas /admin/oportunidades/nova e /admin/oportunidades/:id.
 * Um unico arquivo serve para CRIAR e EDITAR (o mesmo padrao do molde
 * CategoriaFormPage): sem id -> POST, com id -> PUT.
 * Toda validacao de regra de negocio (RN15 - nao reduzir vagas abaixo
 * dos aprovados, por exemplo) continua no backend.
 */
export default function OportunidadeFormPage() {
  const { id } = useParams()
  const navegar = useNavigate()
  const editando = id !== undefined

  const [formulario, setFormulario] = useState({
    titulo: '',
    descricao: '',
    atividade: '',
    vagas: '',
    dataAtividade: '',
    horario: '',
    local: '',
    idadeMinima: '',
    requisitos: ''
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    if (!editando) return

    api.get(`/api/oportunidades/${id}`)
      .then((d) => setFormulario({
        titulo: d.titulo,
        descricao: d.descricao,
        atividade: d.atividade,
        vagas: d.vagas,
        dataAtividade: d.dataAtividade,
        horario: d.horario,
        local: d.local,
        idadeMinima: d.idadeMinima ?? '',
        requisitos: d.requisitos || ''
      }))
      .catch((e) => setErro(e.message))
  }, [id])

  function aoDigitar(evento) {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setSalvando(true)

    try {
      const corpo = {
        ...formulario,
        vagas: Number(formulario.vagas),
        idadeMinima: formulario.idadeMinima === '' ? null : Number(formulario.idadeMinima)
      }

      if (editando) {
        await api.put(`/api/oportunidades/${id}`, corpo)
      } else {
        await api.post('/api/oportunidades', corpo)
      }
      navegar('/admin/oportunidades')
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>{editando ? 'Editar oportunidade' : 'Nova oportunidade'}</h1>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}

      <div className="cartao">
        <form onSubmit={aoEnviar}>

          <div className="campo">
            <label htmlFor="titulo">Titulo *</label>
            <input id="titulo" name="titulo" value={formulario.titulo} onChange={aoDigitar} maxLength={150} />
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descricao *</label>
            <textarea id="descricao" name="descricao" value={formulario.descricao} onChange={aoDigitar} maxLength={2000} />
          </div>

          <div className="campo">
            <label htmlFor="atividade">Atividade *</label>
            <input id="atividade" name="atividade" value={formulario.atividade} onChange={aoDigitar} maxLength={500} />
          </div>

          <div className="campo">
            <label htmlFor="vagas">Vagas *</label>
            <input id="vagas" name="vagas" type="number" min="1" value={formulario.vagas} onChange={aoDigitar} />
          </div>

          <div className="campo">
            <label htmlFor="dataAtividade">Data da atividade *</label>
            <input id="dataAtividade" name="dataAtividade" type="date"
                   value={formulario.dataAtividade} onChange={aoDigitar} />
          </div>

          <div className="campo">
            <label htmlFor="horario">Horario *</label>
            <input id="horario" name="horario" value={formulario.horario} onChange={aoDigitar}
                   placeholder="ex: 08:00 as 12:00" maxLength={50} />
          </div>

          <div className="campo">
            <label htmlFor="local">Local *</label>
            <input id="local" name="local" value={formulario.local} onChange={aoDigitar} maxLength={300} />
          </div>

          <div className="campo">
            <label htmlFor="idadeMinima">Idade minima (opcional)</label>
            <input id="idadeMinima" name="idadeMinima" type="number" min="1"
                   value={formulario.idadeMinima} onChange={aoDigitar} />
          </div>

          <div className="campo">
            <label htmlFor="requisitos">Requisitos (opcional)</label>
            <textarea id="requisitos" name="requisitos" value={formulario.requisitos}
                      onChange={aoDigitar} maxLength={1000} />
          </div>

          <div className="acoes-form">
            <button className="botao primario" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button className="botao" type="button" onClick={() => navegar('/admin/oportunidades')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
