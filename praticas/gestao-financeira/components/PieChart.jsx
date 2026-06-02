import Svg, { Circle, G } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/colors";

export default function PieChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const size = 180;
  const strokeWidth = 36;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total <= 0) {
    return <Text style={styles.empty}>Sem despesas no período para gerar o gráfico.</Text>;
  }

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {data.map((item) => {
            const dash = (item.value / total) * circumference;
            const circle = (
              <Circle
                key={item.id}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.background}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                fill="transparent"
              />
            );
            offset += dash;
            return circle;
          })}
        </G>
      </Svg>
      <View style={styles.legend}>
        {data.map((item) => (
          <View key={item.id} style={styles.legendRow}>
            <View style={[styles.dot, { backgroundColor: item.background }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 10, marginVertical: 16 },
  empty: { color: colors.secondaryText, textAlign: "center", marginVertical: 12 },
  legend: { width: "100%", gap: 6 },
  legendRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { color: colors.primaryText },
});
