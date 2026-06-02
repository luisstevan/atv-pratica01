import { useContext, useState } from "react";
import { Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from "react-native";
import { router } from "expo-router";
import Button from "../components/Button";
import { MoneyContext } from "../contexts/GlobalState";
import { colors } from "../constants/colors";
import { globalStyles } from "../styles/globalStyles";

export default function Login() {
  const { login } = useContext(MoneyContext);
  const [email, setEmail] = useState("luis@iesb.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Informe e-mail e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      router.replace("/(tabs)");
    } catch (e) {
      Alert.alert("Acesso negado", "Usuário ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={[globalStyles.screenContainer, styles.container]}>
      <Text style={styles.title}>Gestão Financeira</Text>
      <Text style={styles.subtitle}>Entre para acessar suas receitas e despesas</Text>
      <View style={styles.form}>
        <Text style={globalStyles.inputLabel}>E-mail</Text>
        <TextInput value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" style={globalStyles.input} />
        <Text style={globalStyles.inputLabel}>Senha</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={globalStyles.input} />
        <Button onPress={handleLogin} disabled={loading}>{loading ? "Entrando..." : "Entrar"}</Button>
      </View>
      <Text style={styles.hint}>Usuário de teste: luis@iesb.com / 123456</Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: "center", padding: 24, backgroundColor: colors.background },
  title: { fontSize: 28, fontWeight: "900", color: colors.primary, textAlign: "center" },
  subtitle: { color: colors.secondaryText, textAlign: "center", marginTop: 8, marginBottom: 24 },
  form: { gap: 10 },
  hint: { color: colors.secondaryText, textAlign: "center", marginTop: 18 },
});
