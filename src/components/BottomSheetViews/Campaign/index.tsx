import {Image, Linking, StyleSheet, Text, View} from 'react-native';
import {dp} from '../../../utils/dp';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useRoute} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {StrapiCampaign, NewCampaign} from '../../../types/api/app/types.ts';
import Markdown from 'react-native-markdown-display';
import {Button} from '@styled/buttons';

import useStore from '../../../state/store';

import CampaignPlaceholder from './CampaignPlaceholder';

import {GeneralBottomSheetRouteProp} from '../../../types/navigation/BottomSheetNavigation.ts';

const Campaign = () => {
  const route = useRoute<GeneralBottomSheetRouteProp<'Campaign'>>();

  const {isBottomSheetOpen} = useStore.getState();
  const [campaign, setCampaign] = useState<StrapiCampaign | NewCampaign | null>(null);

  useEffect(() => {
    if (route && route.params && route.params.data) {
      setCampaign(route.params.data);
    }
  }, []);

  const isStrapiCampaign = (camp: any): camp is StrapiCampaign => {
    return camp && 'attributes' in camp;
  };

  if (!campaign) {
    return (
      <BottomSheetScrollView
        contentContainerStyle={{...styles.container, backgroundColor: 'white'}}
        nestedScrollEnabled={true}
        scrollEnabled={isBottomSheetOpen}>
        <View style={{display: 'flex', flexDirection: 'column', marginTop: dp(20)}}>
          <CampaignPlaceholder />
        </View>
      </BottomSheetScrollView>
    );
  }

  if (isStrapiCampaign(campaign)) {
    return (
      <BottomSheetScrollView
        contentContainerStyle={{...styles.container, backgroundColor: 'white'}}
        nestedScrollEnabled={true}
        scrollEnabled={isBottomSheetOpen}>
        <View
          style={{display: 'flex', flexDirection: 'column', marginTop: dp(20)}}>
          <>
            <Image
              source={{uri: campaign.attributes.image.data.attributes.url}}
              style={{
                width: '100%',
                flex: 1,
                aspectRatio:
                  campaign.attributes.image.data.attributes.width /
                  campaign.attributes.image.data.attributes.height,
                borderRadius: dp(25),
              }}
            />
            <View
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: dp(16),
              }}>
              <Text
                style={{
                  fontSize: dp(22),
                  fontWeight: '700',
                  color: '#000',
                  marginBottom: dp(16),
                }}>
                {campaign.attributes.title}
              </Text>
              {/* @ts-ignore */}
              <Markdown
                style={{
                  body: {color: '#000', fontSize: dp(15)},
                  link: {color: 'blue'},
                }}>
                {campaign.attributes.content}
              </Markdown>

              <View style={styles.btn}>
                {campaign.attributes.button_title && (
                  <Button
                    label={campaign.attributes.button_title}
                    color={'blue'}
                    width={dp(155)}
                    fontSize={dp(13)}
                    onClick={() => {
                      if (campaign.attributes.url) {
                        Linking.openURL(campaign.attributes.url);
                      }
                    }}
                  />
                )}
              </View>
            </View>
          </>
        </View>
      </BottomSheetScrollView>
    );
  }

  return (
    <BottomSheetScrollView
      contentContainerStyle={{...styles.container, backgroundColor: 'white'}}
      nestedScrollEnabled={true}
      scrollEnabled={isBottomSheetOpen}>
      <View
        style={{display: 'flex', flexDirection: 'column', marginTop: dp(20)}}>
        <>
          <Image
            source={{uri: campaign.mobileDisplay?.imageLink || ''}}
            style={{
              width: '100%',
              flex: 1,
              aspectRatio: 16 / 9,
              borderRadius: dp(25),
            }}
            resizeMode="cover"
          />
          <View
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: dp(16),
            }}>
            <Text
              style={{
                fontSize: dp(22),
                fontWeight: '700',
                color: '#000',
                marginBottom: dp(16),
              }}>
              {campaign.name}
            </Text>
            <Text style={{color: '#000', fontSize: dp(15)}}>
              {campaign.mobileDisplay?.description || campaign.description || ''}
            </Text>
          </View>
        </>
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: dp(38),
    paddingLeft: dp(22),
    paddingRight: dp(22),
    backgroundColor: 'white',
    display: 'flex',
    paddingTop: dp(10),
    paddingBottom: dp(100),
  },
  banner: {
    width: dp(342),
    height: dp(190),
  },
  name: {
    fontSize: dp(16),
    fontWeight: '600',
    color: '#000',
  },
  btn: {
    marginTop: dp(50),
    alignSelf: 'center',
    paddingBottom: dp(50),
  },
});

export {Campaign};
