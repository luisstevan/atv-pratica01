import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export const MoneyContext = createContext();

const USER_KEY = "@gestao-financeira:user";
const TOKEN_KEY = "@gestao-financeira:token";

export default function GlobalState({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [cats, txs] = await Promise.all([api.listCategories(), api.listTransactions()]);
      setCategories(cats);
      setTransactions(txs);
    } catch (e) {
      setError(e.message ?? "Falha ao carregar dados do servidor");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function restoreSession() {
      try {
        const [storedUser, storedToken] = await Promise.all([
          AsyncStorage.getItem(USER_KEY),
          AsyncStorage.getItem(TOKEN_KEY),
        ]);
        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } finally {
        setBooting(false);
      }
    }
    restoreSession();
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setUser(data.user);
    setToken(data.token);
    await AsyncStorage.multiSet([[USER_KEY, JSON.stringify(data.user)], [TOKEN_KEY, data.token]]);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
    setUser(null);
    setToken(null);
    setTransactions([]);
    setCategories([]);
  }, []);

  const addTransaction = useCallback(async (data) => {
    const created = await api.createTransaction(data);
    setTransactions((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateTransaction = useCallback(async (id, data) => {
    const updated = await api.updateTransaction(id, data);
    setTransactions((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTransaction = useCallback(async (id) => {
    await api.deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addCategory = useCallback(async (data) => {
    const created = await api.createCategory(data);
    setCategories((prev) => [...prev, created].sort((a, b) => a.displayName.localeCompare(b.displayName)));
    return created;
  }, []);

  const updateCategory = useCallback(async (id, data) => {
    const updated = await api.updateCategory(id, data);
    setCategories((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const removeCategory = useCallback(async (id) => {
    await api.deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <MoneyContext.Provider value={{
      transactions, categories, loading, booting, error, user, token,
      login, logout, refresh,
      addTransaction, updateTransaction, removeTransaction,
      addCategory, updateCategory, removeCategory,
    }}>
      {children}
    </MoneyContext.Provider>
  );
}
