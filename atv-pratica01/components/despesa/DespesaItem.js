import { Pressable, StyleSheet, Text, View } from 'react-native';

function getDataFormatada(data) {
  if (!data) return 'Sem data';

  return (
    data.getDate() + '/' + (data.getMonth() + 1) + '/' + data.getFullYear()
  );
}

function DespesaItem({ descricao, valor, data }) {
  return (
    <Pressable>
      <View style={styles.container}>
        
        {/* Lado esquerdo */}
        <View>
          <Text style={styles.descricao}>{descricao}</Text>
          <Text style={styles.data}>{getDataFormatada(data)}</Text>
        </View>

        {/* Lado direito */}
        <View style={styles.valorContainer}>
          <Text style={styles.valor}>R$ {valor}</Text>
        </View>

      </View>
    </Pressable>
  );
}

export default DespesaItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#e0e0e0',
  },
  descricao: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  data: {
    fontSize: 12,
    color: '#555',
  },
  valorContainer: {
    justifyContent: 'center',
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});