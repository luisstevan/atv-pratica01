import { FlatList } from 'react-native';
import DespesaItem from './DespesaItem';

function DespesaLista({ despesas }) {
  return (
    <FlatList
      data={despesas}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DespesaItem
          descricao={item.descricao}
          valor={item.valor}
          data={item.data}
        />
      )}
    />
  );
}

export default DespesaLista;