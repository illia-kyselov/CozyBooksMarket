import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, ScrollView, Text, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import MyOrdersSVG from '../components/svg/MyOrdersSVG';
import TouchBar from '../components/TouchBar';
import OrderCard from '../components/OrderCard';
import AdviceCard from '../components/AdviceCard';
import MyBooksButtonSVG from '../components/svg/MyBooksButtonSVG';

import { addToShelf, removeFromShelf } from '../store/shelfSlice';

const BG = require('../assets/images/bg.png');

const COVER_PAPER_GARDEN = require('../assets/images/books/PaperGarden1.png');
const COVER_WHY_SLEEP = require('../assets/images/books/WhyWeSleep2.png');
const COVER_BEAR_PIANO = require('../assets/images/books/BearAndPiano3.png');
const COVER_ARRIVAL = require('../assets/images/books/TheArrival4.png');
const COVER_PRIDE = require('../assets/images/books/Pride5.png');
const COVER_NIGHT_CIRCUS = require('../assets/images/books/NightCircus6.png');
const COVER_EDUCATED = require('../assets/images/books/EducatedBy7.png');
const COVER_SNOW_CHILD = require('../assets/images/books/SnowChild8.png');

const COVERS_BY_ID = {
  '1': COVER_PAPER_GARDEN,
  '2': COVER_WHY_SLEEP,
  '3': COVER_BEAR_PIANO,
  '4': COVER_ARRIVAL,
  '5': COVER_PRIDE,
  '6': COVER_NIGHT_CIRCUS,
  '7': COVER_EDUCATED,
  '8': COVER_SNOW_CHILD,
};

import FictionSVG from '../components/svg/FictionSVG';
import NoveltySVG from '../components/svg/NoveltySVG';
import NonFictionSVG from '../components/svg/NonFictionSVG';
import BestSellerSVG from '../components/svg/BestSellerSVG';
import KidsSVG from '../components/svg/KidsSVG';
import NovelsSVG from '../components/svg/NovelsSVG';
import SecondHandSVG from '../components/svg/SecondHandSVG';
import GiftSVG from '../components/svg/GiftSVG';
import OldClassicSVG from '../components/svg/OldClassicSVG';
import FiresideSVG from '../components/svg/FiresideSVG';
import InspirationSVG from '../components/svg/InspirationSVG';
import WinterSVG from '../components/svg/WinterSVG';

const TOP_BADGE_BY_ID = {
  '1': FictionSVG,
  '2': NonFictionSVG,
  '3': KidsSVG,
  '4': NovelsSVG,
  '5': GiftSVG,
  '6': FiresideSVG,
  '7': InspirationSVG,
  '8': WinterSVG,
};

const BOTTOM_BADGE_BY_ID = {
  '1': NoveltySVG,
  '2': BestSellerSVG,
  '3': null,
  '4': SecondHandSVG,
  '5': OldClassicSVG,
  '6': null,
  '7': null,
  '8': null,
};

const TITLE_W = 160;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const TOUCHBAR_HEIGHT = 72;
const EXTRA_BOTTOM_SPACE = 48;

const TITLE_TO_ID = {
  'The Paper Garden': '1',
  'Why We Sleep by Matthew Walker': '2',
  'The Bear and the Piano by David Litchfield': '3',
  'The Arrival by Shaun Tan': '4',
  'Pride and Prejudice – Illustrated Collector’s Edition': '5',
  'The Night Circus by Erin Morgenstern': '6',
  'Educated by Tara Westover': '7',
  'The Snow Child by Eowyn Ivey': '8',
};

const formatOrderSubtitle = (o) => {
  const date = (o?.dateLabel || o?.date || '').trim();
  const addr = (o?.address || '').trim();
  const type = String(o?.deliveryType || o?.delivery || '').toLowerCase();

  if (type.includes('courier')) {
    const prefix = date ? `${date}, ` : '';
    const place = addr || 'Your Home Address';
    return `${prefix}Courier Delivery to ${place}`;
  }
  if (type.includes('pick')) {
    const prefix = date ? `${date}, ` : '';
    const place = addr || 'Pick-up location';
    return `${prefix}Pick-up at ${place}`;
  }
  if (date && addr) return `${date}, ${addr}`;
  return date || addr || '—';
};

const getBookMeta = (o) => {
  const id = String(o.bookId ?? TITLE_TO_ID[o.title] ?? o.id ?? o.title);
  const cover = COVERS_BY_ID[id] ?? COVER_WHY_SLEEP;

  const TopBadge = TOP_BADGE_BY_ID[id] ?? null;
  const BottomBadge = BOTTOM_BADGE_BY_ID[id] ?? null;

  return { id, title: o.title, cover, TopBadge, BottomBadge };
};

export default function MyOrdersScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const orders = useSelector((s) => s?.orders?.items ?? []);
  const shelf = useSelector((s) => s?.shelf?.items ?? []);
  const dispatch = useDispatch();

  const bottomGap = insets.bottom + TOUCHBAR_HEIGHT + EXTRA_BOTTOM_SPACE;

  return (
    <ImageBackground source={BG} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[styles.content, { paddingBottom: bottomGap }]}
          keyboardShouldPersistTaps="handled"
          scrollIndicatorInsets={{ bottom: bottomGap }}
          contentInset={{ bottom: bottomGap }}
        >
          <View style={styles.header}>
            <MyOrdersSVG width={TITLE_W} height={TITLE_H} />
          </View>

          {orders.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          ) : (
            <View style={styles.listWrap}>
              {orders
                .slice()
                .reverse()
                .map((o, idx) => {
                  const meta = getBookMeta(o);
                  const isOnShelf = shelf.some((b) => String(b.id) === String(meta.id));

                  return (
                    <OrderCard
                      key={`${o.id ?? idx}`}
                      coverSource={meta.cover}
                      title={o.title}
                      subtitle={formatOrderSubtitle(o)}
                      isOnShelf={isOnShelf}
                      onAddToShelf={() => {
                        if (!isOnShelf) dispatch(addToShelf(meta));
                      }}
                      onGift={() => {
                        if (isOnShelf) dispatch(removeFromShelf(meta.id));
                      }}
                    />
                  );
                })}
            </View>
          )}

          <AdviceCard text={'Your book “The Arrival” is waiting on the shelf. Make it to Friday!'} />

          <View style={styles.myBooksBtnWrapper}>
            <Pressable
              onPress={() => navigation.navigate('MyBooks')}
              accessibilityRole="button"
              accessibilityLabel="Go to My Books"
            >
              <MyBooksButtonSVG />
            </Pressable>
          </View>

          <View style={{ height: EXTRA_BOTTOM_SPACE }} />
        </ScrollView>

        <TouchBar activeIndex={1} />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%' },
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' },
  header: {
    marginTop: HEADER_MARGIN_TOP,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: TITLE_H,
  },
  listWrap: { width: '100%', paddingHorizontal: 20, marginTop: 28, gap: 12 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  emptyText: { fontFamily: 'SFPro-Regular', fontSize: 20, color: '#F1F1F1', textAlign: 'center' },
  myBooksBtnWrapper: { marginTop: 9, alignItems: 'center', justifyContent: 'center' },
});
