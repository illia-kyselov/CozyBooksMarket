import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView, ImageBackground, StyleSheet, View, Pressable, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { formatPriceFromGBP } from '../utils/currency';

import BooksSVG from '../components/svg/BooksSVG';
import TouchBar from '../components/TouchBar';
import BookBlockMain from '../components/BookBlockMain';

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

import AvailableSVG from '../components/svg/AvailableSVG';
import NotAvailableSVG from '../components/svg/NotAvailableSVG';

const BG = require('../assets/images/bg.png');

const COVER_PAPER_GARDEN = require('../assets/images/books/PaperGarden1.png');
const COVER_WHY_SLEEP = require('../assets/images/books/WhyWeSleep2.png');
const COVER_BEAR_PIANO = require('../assets/images/books/BearAndPiano3.png');
const COVER_ARRIVAL = require('../assets/images/books/TheArrival4.png');
const COVER_PRIDE = require('../assets/images/books/Pride5.png');
const COVER_NIGHT_CIRCUS = require('../assets/images/books/NightCircus6.png');
const COVER_EDUCATED = require('../assets/images/books/EducatedBy7.png');
const COVER_SNOW_CHILD = require('../assets/images/books/SnowChild8.png');

const COLORS = { yellow: '#FCFF3C', black: '#0A0A0A', transparent: 'transparent' };
const TOUCHBAR_HEIGHT = 72;

const BADGES_BY_ID = {
    '1': [FictionSVG, AvailableSVG],
    '2': [NonFictionSVG, AvailableSVG],
    '3': [KidsSVG, NotAvailableSVG],
    '4': [NovelsSVG, AvailableSVG],
    '5': [GiftSVG, AvailableSVG],
    '6': [FiresideSVG, NotAvailableSVG],
    '7': [InspirationSVG, AvailableSVG],
    '8': [WinterSVG, NotAvailableSVG],
};

export default function MainScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    const currency = useSelector((s) => s?.settings?.currency ?? 'GBP');

    const allBooks = [
        {
            id: '1',
            cover: COVER_PAPER_GARDEN,
            TopBadge: FictionSVG,
            BottomBadge: NoveltySVG,
            title: 'The Paper Garden',
            basePriceGBP: 11,
        },
        {
            id: '2',
            cover: COVER_WHY_SLEEP,
            TopBadge: NonFictionSVG,
            BottomBadge: BestSellerSVG,
            title: 'Why We Sleep by Matthew Walker',
            basePriceGBP: 9.99,
        },
        {
            id: '3',
            cover: COVER_BEAR_PIANO,
            TopBadge: KidsSVG,
            BottomBadge: null,
            title: 'The Bear and the Piano by David Litchfield',
            basePriceGBP: 12,
        },
        {
            id: '4',
            cover: COVER_ARRIVAL,
            TopBadge: NovelsSVG,
            BottomBadge: SecondHandSVG,
            title: 'The Arrival by Shaun Tan',
            basePriceGBP: 8,
        },
        {
            id: '5',
            cover: COVER_PRIDE,
            TopBadge: GiftSVG,
            BottomBadge: OldClassicSVG,
            title: 'Pride and Prejudice – Illustrated Collector’s Edition',
            basePriceGBP: 15,
        },
    ];

    const forYouBooks = [
        {
            id: '6',
            cover: COVER_NIGHT_CIRCUS,
            TopBadge: FiresideSVG,
            BottomBadge: null,
            title: 'The Night Circus by Erin Morgenstern',
            basePriceGBP: 10,
        },
        {
            id: '7',
            cover: COVER_EDUCATED,
            TopBadge: InspirationSVG,
            BottomBadge: null,
            title: 'Educated by Tara Westover',
            basePriceGBP: 12,
        },
        {
            id: '8',
            cover: COVER_SNOW_CHILD,
            TopBadge: WinterSVG,
            BottomBadge: null,
            title: 'The Snow Child by Eowyn Ivey',
            basePriceGBP: 8,
        },
    ];

    const books = activeTab === 0 ? allBooks : forYouBooks;
    const bottomGap = insets.bottom + TOUCHBAR_HEIGHT + 16;

    const handleBuy = (book) => {
        const badges = BADGES_BY_ID[book.id] || [];
        badges.trackPurchaseIntent({ bookId: book.id, title: book.title });
        navigation.navigate('BookInfo', { book, badges });
    };

    return (
        <ImageBackground source={BG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.content, { paddingBottom: bottomGap }]}
                    keyboardShouldPersistTaps="handled"
                    scrollIndicatorInsets={{ bottom: bottomGap }}
                >
                    <View style={styles.logoWrapper}>
                        <BooksSVG width={120} height={40} />
                    </View>

                    <View style={styles.tabsRow}>
                        <SegmentButton label="All" isActive={activeTab === 0} onPress={() => setActiveTab(0)} />
                        <SegmentButton label="For You" isActive={activeTab === 1} onPress={() => setActiveTab(1)} />
                    </View>

                    <View style={styles.grid}>
                        {books.map((b, idx) => {
                            const priceText = formatPriceFromGBP(b.basePriceGBP, currency);
                            return (
                                <View key={b.id} style={[styles.gridItem, (idx + 1) % 2 === 0 && styles.gridItemLast]}>
                                    <BookBlockMain
                                        cover={b.cover}
                                        TopBadge={b.TopBadge}
                                        BottomBadge={b.BottomBadge}
                                        title={b.title}
                                        price={priceText}
                                        onBuy={() => handleBuy(b)}
                                    />
                                </View>
                            );
                        })}
                    </View>

                    <View style={{ height: bottomGap }} />
                </ScrollView>

                <TouchBar activeIndex={0} />
            </SafeAreaView>
        </ImageBackground>
    );
}

function SegmentButton({ label, isActive, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.segmentBase,
                isActive ? styles.segmentActive : styles.segmentInactive,
                pressed && { opacity: 0.85 },
            ]}
            android_ripple={{ color: '#ffffff22', borderless: true }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
        >
            <Text
                style={[styles.segmentTextBase, isActive ? styles.textActive : styles.textInactive]}
                numberOfLines={1}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    content: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    logoWrapper: { marginTop: 92 },
    tabsRow: {
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 35,
    },
    segmentBase: {
        width: 165,
        height: 47,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    segmentActive: { backgroundColor: COLORS.yellow, borderWidth: 0 },
    segmentInactive: {
        backgroundColor: COLORS.transparent,
        borderWidth: 1,
        borderColor: COLORS.yellow,
    },
    segmentTextBase: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    textActive: { color: COLORS.black },
    textInactive: { color: COLORS.yellow },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 37,
    },
    gridItem: {
        width: 165,
        marginRight: 19,
        marginBottom: 32,
    },
    gridItemLast: {
        marginRight: 0,
    },
});
