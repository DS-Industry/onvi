import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Image, Text, Linking} from 'react-native';

import {dp} from '../../../utils/dp';

import {useRoute, useNavigation} from '@react-navigation/native';

import {BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {horizontalScale, moderateScale} from '../../../utils/metrics';

import Markdown from 'react-native-markdown-display';
import {Button} from '@styled/buttons';

import useStore from '../../../state/store';

import PostPlaceholder from './PostPlaceholder';
import {
  GeneralBottomSheetNavigationProp,
  GeneralBottomSheetRouteProp,
} from '../../../types/navigation/BottomSheetNavigation.ts';
import {NewsPost} from '../../../types/api/app/types.ts';
import {useTranslation} from 'react-i18next';

const Post = () => {
  const {t} = useTranslation();

  const route = useRoute<GeneralBottomSheetRouteProp<'Post'>>();

  const [post, setPost] = useState<NewsPost | null>(null);
  const navigation = useNavigation<GeneralBottomSheetNavigationProp<'Post'>>();

  const {isBottomSheetOpen: isOpened} = useStore.getState();

  useEffect(() => {
    if (route && route.params && route.params.data && route.params.data) {
      setPost(route.params.data);
    }
  }, []);

  return (
    <BottomSheetScrollView
      contentContainerStyle={{...styles.container, backgroundColor: 'white'}}
      nestedScrollEnabled={true}
      scrollEnabled={isOpened}>
      <View
        style={{display: 'flex', flexDirection: 'column', paddingTop: dp(20)}}>
        {!post ? (
          <PostPlaceholder />
        ) : (
          <>
            <Image
              source={{uri: post.attributes.image.data.attributes.url}}
              style={{
                width: '100%',
                flex: 1,
                aspectRatio:
                  post.attributes.image.data.attributes.width /
                  post.attributes.image.data.attributes.height,
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
                style={{fontSize: dp(22), fontWeight: '700', color: '#000'}}>
                {post.attributes.title}
              </Text>
              {/* @ts-ignore */}
              <Markdown
                style={{
                  body: {color: '#000', fontSize: dp(15)},
                  link: {color: 'blue'},
                }}>
                {post.attributes.content}
              </Markdown>
              <View
                style={{
                  flex: 1,
                  paddingTop: dp(20),
                  paddingBottom: dp(100),
                  alignItems: 'center',
                }}>
                {post.attributes.button_title ? (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'space-evenly',
                    }}>
                    <Button
                      label={post.attributes.button_title}
                      width={125}
                      height={dp(35)}
                      onClick={() => {
                        if (post.attributes.url) {
                          Linking.openURL(post.attributes.url);
                        } else if (post.attributes.screen_redirect) {
                          //@ts-ignore
                          (navigation as any).navigate(
                            post.attributes.screen_redirect,
                            route.params,
                          );
                        }
                      }}
                      color="blue"
                      fontSize={dp(12)}
                    />
                    <Button
                      label={t('common.buttons.close')}
                      color={'lightGrey'}
                      width={125}
                      height={35}
                      fontSize={dp(12)}
                      onClick={() => {
                        navigation.goBack();
                      }}
                    />
                  </View>
                ) : (
                  <Button
                    label={t('common.buttons.close')}
                    color={'lightGrey'}
                    width={150}
                    height={50}
                    onClick={() => {
                      navigation.goBack();
                    }}
                  />
                )}
              </View>
            </View>
          </>
        )}
      </View>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    borderRadius: moderateScale(38),
    paddingLeft: horizontalScale(22),
    paddingRight: horizontalScale(22),
    backgroundColor: 'white',
    display: 'flex',
    paddingTop: dp(10),
    paddingBottom: dp(100),
  },
});

export {Post};
