import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IconButton from './components/IconButton';
import DespesaRecentes from './screens/DespesaRecentes';
import GerenciarDespesa from './screens/GerenciarDespesa';
import TodasDespesas from './screens/TodasDespesas';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabScreen() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="add"
            size={24}
            color={tintColor}
            onPress={() => navigation.navigate('GerenciarDespesa')}
          />
        ),
      }}
    >
      <Tab.Screen
        name="DespesaRecentes"
        component={DespesaRecentes}
        options={{
          title: 'Despesas Recentes',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="hourglass" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="TodasDespesas"
        component={TodasDespesas}
        options={{
          title: 'Todas as Despesas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Despesas"
          component={BottomTabScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GerenciarDespesa"
          component={GerenciarDespesa}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}