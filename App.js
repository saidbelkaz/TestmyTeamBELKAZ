import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import FormationScreen from './src/screens/FormationScreen';

export default function App() {
  return (
    <View style={{
      backgroundColor: '#fff',
      marginTop: 15
    }}>
      <StatusBar style="auto" />
      <FormationScreen />
    </View>
  );
}
