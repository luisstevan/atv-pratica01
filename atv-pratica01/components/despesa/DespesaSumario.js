import { StyleSheet, Text, View } from 'react-native';

function DespesaSumario({ despesas, periodo }) {
  const soma = despesas.reduce((total, despesa) => {
    return total + despesa.valor;
  }, 0);

  return (
    <View style={styles.container}>
      <Text>{periodo}</Text>
      <Text>R$ {soma.toFixed(2)}</Text>
    </View>
  );
}

export default DespesaSumario;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});