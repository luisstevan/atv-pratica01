import DespesaSaida from '../components/despesa/DespesaSaida';

const DUMMY_DESPESAS = [
  {
    id: '1',
    descricao: 'Pizza',
    valor: 50,
    data: new Date(),
  },
  {
    id: '2',
    descricao: 'Uber',
    valor: 20,
    data: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '3',
    descricao: 'Mercado',
    valor: 100,
    data: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
];

function TodasDespesas() {
  return <DespesaSaida despesas={DUMMY_DESPESAS} periodo="Total" />;
}

export default TodasDespesas;