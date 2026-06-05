import { Picker } from "@react-native-picker/picker";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function filterByMonthYear(items, month, year) {
  return items.filter((item) => {
    const date = new Date(item.date);
    return date.getMonth() + 1 === month && date.getFullYear() === year;
  });
}

export default function MonthYearFilter({ month, setMonth, year, setYear }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Mês</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={month} onValueChange={setMonth}>
            {MONTHS.map((label, index) => (
              <Picker.Item key={label} label={label} value={index + 1} />
            ))}
          </Picker>
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Ano</Text>
        <View style={styles.pickerBox}>
          <Picker selectedValue={year} onValueChange={setYear}>
            {years.map((y) => <Picker.Item key={y} label={String(y)} value={y} />)}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", gap: 12, marginBottom: 12 },
  field: { flex: 1 },
  label: { color: colors.primaryText, fontWeight: "700", marginBottom: 4 },
  pickerBox: { height: 44, justifyContent: "center", borderWidth: 1, borderRadius: 8, borderColor: colors.secondaryText },
});
