import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Dimensions, Platform} from 'react-native';

import {useTranslation} from 'react-i18next';
import useStore from '@state/store.ts';
import {BLACK} from '@utils/colors.ts';
import {dp} from '@utils/dp.ts';
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {useFocusEffect} from '@react-navigation/native';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import useSWR from 'swr';
import {getCampaignList} from '@services/api/campaign';
import CampaignPlaceholder from './CampaignPlaceholder';
import {useNavStore} from '@state/useNavStore/index.ts';
import {Campaign, CarWashLocation} from '@app-types/api/app/types.ts';
import {getStoryView} from '@services/api/story-view';
import {StoryViewPlaceholder} from '@components/StoryView/StoryViewPlaceholder.tsx';
import {transformContentDataToUserStories} from '@shared/mappers/StoryViewMapper.ts';
import {StoryView} from '@components/StoryView';
import {useCombinedTheme} from '@hooks/useCombinedTheme';
import {YStack, Text, Card, Image, XStack, Button} from 'tamagui';
import PressableCard from '@components/PressableCard/PressableCard.tsx';
import {useSharedValue} from 'react-native-reanimated';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import CarwashesPlaceholder from '../CarwashesPlaceholder/index.tsx';
import {NewsList} from './NewsList/NewsList.tsx';

const Main = () => {
  const {t} = useTranslation();
  const {
    bottomSheetRef,
    bottomSheetSnapPoints,
    setSelectedPos,
    setBusiness,
    latestCarwashes,
    posList,
    loadLatestCarwashes,
    pinnedCarwashes,
  } = useStore.getState();

  const {latestCarwashesIsLoading} = useStore();

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  const {setIsMainScreen} = useNavStore.getState();

  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const {backgroundColor, currentThemeName} = useCombinedTheme();

  const [latestCarwashesData, setLatestCarwashesData] = useState<
    CarWashLocation[]
  >([]);

  const {isLoading: campaignLoading, data: campaignData} = useSWR(
    ['getCampaignList'],
    () => getCampaignList('*'),
  );

  const {
    isLoading: storyLoading,
    data: storyData,
    error: storyError,
  } = useSWR(['getStoryViw'], () => getStoryView('*'));

  const paginationData = [...new Array(campaignData?.length).keys()];

  useFocusEffect(
    useCallback(() => {
      setIsMainScreen(true);
      setSelectedPos(null);
      setBusiness(null);
      loadLatestCarwashes();

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: false});
      }

      return () => {
        setIsMainScreen(false);
      };
    }, []),
  );

  useEffect(() => {
    if (latestCarwashes.length > 0) {
      const carwashMap = new Map();

      posList.forEach(carwash => {
        const id = Number(carwash?.carwashes[0]?.id) || undefined;
        carwashMap.set(id, carwash);
      });

      const result: CarWashLocation[] = [];

      if (pinnedCarwashes && pinnedCarwashes.length > 0) {
        pinnedCarwashes.forEach(id => {
          const carwash = carwashMap.get(id);
          if (carwash) {
            result.push(carwash);
            carwashMap.delete(id);
          }
        });
      }

      latestCarwashes.forEach(id => {
        const carwash = carwashMap.get(id);
        if (carwash) {
          result.push(carwash);
        }
      });

      setLatestCarwashesData(result.slice(0, 3));
    }
  }, [latestCarwashes, pinnedCarwashes, posList]);

  const handleCampaignItemPress = (data: Campaign) => {
    navigateBottomSheet('Campaign', {
      data,
    });
  };

  const renderCampaignItem = useCallback(
    ({item}: {item: Campaign}) => (
      <PressableCard
        unstyled
        onPress={() => handleCampaignItemPress(item)}
        style={styles.campaigns}>
        <Image
          source={{uri: item.attributes.image.data.attributes.url}}
          style={{
            width: dp(340),
            height: dp(190),
            objectFit: 'contain',
          }}
        />
      </PressableCard>
    ),
    [],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: Platform.OS === 'ios' ? dp(0) : dp(40),
      }}
      ref={scrollViewRef}
      nestedScrollEnabled={false}
      scrollEnabled={true}>
      <YStack style={{minHeight: '100%'}}>
        <Card
          theme={currentThemeName}
          backgroundColor={backgroundColor}
          padding={dp(16)}
          borderRadius={dp(22)}>
          <XStack verticalAlign="center" gap={dp(16)}>
            <XStack
              flex={1}
              backgroundColor="#D8D9DD"
              borderRadius={dp(12)}
              paddingHorizontal={dp(16)}
              height={dp(45)}
              alignItems="center"
              onPress={() => {
                navigateBottomSheet('Search', {});
                bottomSheetRef?.current?.snapToPosition(
                  bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                );
              }}>
              <Image
                source={require('../../../assets/icons/Search.png')}
                width={dp(26)}
                height={dp(26)}
              />
              <Text
                color="#000"
                fontSize={dp(16)}
                fontWeight="600"
                opacity={0.15}
                marginLeft={dp(7)}
                flex={1}>
                {t('app.main.search')}
              </Text>
              <Button
                unstyled
                onPress={() => {
                  navigateBottomSheet('Filters', {});
                  bottomSheetRef?.current?.snapToPosition(
                    bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                  );
                }}>
                <Image
                  source={require('../../../assets/icons/Settings-adjust.png')}
                  width={dp(26)}
                  height={dp(26)}
                />
              </Button>
            </XStack>
          </XStack>
          <YStack>
            <Text
              color={BLACK}
              fontSize={dp(24)}
              fontWeight="600"
              marginTop={dp(16)}>
              {t('app.latestCarwashes.latest')}
            </Text>
            {latestCarwashesIsLoading ? (
              <>
                <XStack marginTop={dp(12)} />
                <CarwashesPlaceholder />
              </>
            ) : (
              <>
                <YStack marginTop={dp(12)} gap={dp(8)}>
                  {latestCarwashesData.map(item => (
                    <CarWashCard
                      carWash={item}
                      showDistance={false}
                      longPressPinAction={true}
                      enablePinIcon={true}
                    />
                  ))}
                </YStack>
              </>
            )}
          </YStack>
        </Card>
        <Card
          backgroundColor={backgroundColor}
          padding={dp(16)}
          borderRadius={38}
          flex={1}
          marginTop={dp(8)}>
          {storyLoading || storyError ? (
            <StoryViewPlaceholder />
          ) : (
            <>
              {storyData && (
                <StoryView
                  stories={transformContentDataToUserStories(storyData)}
                />
              )}
            </>
          )}
          <XStack justifyContent={'space-between'}>
            <Text
              color={BLACK}
              fontSize={dp(24)}
              fontWeight="600"
              marginTop={dp(12)}>
              {t('app.main.PromotionsForYou')}
            </Text>
          </XStack>
          <YStack flex={1} marginTop={dp(12)}>
            {campaignLoading ? (
              <CampaignPlaceholder />
            ) : (
              <YStack flex={1}>
                {campaignData && (
                  <>
                    <Carousel
                      ref={ref}
                      loop
                      vertical={false}
                      width={dp(350)}
                      height={dp(200)}
                      enabled
                      autoPlay={true}
                      autoPlayInterval={3000}
                      data={campaignData}
                      pagingEnabled={true}
                      renderItem={renderCampaignItem}
                      onProgressChange={progress}
                    />
                    <Pagination.Basic
                      progress={progress}
                      data={paginationData}
                      dotStyle={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 50,
                      }}
                      activeDotStyle={{
                        backgroundColor: 'rgba(11, 104, 225, 1)',
                      }}
                      containerStyle={{gap: 5}}
                      onPress={onPressPagination}
                    />
                  </>
                )}
              </YStack>
            )}
          </YStack>
          <YStack>
            <Text
              color={BLACK}
              fontSize={dp(24)}
              fontWeight="600"
              marginTop={dp(12)}>
              {t('app.main.freshNews')}
            </Text>
            <NewsList />
          </YStack>
        </Card>
      </YStack>
    </BottomSheetScrollView>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  campaigns: {
    width: width,
    justifyContent: 'center',
  },
});

export {Main};
