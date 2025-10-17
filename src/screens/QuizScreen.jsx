import React, { useState, useMemo } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, ScrollView, Text, Image, Pressable } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import TouchBar from '../components/TouchBar';
import StartButtonSVG from '../components/svg/StartButtonSVG';
import QuizStepper from '../components/quiz/QuizStepper';
import AdviceCard from '../components/AdviceCard';
import TryAgainButtonSVG from '../components/svg/TryAgainButtonSVG';
import LeaveButtonSVG from '../components/svg/LeaveButtonSVG';

import { selectBestScore, setBestScoreIfHigher } from '../store/quizSlice';

const BG = require('../assets/images/bg.png');
const QUIZ_IMG = require('../assets/images/QuizPic.png');

const TITLE_MARGIN_TOP = 115;
const BUTTON_MARGIN_TOP = 27;
const TOUCHBAR_HEIGHT = 72;
const EXTRA_BOTTOM_SPACE = 48;

const RESULT_MAP = [
    {
        range: [0, 3],
        title: 'POET ON A TRAM',
        text: `You feel the rhythm of the city in every turning page. You love quiet stories filled with subtle emotion, poetic language, and bittersweet reflections — best read between stops and daydreams.
Recommended reads:
The Paper Garden, The Bear and the Piano, Letters to a Young Poet`,
    },
    {
        range: [4, 6],
        title: 'LITERARY ROMANTIC',
        text: `You believe stories are made for falling in love — with people, words, and the world itself. You’re drawn to tender characters, classic drama, and language that lingers like perfume.
Recommended reads:
Pride and Prejudice, The Night Circus, Call Me by Your Name`,
    },
    {
        range: [7, 8],
        title: 'CHRONICLER OF EMPTY STREETS',
        text: `You notice what others miss — silence between streetlights, the sigh of a closed café. You love reflective books about solitude, cities, and hidden stories whispered after midnight.
Recommended reads:
The Arrival, Never Let Me Go, A Man Called Ove`,
    },
    {
        range: [9, 10],
        title: 'FANTASTIC EXPLORER',
        text: `You read to cross galaxies and climb the minds of strange creatures. You love books that ask “what if?” — and you always pack imagination, courage, and a snack.
Recommended reads:
Why We Sleep, The Left Hand of Darkness, Project Hail Mary`,
    },
];

const getResultByScore = (scoreNum) => {
    for (const item of RESULT_MAP) {
        if (scoreNum >= item.range[0] && scoreNum <= item.range[1]) return item;
    }
    return RESULT_MAP[0];
};

const QUESTIONS = [
    { title: 'WHAT DRAWS YOU TO A BOOK?', options: ['Quiet rainy cities', 'Deep feelings, beauty', 'Space and technology', 'Fast-paced action'], correct: 1 },
    { title: 'IDEAL READING SPOT?', options: ['Hidden forest bench', 'Tram with sunset', 'Silent old library', 'Cozy sci-fi pod'], correct: 1 },
    { title: 'FAVORITE KIND OF HERO?', options: ['Lonely dreamer', 'Bold romantic', 'Street wanderer', 'Galactic rebel'], correct: 2 },
    { title: 'BEST BOOK SNACK?', options: ['Tea and pastry', 'Energy drink', 'Cold lemonade', 'Black coffee'], correct: 0 },
    { title: 'WHAT MAKES YOU REREAD?', options: ['Dramatic twists', 'Great worldbuilding', 'Poetic language', 'Surprising plot'], correct: 2 },
    { title: 'HOW DO YOU CHOOSE A BOOK?', options: ['Bestseller lists', 'Friend’s review', 'Mood and intuition', 'Cool cover art'], correct: 2 },
    { title: 'FAVORITE READING TIME?', options: ['Late at night', 'Lunch break', 'Morning coffee', 'While commuting'], correct: 0 },
    { title: 'WHAT’S ON YOUR BOOKSHELF?', options: ['New thrillers', 'Classic love stories', 'Travel memoirs', 'Soft, sad novels'], correct: 3 },
    { title: 'HOW DO YOU READ?', options: ['Slowly, with notes', 'Fast, no breaks', 'One chapter daily', 'Audiobooks only'], correct: 0 },
    { title: 'HOW DO BOOKS FEEL?', options: ['Escapes', 'Home', 'Lessons', 'Tools'], correct: 1 },
];

const normalizeScorePair = (score, totalFallback) => {
    if (typeof score === 'number') return { scoreNum: score, totalNum: totalFallback };
    const m = String(score).match(/^\s*(\d+)\s*\/\s*(\d+)\s*$/);
    if (m) return { scoreNum: parseInt(m[1], 10), totalNum: parseInt(m[2], 10) };
    const n = parseInt(score, 10);
    return { scoreNum: Number.isNaN(n) ? 0 : n, totalNum: totalFallback };
};

export default function QuizScreen() {
    const insets = useSafeAreaInsets();
    const bottomGap = insets.bottom + TOUCHBAR_HEIGHT + EXTRA_BOTTOM_SPACE;

    const dispatch = useDispatch();
    const bestScore = useSelector(selectBestScore);

    const [phase, setPhase] = useState('intro');
    const [result, setResult] = useState(null);

    const { scoreNum, totalNum } = useMemo(() => {
        if (!result) return { scoreNum: 0, totalNum: QUESTIONS.length };
        const tf = typeof result.total === 'number' ? result.total : QUESTIONS.length;
        return normalizeScorePair(result.score, tf);
    }, [result]);

    const computed = useMemo(() => getResultByScore(scoreNum), [scoreNum]);

    const handleTryAgain = () => {
        setResult(null);
        setPhase('question');
    };

    const handleLeave = () => {
        setResult(null);
        setPhase('intro');
    };

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
                    {phase === 'intro' && (
                        <>
                            <Text style={styles.headerText}>“WHO ARE YOU IN THE BOOK WORLD?”</Text>

                            {bestScore > 0 && (
                                <Text style={styles.bestScoreText}>{`Your best score is ${bestScore}`}</Text>
                            )}

                            <Image source={QUIZ_IMG} style={styles.quizImage} resizeMode="cover" />
                            <Pressable onPress={() => setPhase('question')} style={{ marginTop: BUTTON_MARGIN_TOP }}>
                                <StartButtonSVG width={298} height={74} />
                            </Pressable>
                        </>
                    )}

                    {phase === 'question' && (
                        <QuizStepper
                            questions={QUESTIONS}
                            onFinish={(r) => {
                                dispatch(setBestScoreIfHigher(r?.score ?? 0));
                                setResult(r);
                                setPhase('result');
                            }}
                        />
                    )}

                    {phase === 'result' && (
                        <View style={styles.resultWrap}>
                            <Text style={styles.resultHeader}>YOUR RESULT</Text>

                            <Text style={styles.scoreText}>{`${scoreNum}/${totalNum}`}</Text>
                            <Text style={styles.resultTitle}>{computed.title}</Text>
                            <Text style={styles.resultDesc}>{computed.text}</Text>

                            <AdviceCard text={'“If only I could meet you in a 17th-century library...”'} style={{ marginTop: 30 }} />

                            <Pressable onPress={handleTryAgain} style={{ marginTop: 20 }}>
                                <TryAgainButtonSVG width={298} height={74} />
                            </Pressable>

                            <Pressable onPress={handleLeave} style={{ marginTop: 10 }}>
                                <LeaveButtonSVG width={298} height={74} />
                            </Pressable>
                        </View>
                    )}

                    <View style={{ height: EXTRA_BOTTOM_SPACE }} />
                </ScrollView>

                {phase === 'intro' ? <TouchBar activeIndex={3} /> : null}
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    safeArea: { flex: 1 },
    scroll: { flex: 1 },
    content: { flexGrow: 1, alignItems: 'flex-start', justifyContent: 'flex-start', paddingHorizontal: 20 },
    headerText: {
        alignSelf: 'center',
        marginTop: TITLE_MARGIN_TOP,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: '#FFFFFF',
    },
    bestScoreText: {
        alignSelf: 'center',
        marginTop: 20,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 18,
        letterSpacing: -0.32,
        color: '#6AD8FF',
    },
    quizImage: {
        alignSelf: 'center',
        marginTop: 32,
        width: 298,
        height: 405,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.22,
        shadowRadius: 7,
        elevation: 5,
    },
    resultWrap: { width: '100%', alignItems: 'center', justifyContent: 'flex-start' },
    resultHeader: {
        marginTop: 85,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: '#FFFFFF',
    },
    scoreText: {
        marginTop: 36,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 32,
        letterSpacing: -0.32,
        color: '#6EC1E4',
    },
    resultTitle: {
        marginTop: 36,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 25,
        letterSpacing: -0.32,
        color: '#4EE69B',
    },
    resultDesc: {
        marginTop: 36,
        width: 351,
        color: '#F1F1F1',
        fontFamily: 'SFPro-Regular',
        fontSize: 20,
        letterSpacing: -0.32,
        textAlign: 'left',
    },
});
