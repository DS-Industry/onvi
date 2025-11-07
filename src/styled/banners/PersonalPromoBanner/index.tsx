import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import {useTranslation} from 'react-i18next';

// Define the component props
interface PersonalPromoBannerProps {
  title: string;
  date: Date;
  disable: boolean;
  onPress?: (event: GestureResponderEvent) => void;
}

export const PersonalPromoBanner: React.FC<PersonalPromoBannerProps> = ({
  title,
  date,
  onPress,
  disable = false,
}) => {
  const {t, i18n} = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {date.toLocaleDateString(i18n.language, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
        </View>

        <Image
          source={require('../../../assets/icons/megaphone-icon.png')} // Replace with actual icon URL
          style={styles.image}
        />
      </View>

      {!disable && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{t('app.promos.use')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: dp(12),
    borderRadius: dp(10),
    backgroundColor: '#f2f2f2',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: dp(20),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: dp(8),
    maxWidth: dp(200),
  },
  dateContainer: {
    backgroundColor: '#BFFA00',
    borderRadius: dp(20),
    paddingVertical: dp(4),
    paddingHorizontal: dp(8),
    alignSelf: 'flex-start',
    marginBottom: dp(8),
  },
  dateText: {
    color: '#000',
    fontSize: dp(10),
  },
  image: {
    width: dp(90),
    height: dp(90),
    marginRight: dp(8),
    marginBottom: dp(5),
  },
  button: {
    backgroundColor: 'blue',
    borderRadius: dp(20),
    height: dp(40),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: dp(10),
  },
  buttonText: {
    color: '#fff',
    fontSize: dp(16),
    fontWeight: 'bold',
  },
});
