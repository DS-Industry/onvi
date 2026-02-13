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
import {WebView} from 'react-native-webview';

const Campaign = () => {
  const route = useRoute<GeneralBottomSheetRouteProp<'Campaign'>>();

  const {isBottomSheetOpen} = useStore.getState();
  const [campaign, setCampaign] = useState<StrapiCampaign | NewCampaign | null>(null);
  const [webViewHeight, setWebViewHeight] = useState(dp(200));

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

  const htmlContent = campaign.mobileDisplay?.description || campaign.description || '';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body {
            font-family: -apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: ${dp(15)}px;
            line-height: ${dp(22)}px;
            color: #000000;
            margin: 0;
            padding: 0;
          }
          p {
            margin: ${dp(4)}px 0;
          }
          strong {
            font-weight: 700;
          }
          u {
            text-decoration: underline;
          }
          s {
            text-decoration: line-through;
          }
          ul, ol {
            margin: ${dp(4)}px 0;
            padding-left: ${dp(20)}px;
          }
          li {
            margin: ${dp(2)}px 0;
          }
          ul[data-type="taskList"] {
            list-style: none;
            padding-left: 0;
          }
          ul[data-type="taskList"] li {
            display: flex;
            align-items: center;
            margin: ${dp(4)}px 0;
          }
          ul[data-type="taskList"] input[type="checkbox"] {
            width: ${dp(18)}px;
            height: ${dp(18)}px;
            margin-right: ${dp(8)}px;
          }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
    </html>
  `;

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
            {htmlContent.startsWith('<') ? (
              <WebView
                originWhitelist={['*']}
                source={{html}}
                style={{
                  height: webViewHeight,
                  width: '100%',
                  backgroundColor: 'transparent',
                }}
                scrollEnabled={false}
                overScrollMode="never"
                bounces={false}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                onMessage={(event) => {
                  setWebViewHeight(Number(event.nativeEvent.data) + dp(16));
                }}
                injectedJavaScript={`
                  window.onload = function() {
                    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
                  };
                  setTimeout(function() {
                    window.ReactNativeWebView.postMessage(document.body.scrollHeight);
                  }, 500);
                `}
              />
            ) : (
              <Text style={{color: '#000', fontSize: dp(15), lineHeight: dp(22)}}>
                {htmlContent}
              </Text>
            )}
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
