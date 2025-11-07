import React, {PropsWithChildren, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {BLACK, BLUE, GREY, WHITE, YELLOW} from '../../../utils/colors';
import {dp} from '../../../utils/dp';
import {ArrowUpRight} from 'react-native-feather';
import {useTranslation} from 'react-i18next';
import {Price} from '../../../types/api/app/types.ts';

type AccordionItemPros = PropsWithChildren<{
  data: Price;
  color?: 'blue' | 'grey' | 'yellow' | 'black';
  onSelect: (name: string, price: number) => void;
}>;

const ExpandableView: React.FC<AccordionItemPros> = ({
  children,
  color = 'blue',
  data,
  onSelect,
}) => {
  const [expanded, setExpanded] = useState(false);
  const {t} = useTranslation();

  const getColor = () => {
    switch (color) {
      case 'blue':
        return BLUE;
      case 'grey':
        return GREY;
      case 'yellow':
        return YELLOW;
      default:
        return BLUE;
    }
  };

  const toggleItem = () => {
    setExpanded(!expanded);
  };

  const body = <View style={styles.body}>{children}</View>;

  return (
    <TouchableOpacity
      style={{...styles.container, backgroundColor: getColor()}}
      onPress={() => onSelect(data.name, data.cost)}>
      <View style={styles.header}>
        <Text
          style={{
            fontSize: dp(10),
            fontWeight: '600',
            color: color === 'blue' ? WHITE : BLACK,
          }}>
          {data.name}
        </Text>
        <ArrowUpRight width={dp(20)} height={dp(20)} color={'black'} />
      </View>
      <View style={styles.content}>
        <Text
          style={{
            color: color === 'blue' ? WHITE : BLACK,
            fontSize: dp(18),
            fontWeight: '600',
          }}>
          {data.name}
        </Text>
        <Text
          style={{
            color: color === 'blue' ? WHITE : BLACK,
            fontSize: dp(12),
            fontWeight: '600',
          }}>
          {data.serviceDuration} {t('time.minutes')}.
        </Text>
      </View>
      <View style={styles.footer}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.toggleBnt}
            onPress={toggleItem}
            hitSlop={{top: 25, bottom: 25, left: 20, right: 20}}>
            {expanded ? (
              <Text style={{fontWeight: '500', fontSize: dp(11)}}>
                ☝️{t('common.buttons.collapse').toLowerCase()}
              </Text>
            ) : (
              <Text style={{fontWeight: '500', fontSize: dp(11)}}>
                👇{t('common.buttons.moreDetails').toLowerCase()}
              </Text>
            )}
          </TouchableOpacity>
          <Text
            style={{
              color: color === 'blue' ? WHITE : BLACK,
              fontSize: dp(36),
              fontWeight: '600',
            }}>
            {data.cost} ₽
          </Text>
        </View>
      </View>
      {expanded && body}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: dp(25),
    marginTop: dp(16),
    padding: dp(16),
    minHeight: dp(120),
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBnt: {
    alignSelf: 'center',
    backgroundColor: 'rgba(245, 245, 245, 1)',
    borderRadius: dp(32),
    height: dp(26),
    flexDirection: 'row',
    paddingLeft: dp(10),
    paddingRight: dp(10),
    paddingTop: dp(3),
    paddingBottom: dp(3),
    alignItems: 'center',
  },
  body: {},
});

export {ExpandableView};
