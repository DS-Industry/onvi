import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import { dp } from '../../utils/dp';
import useStore from '../../state/store';
import BalancePlaceholder from './BalancePlaceholder';

interface BalanceProps {
  bottomSheetIndex: number;
}

const Balance = ({ bottomSheetIndex }: BalanceProps) => {
  const { user } = useStore();

  if (!user || !user.cards) {
    return (
      <View style={styles.container}>
        <BalancePlaceholder bottomSheetIndex={bottomSheetIndex} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.buttonWrapper,
          { display: bottomSheetIndex > 2 ? 'none' : 'flex' },
        ]}
        onPress={() => {
        }}
      >
        <Svg
          width="100%"
          height="100%"
          style={StyleSheet.absoluteFill}
        >
          <Defs>
            <LinearGradient
              id="balanceGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <Stop offset="0%" stopColor="#FF8A00" />
              <Stop offset="50%" stopColor="#FF2D9A" />
              <Stop offset="100%" stopColor="#8B2CFF" />
            </LinearGradient>
          </Defs>

          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="22.5"
            ry="22.5"
            fill="url(#balanceGradient)"
          />
        </Svg>

        <View style={styles.buttonContent}>
          <Image
            source={require('../../assets/icons/small-icon.png')}
            style={styles.leftIcon}
          />

          <Text
            style={styles.balanceText}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.cards.balance}
          </Text>

        
        </View>
        
      </TouchableOpacity>
      <View style={styles.rightIconWrapper} pointerEvents="none">
        <Image
          source={require('../../assets/images/onvi-game.webp')}
          style={styles.rightIcon}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: dp(10),
    right: dp(6),
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        top: dp(15),
      },
    }),
  },

  buttonWrapper: {
    height: dp(40),
    marginHorizontal: dp(4),
    borderRadius: 22.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },

  buttonContent: {
    flex: 1,
    paddingHorizontal: dp(8),
    flexDirection: 'row',
    alignItems: 'center',
  },

  leftIcon: {
    width: dp(30),
    height: dp(30),
  },

  rightIconWrapper: {
    position: 'absolute',
    right: dp(0),
    marginBottom: dp(18),
    zIndex: 1,
  },

  rightIcon: {
    width: dp(60),
  },

  balanceText: {
    color: '#FFFFFF',
    fontSize: dp(16),
    fontWeight: '600',
    marginLeft: dp(4),
    marginRight: dp(42),
    flexShrink: 1,
    textAlign: 'center',
  },
});

export { Balance };
