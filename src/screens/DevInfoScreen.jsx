import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, Pressable, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import DeveloperInfoSVG from '../components/svg/DeveloperInfoSVG';
import BackArrowSVG from '../components/svg/BackArrowSVG';

const BG = require('../assets/images/bg.png');

const TITLE_W = 220;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const ARROW_TOUCH = 44;
const ARROW_ICON = 18;
const VERTICAL_NUDGE = 8;

export default function DevInfoScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const bottomGap = insets.bottom + 24;

    const bodyText = `This app was born from a love of slow stories, paper textures, and characters that stay with you long after the last page.
I believe that books aren’t just objects — they’re memories, companions, and quiet revolutions. With this app, we wanted to bring together thoughtful design, gentle colors, and a touch of whimsy (thanks, Bookin!) to help you find your next unforgettable read.
Whether you're a romantic, a wanderer, or a cosmic explorer — welcome home.
Thanks for being part of the Cozy Books Market journey.

— Made with stories, tea, and lots of love.`;

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
                        <DeveloperInfoSVG width={TITLE_W} height={TITLE_H} />
                        <Pressable
                            onPress={() => navigation.goBack?.()}
                            hitSlop={12}
                            style={styles.backBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <BackArrowSVG width={ARROW_ICON} height={ARROW_ICON} />
                        </Pressable>
                    </View>

                    <View style={styles.textWrap}>
                        <Text style={styles.text}>{bodyText}</Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
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
        left: 16,
        transform: [{ translateY: -(ARROW_TOUCH / 2 - ARROW_ICON / 2) - VERTICAL_NUDGE }],
        width: ARROW_TOUCH,
        height: ARROW_TOUCH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textWrap: {
        width: 350,
        alignSelf: 'center',
        marginTop: 24,
    },
    text: {
        fontFamily: 'SFProText-Regular',
        fontSize: 18,
        letterSpacing: -0.08,
        color: '#F1F1F1',
        textAlign: 'left',
    },
});
