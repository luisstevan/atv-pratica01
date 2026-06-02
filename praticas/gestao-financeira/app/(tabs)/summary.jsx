import { useContext, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { MoneyContext } from "../../contexts/GlobalState";
import SummaryItem from "../../components/SummaryItem";
import MonthYearFilter, { filterByMonthYear } from "../../components/MonthYearFilter";
import PieChart from "../../components/PieChart";
import { globalStyles } from "../../styles/globalStyles";
import { colors } from "../../constants/colors";

export default function Summary() {
  const now = new Date();
  const { transactions, categories, loading } = useContext(MoneyContext);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const filteredTransactions = useMemo(() => filterByMonthYear(transactions, month, year), [transactions, month, year]);

  const { totalsById, balance, chartData } = useMemo(() => {
    const acc = {};
    let saldo = 0;
    for (const c of categories) acc[c.id] = 0;
    for (const t of filteredTransactions) {
      const numericValue = Number(t.value);
      acc[t.categoryId] = (acc[t.categoryId] ?? 0) + numericValue;
      const cat = t.category ?? categories.find((c) => c.id === t.categoryId);
      saldo += cat?.isIncome ? numericValue : -numericValue;
    }
    const pie = categories
      .filter((c) => !c.isIncome && (acc[c.id] ?? 0) > 0)
      .map((c) => ({ id: c.id, label: c.displayName, value: acc[c.id], background: c.background }));
    return { totalsById: acc, balance: saldo, chartData: pie };
  }, [filteredTransactions, categories]);

  if (loading && categories.length === 0) {
    return <View style={[globalStyles.screenContainer, styles.center]}><ActivityIndicator size="large" color={colors.primary} /></View>;
  }

  const balanceStyle = balance >= 0 ? globalStyles.positiveText : globalStyles.negativeText;

  return (
    <View style={globalStyles.screenContainer}>
      <ScrollView style={globalStyles.content}>
        <MonthYearFilter month={month} setMonth={setMonth} year={year} setYear={setYear} />
        <Text style={styles.sectionTitle}>Gráfico de despesas</Text>
        <PieChart data={chartData} />
        <Text style={styles.sectionTitle}>Resumo por categoria</Text>
        {categories.map((category) => <SummaryItem key={category.id} category={category} value={totalsById[category.id] ?? 0} />)}
        <View style={globalStyles.line} />
        <View style={styles.balance}><Text style={styles.balanceText}>Saldo</Text><Text style={balanceStyle}>{balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</Text></View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  balance: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  balanceText: { fontSize: 18, color: colors.primaryText, fontWeight: "800" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  sectionTitle: { fontSize: 18, color: colors.primaryText, fontWeight: "900", marginTop: 6, marginBottom: 6 },
});
