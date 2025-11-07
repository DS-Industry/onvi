import {View, Text, StyleSheet} from 'react-native';

import {dp} from '../../utils/dp';
import {WHITE} from '@utils/colors';

interface EmptyPlaceholderProps {
  text: string;
}

const EmptyPlaceholder = ({text}: EmptyPlaceholderProps) => {
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    borderRadius: 22,
    padding: dp(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EmptyPlaceholder;
