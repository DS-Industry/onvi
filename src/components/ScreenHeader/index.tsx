import {View, Text, StyleSheet, Platform} from 'react-native';

import {dp} from '../../utils/dp';
import {BurgerButton} from '@navigators/BurgerButton';
import {BackButton} from '@components/BackButton';

interface ScreenHeaderProps {
  screenTitle: string;
  btnType?: 'burger' | 'back';
  btnCallback?: () => void;
}

export default function ScreenHeader({
  screenTitle,
  btnType = 'burger',
  btnCallback = () => {},
}: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {btnType === 'burger' && <BurgerButton isDrawerStack={true} />}
      {btnType === 'back' && <BackButton callback={btnCallback} />}
      <Text style={styles.screenTitle}>{screenTitle}</Text>
      <View style={{width: dp(50)}} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: dp(10),
  },
  screenTitle: {
    fontWeight: '700',
    fontSize: dp(24),
    textAlignVertical: 'center',
    color: '#000',
    letterSpacing: 0.2,
    ...Platform.select({
      ios: {
        lineHeight: dp(40),
      },
    }),
  },
});
