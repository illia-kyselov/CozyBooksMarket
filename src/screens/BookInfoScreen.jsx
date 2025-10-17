import React, { useState, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    ImageBackground,
    StyleSheet,
    View,
    Pressable,
    Dimensions,
    ScrollView,
    Image,
    Text,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import BooksSVG from '../components/svg/BooksSVG';
import BackArrowSVG from '../components/svg/BackArrowSVG';
import NoveltySVG from '../components/svg/NoveltySVG';
import BuyBigButtonSVG from '../components/svg/BuyBigButtonSVG';
import CheckOutButtonSVG from '../components/svg/CheckOutButtonSVG';
import OrderPlacedButtonSVG from '../components/svg/OrderPlacedButtonSVG';
import AdviceCard from '../components/AdviceCard';

const BG = require('../assets/images/bg.png');

const TITLE_W = 120;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const GAP = 109;
const ARROW_TOUCH = 44;
const ARROW_ICON = 18;
const VERTICAL_NUDGE = 8;

const COVER_W = 205;
const COVER_H = 264;

const COLORS = {
    whiteText: '#F1F1F1',
    whiteMuted: 'rgba(241,241,241,0.78)',
    divider: 'rgba(255,255,255,0.12)',
    pinkPrice: '#FF6B9D',
    yellow: '#6EC1E4',
    black: '#0A0A0A',
    transparent: 'transparent',
};

const BOOK_ANNOTATIONS = {
    'The Paper Garden':
        'In 18th-century England, a 72-year-old woman begins crafting life-size botanical collages from paper, defying her time’s expectations for women and old age. Based on a true story, The Paper Garden blends lyrical prose with historical nuance, celebrating resilience and creativity.',
    'Why We Sleep by Matthew Walker':
        'This fascinating exploration of sleep’s role in our physical and mental health draws on decades of research to answer the most fundamental question: why do we sleep? Full of surprising insights, it’s a must-read for anyone seeking better rest and a sharper mind.',
    'The Bear and the Piano by David Litchfield':
        'A young bear finds a piano in the forest and teaches himself to play, eventually performing in grand concert halls. But he soon misses the forest and his friends. A heartwarming story about following your dreams and remembering where you come from.',
    'The Arrival by Shaun Tan':
        'Told entirely through stunning pencil illustrations, The Arrival follows a man who emigrates to a strange, surreal new land. It’s a moving tale of displacement, hope, and the universal search for belonging — all without a single written word.',
    "Pride and Prejudice – Illustrated Collector’s Edition":
        'Jane Austen’s beloved classic comes to life in a beautifully bound edition with watercolor illustrations, gold leaf details, and a ribbon bookmark. Perfect for long-time fans and new readers alike, this edition turns a timeless story into a tactile treasure.',
    'The Night Circus by Erin Morgenstern':
        'A mysterious circus appears without warning, open only at night. Within its magical black-and-white tents, a fierce competition unfolds between two young illusionists — a contest of enchantments and emotion that will change them forever.',
    'Educated by Tara Westover':
        'Born to survivalists in rural Idaho and kept out of school, Tara Westover didn’t enter a classroom until age 17. This memoir charts her incredible journey from isolation to earning a PhD from Cambridge — a powerful tale of grit and transformation.',
    'The Snow Child by Eowyn Ivey':
        'Alaska, 1920: a childless couple carves a girl from snow, and the next morning she’s gone — or is she? A haunting blend of fairy tale and realism, this novel explores love, loss, and the quiet magic of winter.',
};

const BOOK_ADVICE = {
    'The Paper Garden':
        'Careful — the courage blooming here might take root in your own heart.',
    'Why We Sleep by Matthew Walker':
        'Warning — after this book, you’ll never brag about pulling an all-nighter again!',
    'The Bear and the Piano by David Litchfield':
        'This book is like a lullaby for the soul — don’t be surprised if your eyes sparkle and your throat tightens.',
    'The Arrival by Shaun Tan':
        'No words, yet it shouts — your feelings might get caught between the pages.',
    "Pride and Prejudice – Illustrated Collector’s Edition":
        'Caution: You may find yourself swooning by candlelight with a cup of tea and zero regrets.',
    'The Night Circus by Erin Morgenstern':
        'Best served with a blanket and hot cocoa — the magic might warm more than your toes.',
    'Educated by Tara Westover':
        'Careful — this story might just kickstart your next big leap.',
    'The Snow Child by Eowyn Ivey':
        'Bundle up — this tale might leave snowflakes on your eyelashes and wonder in your chest.',
};

export default function BookInfoScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { book, badges = [] } = route.params || {};
    const price = book?.price;

    const { width: screenW } = Dimensions.get('window');
    const centerX = screenW / 2;
    const titleLeft = centerX - TITLE_W / 2;
    const backLeft = titleLeft - GAP - (ARROW_TOUCH + ARROW_ICON) / 2;

    const annotation = BOOK_ANNOTATIONS[book?.title] || '';
    const adviceText = BOOK_ADVICE[book?.title];

    const [selectedFormat, setSelectedFormat] = useState('Paper');

    const orders = useSelector((s) => s?.orders?.items ?? []);
    const alreadyOrdered = useMemo(
        () => orders.some((o) => o.bookId === (book?.id ?? 'unknown-book')),
        [orders, book?.id]
    );

    const [isCheckout, setIsCheckout] = useState(false);

    const goCheckout = () => {
        navigation.navigate('Checkout', { book, format: selectedFormat });
    };

    const onPrimaryPress = () => {
        if (alreadyOrdered) {
            goCheckout();
        } else if (isCheckout) {
            goCheckout();
        } else {
            setIsCheckout(true);
        }
    };

    return (
        <ImageBackground source={BG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <BooksSVG width={TITLE_W} height={TITLE_H} />
                        <Pressable
                            onPress={() => navigation.goBack()}
                            hitSlop={12}
                            style={[styles.backBtn, { left: Math.max(16, backLeft) }]}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <BackArrowSVG width={ARROW_ICON} height={ARROW_ICON} />
                        </Pressable>
                    </View>

                    <View style={styles.coverWrap}>
                        {book?.cover && (
                            <Image source={book.cover} style={styles.cover} resizeMode="cover" />
                        )}
                        <View style={styles.bottomBadge}>
                            <NoveltySVG />
                        </View>
                    </View>

                    {Array.isArray(badges) && badges.length > 0 && (
                        <View style={styles.badgesWrap}>
                            <View style={styles.badgesRow}>
                                {badges.map((BadgeComp, idx) => (
                                    <View
                                        key={idx}
                                        style={{ marginRight: idx < badges.length - 1 ? 10 : 0 }}
                                    >
                                        {typeof BadgeComp === 'function' ? <BadgeComp /> : BadgeComp}
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {!!book?.title && (
                        <Text style={styles.bookTitle} numberOfLines={3} ellipsizeMode="tail">
                            {book.title}
                        </Text>
                    )}

                    {annotation !== '' && (
                        <View style={styles.annotationSection}>
                            <Text style={styles.annotationTitle}>Annotation</Text>
                            <View style={styles.annotationDivider} />
                            <Text style={styles.annotationText}>{annotation}</Text>
                        </View>
                    )}

                    {!!price && <Text style={styles.price}>{price}</Text>}

                    <Text style={styles.formatLabel}>Format</Text>
                    <View style={styles.formatRow}>
                        <FormatButton
                            label="Paper"
                            isActive={selectedFormat === 'Paper'}
                            onPress={() => setSelectedFormat('Paper')}
                        />
                        <FormatButton
                            label="Electronic"
                            isActive={selectedFormat === 'Electronic'}
                            onPress={() => setSelectedFormat('Electronic')}
                        />
                    </View>

                    <Pressable
                        onPress={onPrimaryPress}
                        style={styles.primaryBtnWrap}
                        accessibilityRole="button"
                        accessibilityLabel={
                            alreadyOrdered
                                ? 'View order'
                                : isCheckout
                                    ? 'Proceed to checkout'
                                    : 'Buy this book'
                        }
                        hitSlop={10}
                    >
                        {alreadyOrdered ? (
                            <OrderPlacedButtonSVG />
                        ) : isCheckout ? (
                            <CheckOutButtonSVG />
                        ) : (
                            <BuyBigButtonSVG />
                        )}
                    </Pressable>

                    {adviceText ? <AdviceCard text={adviceText} /> : null}

                    <View style={{ height: 32 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

function FormatButton({ label, isActive, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                styles.formatBtnBase,
                isActive ? styles.formatBtnActive : styles.formatBtnInactive,
                pressed && { opacity: 0.9 },
            ]}
            android_ripple={{ color: '#ffffff22', borderless: true }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
        >
            <Text
                style={[
                    styles.formatBtnTextBase,
                    isActive ? styles.formatTextActive : styles.formatTextInactive,
                ]}
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
    content: { flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' },
    header: {
        marginTop: HEADER_MARGIN_TOP,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: TITLE_H,
    },
    backBtn: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -(ARROW_TOUCH / 2 - ARROW_ICON / 2) - VERTICAL_NUDGE }],
        width: ARROW_TOUCH,
        height: ARROW_TOUCH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    coverWrap: {
        width: COVER_W,
        height: COVER_H,
        borderRadius: 24,
        overflow: 'hidden',
        marginTop: 50,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    cover: { width: '100%', height: '100%', borderRadius: 24 },
    bottomBadge: { position: 'absolute', right: 0, bottom: 0 },
    badgesWrap: { width: '100%', marginTop: 27, paddingLeft: 20, alignSelf: 'stretch' },
    badgesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' },
    bookTitle: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 27,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: COLORS.whiteText,
    },
    annotationSection: { width: '100%', paddingLeft: 20, paddingRight: 20, marginTop: 27 },
    annotationTitle: {
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.whiteText,
    },
    annotationDivider: { height: 1, backgroundColor: COLORS.divider, marginTop: 8, marginBottom: 12 },
    annotationText: {
        fontFamily: 'SFPro-Regular',
        fontSize: 16,
        letterSpacing: -0.32,
        color: COLORS.whiteMuted,
    },
    price: {
        width: '100%',
        paddingLeft: 20,
        marginTop: 27,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.pinkPrice,
    },
    formatLabel: {
        width: '100%',
        paddingLeft: 20,
        marginTop: 27,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.whiteText,
    },
    formatRow: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 14,
    },
    formatBtnBase: {
        width: 165,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 2,
    },
    formatBtnActive: { backgroundColor: COLORS.yellow, borderWidth: 0 },
    formatBtnInactive: { backgroundColor: COLORS.transparent, borderWidth: 1.5, borderColor: COLORS.yellow },
    formatBtnTextBase: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    formatTextActive: { color: COLORS.black },
    formatTextInactive: { color: COLORS.yellow },
    primaryBtnWrap: { marginTop: 44, alignSelf: 'center' },
});
