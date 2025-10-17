import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    ImageBackground,
    View,
    ScrollView,
    Pressable,
    Image,
    TextInput,
    Text,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { addReadBook, updateReadBook } from '../store/readBooksSlice';

import MyBooksSVG from '../components/svg/MyBooksSVG';
import CategorySVG from '../components/svg/CategorySVG';
import StarSVG from '../components/svg/StarSVG';
import StarActiveSVG from '../components/svg/StarActiveSVG';

import Mark1SVG from '../components/svg/Marks/Mark1SVG';
import Mark2SVG from '../components/svg/Marks/Mark2SVG';
import Mark3SVG from '../components/svg/Marks/Mark3SVG';
import Mark4SVG from '../components/svg/Marks/Mark4SVG';
import Mark1ActiveSVG from '../components/svg/Marks/Mark1ActiveSVG';
import Mark2ActiveSVG from '../components/svg/Marks/Mark2ActiveSVG';
import Mark3ActiveSVG from '../components/svg/Marks/Mark3ActiveSVG';
import Mark4ActiveSVG from '../components/svg/Marks/Mark4ActiveSVG';

import SaveButtonSVG from '../components/svg/SaveButtonSVG';

const BG = require('../assets/images/bg.png');

const TITLE_W = 160;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;

export default function AddBookScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();

    const bookId = route.params?.bookId;
    const bookFromStore = useSelector((s) =>
        s.readBooks?.items?.find((x) => x.id === bookId)
    );
    const isEdit = Boolean(bookId);

    const [coverUri, setCoverUri] = useState(null);
    const [bookName, setBookName] = useState('');
    const [nameHeight, setNameHeight] = useState(0);
    const [rating, setRating] = useState(0);
    const [mark, setMark] = useState(0);

    const [likedStyle, setLikedStyle] = useState(false);
    const [tooLong, setTooLong] = useState(false);
    const [willReadAgain, setWillReadAgain] = useState(false);

    React.useEffect(() => {
        if (!bookFromStore) return;
        setCoverUri(bookFromStore.coverUri || null);
        setBookName(bookFromStore.title || '');
        setRating(Number(bookFromStore.rating || 0));
        setMark(Number(bookFromStore.mark || 0));
        setLikedStyle(!!bookFromStore.likedStyle);
        setTooLong(!!bookFromStore.tooLong);
        setWillReadAgain(!!bookFromStore.willReadAgain);
    }, [bookFromStore]);

    const pickCover = () => {
        launchImageLibrary(
            { mediaType: 'photo', selectionLimit: 1, quality: 1 },
            (res) => {
                const uri = res?.assets?.[0]?.uri ?? null;
                if (uri) setCoverUri(uri);
            }
        );
    };

    const LINE_HEIGHT = 21;
    const MAX_LINES = 3;
    const maxHeight = LINE_HEIGHT * MAX_LINES;

    const onStarPress = (index) => {
        const value = index + 1;
        if (value <= rating) setRating(0);
        else setRating(value);
    };

    const marks = [
        { idle: Mark1SVG, active: Mark1ActiveSVG, label: 'Very bad' },
        { idle: Mark2SVG, active: Mark2ActiveSVG, label: 'Bad' },
        { idle: Mark3SVG, active: Mark3ActiveSVG, label: 'Good' },
        { idle: Mark4SVG, active: Mark4ActiveSVG, label: 'Great' },
    ];

    const onMarkPress = (value) => setMark((prev) => (prev === value ? 0 : value));

    const canSave = Boolean(bookName.trim()) && Boolean(coverUri) && rating >= 1;

    const onSave = () => {
        if (!canSave) return;

        if (isEdit) {
            dispatch(
                updateReadBook({
                    id: bookId,
                    coverUri,
                    title: bookName,
                    rating,
                    mark,
                    likedStyle,
                    tooLong,
                    willReadAgain,
                })
            );
        } else {
            dispatch(
                addReadBook({
                    coverUri,
                    title: bookName,
                    rating,
                    mark,
                    likedStyle,
                    tooLong,
                    willReadAgain,
                })
            );
        }
        navigation.goBack();
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
                        <MyBooksSVG width={TITLE_W} height={TITLE_H} />
                    </View>

                    <Pressable style={styles.coverBox} onPress={pickCover}>
                        {coverUri && (
                            <Image
                                source={{ uri: coverUri }}
                                style={styles.coverImage}
                                resizeMode="cover"
                            />
                        )}
                    </Pressable>

                    <View style={styles.categoryBadgeWrapper}>
                        <CategorySVG />
                    </View>

                    <View style={styles.bookNameWrapper}>
                        <TextInput
                            value={bookName}
                            onChangeText={setBookName}
                            placeholder="Book Name"
                            placeholderTextColor="rgba(241,241,241,0.8)"
                            multiline
                            textAlignVertical="top"
                            onContentSizeChange={(e) => {
                                const h = e.nativeEvent.contentSize.height;
                                setNameHeight(Math.min(h, maxHeight));
                            }}
                            style={[
                                styles.bookNameInput,
                                { height: Math.max(LINE_HEIGHT, nameHeight || LINE_HEIGHT) },
                            ]}
                            accessibilityLabel="Book Name"
                            maxLength={300}
                            blurOnSubmit={false}
                        />
                    </View>

                    <Text style={styles.rateLabel}>Rate</Text>

                    <View style={styles.starsRow}>
                        {[0, 1, 2, 3, 4].map((i) => {
                            const active = i < rating;
                            return (
                                <Pressable
                                    key={i}
                                    onPress={() => onStarPress(i)}
                                    hitSlop={8}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Rate ${i + 1} star${i ? 's' : ''}`}
                                    style={{ marginRight: i < 4 ? 2 : 0 }}
                                >
                                    {active ? <StarActiveSVG /> : <StarSVG />}
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.experienceLabel}>How Was Your Experience?</Text>

                    <View style={styles.marksRow}>
                        {marks.map((M, idx) => {
                            const value = idx + 1;
                            const Icon = mark === value ? M.active : M.idle;
                            return (
                                <Pressable
                                    key={value}
                                    onPress={() => onMarkPress(value)}
                                    hitSlop={10}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Experience mark: ${M.label}`}
                                    style={styles.markBtn}
                                >
                                    <Icon />
                                </Pressable>
                            );
                        })}
                    </View>

                    <ToggleRow
                        style={{ marginTop: 41 }}
                        label="Liked the style"
                        value={likedStyle}
                        onToggle={() => setLikedStyle((v) => !v)}
                    />
                    <ToggleRow
                        style={{ marginTop: 16 }}
                        label="Too long"
                        value={tooLong}
                        onToggle={() => setTooLong((v) => !v)}
                    />
                    <ToggleRow
                        style={{ marginTop: 16 }}
                        label="Will read again"
                        value={willReadAgain}
                        onToggle={() => setWillReadAgain((v) => !v)}
                    />

                    <View style={{ marginTop: 35, alignSelf: 'center' }}>
                        <Pressable
                            onPress={onSave}
                            disabled={!canSave}
                            hitSlop={8}
                            accessibilityRole="button"
                            accessibilityLabel={isEdit ? 'Update book' : 'Save book'}
                            style={{ opacity: canSave ? 1 : 0.4 }}
                        >
                            <SaveButtonSVG />
                        </Pressable>
                    </View>

                    <View style={{ height: 24 }} />
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

function ToggleRow({ label, value, onToggle, style }) {
    return (
        <View style={[styles.toggleRow, style]}>
            <Text style={styles.toggleText}>{label}</Text>
            <Pressable
                onPress={onToggle}
                hitSlop={8}
                accessibilityRole="switch"
                accessibilityState={{ checked: value }}
            >
                <View
                    style={[styles.switchBox, value ? styles.switchBoxOn : styles.switchBoxOff]}
                >
                    <View
                        style={[
                            styles.switchKnob,
                            value ? styles.switchKnobOn : styles.switchKnobOff,
                        ]}
                    />
                </View>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    content: { flexGrow: 1, alignItems: 'stretch', justifyContent: 'flex-start' },
    header: {
        marginTop: HEADER_MARGIN_TOP,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: TITLE_H,
    },
    coverBox: {
        width: 205,
        height: 264,
        borderRadius: 24,
        backgroundColor: '#DADADA',
        alignSelf: 'center',
        marginTop: 50,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    coverImage: { width: '100%', height: '100%' },
    categoryBadgeWrapper: { marginTop: 36, marginLeft: 19, alignSelf: 'flex-start' },
    bookNameWrapper: { marginTop: 36, marginLeft: 19, marginRight: 20 },
    bookNameInput: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: '#F1F1F1',
        backgroundColor: 'transparent',
        padding: 0,
    },
    rateLabel: {
        marginTop: 36,
        marginLeft: 19,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: '#F1F1F1',
    },
    starsRow: { marginTop: 16, marginLeft: 19, flexDirection: 'row', alignItems: 'center' },
    experienceLabel: {
        marginTop: 41,
        marginLeft: 19,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: '#F1F1F1',
    },
    marksRow: {
        marginTop: 16,
        marginHorizontal: 19,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    markBtn: { alignItems: 'center', justifyContent: 'center' },
    toggleRow: {
        width: 352,
        height: 66,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF32',
        borderRadius: 28,
        paddingHorizontal: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },
    toggleText: {
        color: '#F1F1F1',
        fontFamily: 'SFPro-Semibold',
        fontWeight: '600',
        fontSize: 20,
        letterSpacing: -0.32,
    },
    switchBox: { width: 69, height: 36, borderRadius: 30, borderWidth: 1, padding: 3 },
    switchBoxOff: { borderColor: 'rgba(241,241,241,0.4)', backgroundColor: 'transparent' },
    switchBoxOn: { borderColor: 'rgba(22,255,90,0.8)', backgroundColor: 'rgba(22,255,90,0.15)' },
    switchKnob: { width: 30, height: 30, borderRadius: 15 },
    switchKnobOff: { backgroundColor: '#8F8F8F', transform: [{ translateX: 0 }] },
    switchKnobOn: { backgroundColor: '#16FF5A', transform: [{ translateX: 33 }] },
});
