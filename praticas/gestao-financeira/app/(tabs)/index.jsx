import { useContext, useMemo, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Modal, RefreshControl, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import { MoneyContext } from "../../contexts/GlobalState";
import TransactionItem from "../../components/TransactionItem";
import MonthYearFilter, { filterByMonthYear } from "../../components/MonthYearFilter";
import Button from "../../components/Button";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

export default function Transactions() {
  const now = new Date();
  const { transactions = [], categories = [], loading, error, refresh, removeTransaction, updateTransaction, user, logout } = useContext(MoneyContext);

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [selected, setSelected] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const filteredTransactions = useMemo(
    () => filterByMonthYear(transactions ?? [], month, year),
    [transactions, month, year]
  );

  function openActions(item) {
    if (!item) return;

    setSelected(item);
    setEditForm({
      description: item.description ?? "",
      value: String(Number(item.value ?? 0)),
      date: item.date ? new Date(item.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      categoryId: item.categoryId ?? item.category?.id ?? categories?.[0]?.id ?? "",
    });
  }

  async function handleSave() {
    if (!selected || !editForm) return;

    if (!editForm.description?.trim() || Number(editForm.value) <= 0) {
      Alert.alert("Dados inválidos", "Informe descrição e valor maior que zero.");
      return;
    }

    try {
      await updateTransaction(selected.id, {
        description: editForm.description.trim(),
        value: Number(editForm.value),
        date: editForm.date,
        categoryId: editForm.categoryId,
      });
      setSelected(null);
      setEditForm(null);
    } catch (e) {
      Alert.alert("Erro ao editar", e.message ?? "Tente novamente.");
    }
  }

  function handleDelete() {
    if (!selected) return;

    Alert.alert("Excluir transação", `Deseja excluir "${selected.description}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await removeTransaction(selected.id);
            setSelected(null);
            setEditForm(null);
          } catch (e) {
            Alert.alert("Erro ao excluir", e.message ?? "Tente novamente.");
          }
        },
      },
    ]);
  }

  if (loading && transactions.length === 0) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={globalStyles.secondaryText}>Carregando transações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[globalStyles.screenContainer, styles.center]}>
        <Text style={globalStyles.primaryText}>Não foi possível carregar.</Text>
        <Text style={globalStyles.secondaryText}>{error}</Text>
        <TouchableOpacity onPress={refresh} style={styles.retry}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={globalStyles.screenContainer}>
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={styles.welcomeRow}>
              <View>
                <Text style={styles.welcome}>Bem-vindo, {user?.name ?? "usuário"}!</Text>
                <Text style={globalStyles.secondaryText}>Toque longo em uma transação para editar ou excluir.</Text>
              </View>
              <TouchableOpacity onPress={logout} hitSlop={8}>
                <MaterialIcons name="logout" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
            <MonthYearFilter month={month} setMonth={setMonth} year={year} setYear={setYear} />
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => openActions(item)} activeOpacity={0.7}>
            <TransactionItem {...item} />
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={globalStyles.secondaryText}>Nenhuma transação para este mês/ano.</Text>}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
        contentContainerStyle={styles.listContent}
      />

      {selected && editForm && (
        <Modal visible={true} transparent animationType="fade" onRequestClose={() => setSelected(null)}>
          <View style={styles.modalBackdrop}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Editar transação</Text>

              <Text style={globalStyles.inputLabel}>Descrição</Text>
              <TextInput
                style={globalStyles.input}
                value={editForm.description ?? ""}
                onChangeText={(v) => setEditForm((prev) => ({ ...(prev ?? {}), description: v }))}
              />

              <Text style={globalStyles.inputLabel}>Valor</Text>
              <TextInput
                style={globalStyles.input}
                value={editForm.value ?? ""}
                keyboardType="numeric"
                onChangeText={(v) => setEditForm((prev) => ({ ...(prev ?? {}), value: v.replace(",", ".") }))}
              />

              <Text style={globalStyles.inputLabel}>Data</Text>
              <TextInput
                style={globalStyles.input}
                value={editForm.date ?? ""}
                placeholder="AAAA-MM-DD"
                onChangeText={(v) => setEditForm((prev) => ({ ...(prev ?? {}), date: v }))}
              />

              <Text style={globalStyles.inputLabel}>Categoria</Text>
              <View style={styles.pickerBox}>
                <Picker
                  selectedValue={editForm.categoryId ?? ""}
                  onValueChange={(v) => setEditForm((prev) => ({ ...(prev ?? {}), categoryId: v }))}
                >
                  {categories.map((c) => (
                    <Picker.Item key={c.id} label={c.displayName} value={c.id} />
                  ))}
                </Picker>
              </View>

              <View style={styles.modalButtons}>
                <Button onPress={handleSave}>Salvar</Button>
                <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                  <Text style={styles.deleteText}>Excluir</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setSelected(null); setEditForm(null); }}>
                  <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: { paddingVertical: 12, paddingHorizontal: 20, gap: 12 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 8, padding: 24 },
  retry: { marginTop: 12, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: colors.primary, borderRadius: 8 },
  retryText: { color: colors.primaryContrast, fontWeight: "600" },
  welcomeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  welcome: { fontSize: 20, fontWeight: "900", color: colors.primaryText },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 20 },
  modalBox: { backgroundColor: colors.background, borderRadius: 16, padding: 18, gap: 8 },
  modalTitle: { fontSize: 20, fontWeight: "900", color: colors.primaryText, marginBottom: 6 },
  pickerBox: { height: 44, justifyContent: "center", borderWidth: 1, borderRadius: 8, borderColor: colors.secondaryText },
  modalButtons: { gap: 10, marginTop: 12 },
  deleteButton: { alignItems: "center", padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.negativeText },
  deleteText: { color: colors.negativeText, fontWeight: "800" },
  cancelText: { textAlign: "center", color: colors.secondaryText, fontWeight: "700" },
});