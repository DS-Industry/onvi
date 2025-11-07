import {ActivityIndicator, View} from 'react-native';
import {YELLOW, WHITE} from '@utils/colors';

const LoadingScreen = () => (
  <View
    style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: WHITE,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
    }}>
    <ActivityIndicator size="large" color={YELLOW} />
  </View>
);

export default LoadingScreen;
