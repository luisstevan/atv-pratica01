import DespesaSaida from '../components/despesa/DespesaSaida';

const DUMMY_DESPESAS = [
  {
    id: '1',
    descricao: 'Conta de luz',
    valor: 100.99,
    data: new Date(),
  },
  {
    id: '2',
    descricao: 'Conta de água',
    valor: 40.99,
    data: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '3',
    descricao: 'Mercado antigo',
    valor: 150.0,
    data: new Date(new Date().setDate(new Date().getDate() - 10)),
  },
  {
    id: '4',
    descricao: 'Despesa futura',
    valor: 80.0,
    data: new Date(new Date().setDate(new Date().getDate() + 2)),
  },
];

function filtrarUltimos7Dias(despesas) {
  const hoje = new Date();
  const seteDiasAtras = new Date();
  seteDiasAtras.setDate(hoje.getDate() - 7);

  return despesas.filter((despesa) => {
    return despesa.data >= seteDiasAtras && despesa.data <= hoje;
  });
}

function DespesaRecentes() {
  const despesasRecentes = filtrarUltimos7Dias(DUMMY_DESPESAS);

  return (
    <DespesaSaida despesas={despesasRecentes} periodo="Últimos 7 dias" />
  );
}

export default DespesaRecentes;