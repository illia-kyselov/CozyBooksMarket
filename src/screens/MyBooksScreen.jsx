import React, { useMemo, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, ScrollView, Pressable, Text, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import { removeFromShelf } from '../store/shelfSlice';

import MyBooksSVG from '../components/svg/MyBooksSVG';
import TouchBar from '../components/TouchBar';
import DeleteButtonSVG from '../components/svg/DeleteButtonSVG';
import AdviceCard from '../components/AdviceCard';
import AddNoteButtonSVG from '../components/svg/AddNoteButtonSVG';
import ForwardArrowSVG from '../components/svg/ForwardArrowSVG';

import Emoji1SVG from '../components/svg/Emoji/Emoji1SVG';
import Emoji2SVG from '../components/svg/Emoji/Emoji2SVG';
import Emoji3SVG from '../components/svg/Emoji/Emoji3SVG';
import Emoji4SVG from '../components/svg/Emoji/Emoji4SVG';
import Emoji5SVG from '../components/svg/Emoji/Emoji5SVG';

const BG = require('../assets/images/bg.png');

const COLORS = {
    yellow: '#6EC1E4',
    black: '#0A0A0A',
    transparent: 'transparent',
    whiteText: '#F1F1F1',
};
const TITLE_W = 160;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const TOUCHBAR_HEIGHT = 72;

export default function MyBooksScreen() {
    const [activeTab, setActiveTab] = useState(0);
    const insets = useSafeAreaInsets();
    const bottomGap = insets.bottom + TOUCHBAR_HEIGHT + 16;

    const shelfBooks = useSelector((state) => state.shelf.items);
    const readBooks = useSelector((state) => state.readBooks?.items || []);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const grouped = useMemo(() => {
        const arr = [...readBooks].map((b) => {
            const ts = b?.createdAt ? new Date(b.createdAt) : new Date();
            return { ...b, _createdAt: ts.getTime() };
        });
        arr.sort((a, b) => b._createdAt - a._createdAt);

        const map = new Map();
        for (const it of arr) {
            const d = new Date(it._createdAt);
            const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            if (!map.has(ym)) map.set(ym, { label, items: [] });
            map.get(ym).items.push(it);
        }
        return Array.from(map.values());
    }, [readBooks]);

    return (
        <ImageBackground source={BG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={[styles.content, { paddingBottom: bottomGap }]}
                    keyboardShouldPersistTaps="handled"
                    scrollIndicatorInsets={{ bottom: bottomGap }}
                >
                    <View style={styles.header}>
                        <MyBooksSVG width={TITLE_W} height={TITLE_H} />
                    </View>

                    <View style={styles.tabsRow}>
                        <SegmentButton label="Have Read" isActive={activeTab === 0} onPress={() => setActiveTab(0)} />
                        <SegmentButton label="My Shelf" isActive={activeTab === 1} onPress={() => setActiveTab(1)} />
                    </View>

                    {activeTab === 0 ? (
                        <>
                            {grouped.length === 0 ? (
                                <View style={styles.stubBox}>
                                    <Text style={styles.stubText}>No books in “Have Read” yet</Text>
                                </View>
                            ) : (
                                <View>
                                    {grouped.map((g, idx) => (
                                        <View key={g.label} style={{ marginTop: idx === 0 ? 36 : 24 }}>
                                            <Text style={styles.monthHeader}>{g.label}</Text>
                                            <View style={{ height: 16 }} />
                                            {g.items.map((b) => {
                                                const rating = Math.max(0, Math.min(5, Number(b.rating || 0)));
                                                const r = Math.max(1, Math.min(5, Number(b.rating || 1)));
                                                const EmojiMap = { 1: Emoji1SVG, 2: Emoji2SVG, 3: Emoji3SVG, 4: Emoji4SVG, 5: Emoji5SVG };
                                                const EmojiIcon = EmojiMap[r];

                                                return (
                                                    <Pressable
                                                        key={b.id}
                                                        style={styles.readCard}
                                                        onPress={() => navigation.navigate('AddBook', { bookId: b.id })}
                                                        android_ripple={{ color: '#00000014', borderless: false }}
                                                        accessibilityRole="button"
                                                        accessibilityLabel={`Open ${b.title || 'book'}`}
                                                    >
                                                        <View style={styles.readCoverBox}>
                                                            {b.coverUri ? (
                                                                <Image source={{ uri: b.coverUri }} style={styles.readCoverImg} resizeMode="cover" />
                                                            ) : (
                                                                <View style={[styles.readCoverImg, { backgroundColor: '#DADADA' }]} />
                                                            )}
                                                        </View>

                                                        <View style={styles.readRightCol}>
                                                            <Text numberOfLines={2} style={styles.readTitle}>
                                                                {b.title || 'Untitled'}
                                                            </Text>

                                                            <View style={styles.readMetaRow}>
                                                                <Text style={styles.readRatingNum}>{rating}</Text>
                                                                <View style={styles.readEmojiWrapper}>
                                                                    <EmojiIcon />
                                                                </View>
                                                            </View>
                                                        </View>

                                                        <View style={styles.readArrowWrap}>
                                                            <ForwardArrowSVG />
                                                        </View>
                                                    </Pressable>
                                                );
                                            })}
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={{ flexGrow: 1 }} />

                            <View style={styles.bottomBlock}>
                                <AdviceCard text={"You're reading more than you did last month! Don't stop."} />
                                <Pressable
                                    style={styles.addNoteWrapper}
                                    onPress={() => navigation.navigate('AddBook')}
                                    accessibilityRole="button"
                                    accessibilityLabel="Add Note"
                                >
                                    <AddNoteButtonSVG />
                                </Pressable>
                            </View>
                        </>
                    ) : (
                        <>
                            <View style={styles.grid}>
                                {shelfBooks.map((b, idx) => (
                                    <View key={b.id ?? idx} style={[styles.gridItem, (idx + 1) % 2 === 0 && { marginRight: 0 }]}>
                                        <ShelfBookCard
                                            id={b.id}
                                            cover={b.cover}
                                            TopBadge={b.TopBadge}
                                            BottomBadge={b.BottomBadge}
                                            title={b.title}
                                            onDelete={(id) => dispatch(removeFromShelf(id))}
                                        />
                                    </View>
                                ))}
                            </View>

                            {shelfBooks.length === 0 && (
                                <View style={styles.stubBox}>
                                    <Text style={styles.stubText}>Your shelf is empty</Text>
                                    <Text style={[styles.stubText, { marginTop: 6, opacity: 0.7 }]}>
                                        Add a book from “My Orders” → “Add To Shelf”
                                    </Text>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>

                <TouchBar activeIndex={2} />
            </SafeAreaView>
        </ImageBackground>
    );
}

function SegmentButton({ label, isActive, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.segmentBase, isActive ? styles.segmentActive : styles.segmentInactive]}
            android_ripple={{ color: '#ffffff22', borderless: true }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
        >
            <Text style={[styles.segmentTextBase, isActive ? styles.textActive : styles.textInactive]} numberOfLines={1}>
                {label}
            </Text>
        </Pressable>
    );
}

function ShelfBookCard({ id, cover, TopBadge, BottomBadge, title, onDelete }) {
    return (
        <View style={shelfStyles.bookWrapper}>
            <View style={shelfStyles.bookIconOuter}>
                {TopBadge && (
                    <View style={shelfStyles.bookBadgeTop}>
                        <TopBadge />
                    </View>
                )}
                {BottomBadge && (
                    <View style={shelfStyles.bookBadgeBottom}>
                        <BottomBadge />
                    </View>
                )}
                <Image source={cover} style={shelfStyles.bookIconImage} resizeMode="cover" />
            </View>

            <Text style={shelfStyles.bookTitle} numberOfLines={2} ellipsizeMode="tail">
                {title}
            </Text>

            <Pressable
                onPress={() => onDelete?.(id)}
                style={shelfStyles.deleteBtn}
                accessibilityRole="button"
                accessibilityLabel="Delete from shelf"
            >
                <DeleteButtonSVG />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    content: {
        flexGrow: 1,
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    header: {
        marginTop: HEADER_MARGIN_TOP,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: TITLE_H,
    },
    tabsRow: {
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    segmentBase: {
        width: 165,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    segmentActive: { backgroundColor: COLORS.yellow },
    segmentInactive: { backgroundColor: COLORS.transparent, borderWidth: 1.5, borderColor: COLORS.yellow },
    segmentTextBase: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    textActive: { color: COLORS.black },
    textInactive: { color: COLORS.yellow },
    monthHeader: {
        marginLeft: 20,
        color: COLORS.whiteText,
        fontFamily: 'SFPro-Semibold',
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: -0.32,
    },
    readCard: {
        width: 351,
        height: 98,
        alignSelf: 'center',
        backgroundColor: '#F1F1F1',
        borderRadius: 28,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.18,
        shadowRadius: 5,
        elevation: 4,
    },
    readCoverBox: {
        width: 75,
        height: 78,
        borderRadius: 18,
        overflow: 'hidden',
        backgroundColor: '#DADADA',
        marginRight: 20,
    },
    readCoverImg: { width: '100%', height: '100%' },
    readRightCol: { flex: 1, justifyContent: 'center' },
    readTitle: {
        color: '#005AA2',
        fontFamily: 'SFPro-Semibold',
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: -0.32,
    },
    readMetaRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    readRatingNum: {
        color: '#0A0A0A',
        fontFamily: 'SFPro-Semibold',
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: -0.32,
        marginRight: 8,
    },
    readEmojiWrapper: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    readArrowWrap: {
        marginLeft: 16,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        marginTop: 37,
        width: '100%',
    },
    gridItem: {
        width: 165,
        marginRight: 19,
        marginBottom: 32,
    },
    stubBox: { marginTop: 20, alignItems: 'center', paddingHorizontal: 20 },
    stubText: { color: COLORS.whiteText, fontFamily: 'SFPro-Regular', fontSize: 16 },
    bottomBlock: {
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    addNoteWrapper: {
        marginTop: 32,
        marginBottom: 35,
        alignItems: 'center',
    },
});

const shelfStyles = StyleSheet.create({
    bookWrapper: { width: 165, alignItems: 'flex-start' },
    bookIconOuter: {
        width: 165,
        height: 236,
        borderRadius: 24,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    bookIconImage: { width: '100%', height: '100%' },
    bookBadgeTop: { position: 'absolute', top: 6, left: 10, zIndex: 2 },
    bookBadgeBottom: { position: 'absolute', bottom: -2, right: 0, zIndex: 2 },
    bookTitle: {
        marginTop: 8,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: COLORS.whiteText,
    },
    deleteBtn: { marginTop: 8, alignItems: 'center' },
});
