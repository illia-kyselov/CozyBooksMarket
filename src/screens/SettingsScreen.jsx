import React, { useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, Pressable, ScrollView, Text, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { persistor } from '../store';
import { clearOrders } from '../store/ordersSlice';
import * as shelfActions from '../store/shelfSlice';
import { clearAll as clearReadBooks } from '../store/readBooksSlice';
import { resetBestScore } from '../store/quizSlice';
import { resetSettings } from '../store/settingsSlice';

import SettingsSVG from '../components/svg/SettingsSVG';
import ForwardArrowSVG from '../components/svg/ForwardArrowSVG';
import TouchBar from '../components/TouchBar';

const BG = require('../assets/images/bg.png');

const TITLE_W = 160;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;

const COLORS = {
    yellow: '#FCFF3C',
    black: '#0A0A0A',
    white: '#F1F1F1',
    blueText: '#005AA2',
};

const TOUCHBAR_HEIGHT = 72;

export default function SettingsScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const bottomGap = insets.bottom + TOUCHBAR_HEIGHT + 16;
    const [notificationsOn, setNotificationsOn] = useState(true);

    const handleClearData = async () => {
        dispatch(clearOrders());
        dispatch(clearReadBooks());
        dispatch(resetBestScore());
        dispatch(resetSettings());

        if (typeof shelfActions.clearAll === 'function') {
            dispatch(shelfActions.clearAll());
        } else if (typeof shelfActions.clearShelf === 'function') {
            dispatch(shelfActions.clearShelf());
        }

        try {
            await persistor.purge();
        } catch { }
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
                    <View style={styles.header}>
                        <SettingsSVG width={TITLE_W} height={TITLE_H} />
                    </View>

                    <View style={[styles.option, { marginTop: 42 }]}>
                        <Text style={styles.optionText}>Notifications</Text>
                        <Switch
                            value={notificationsOn}
                            onValueChange={setNotificationsOn}
                            trackColor={{ false: '#B9B9B9', true: '#34C759' }}
                            thumbColor="#FFFFFF"
                            ios_backgroundColor="#B9B9B9"
                            style={styles.switch}
                        />
                    </View>

                    <Pressable
                        style={styles.option}
                        onPress={() => navigation.navigate('CurrencyAndRegion')}
                        accessibilityRole="button"
                        accessibilityLabel="Open Currency and Region settings"
                    >
                        <Text style={styles.optionText}>Currency & Region</Text>
                        <ForwardArrowSVG width={14} height={14} />
                    </Pressable>

                    <View style={styles.option}>
                        <Text style={styles.optionText}>Privacy & Security</Text>
                        <ForwardArrowSVG width={14} height={14} />
                    </View>

                    <Pressable
                        style={styles.option}
                        onPress={() => navigation.navigate('DevInfo')}
                        accessibilityRole="button"
                        accessibilityLabel="Open Developer Info"
                    >
                        <Text style={styles.optionText}>Developer Info</Text>
                        <ForwardArrowSVG width={14} height={14} />
                    </Pressable>
                </ScrollView>

                <TouchBar activeIndex={4} />
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
        width: '100%',
        height: TITLE_H,
    },
    option: {
        width: 350,
        height: 62,
        borderRadius: 40,
        backgroundColor: COLORS.white,
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 31,
        paddingRight: 31,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    optionText: {
        fontFamily: 'SFPro-Semibold',
        fontSize: 20,
        letterSpacing: -0.32,
        color: COLORS.blueText,
    },
    switch: {
        transform: [{ scaleX: 1.0 }, { scaleY: 1.0 }],
        alignSelf: 'center',
    },
    clearBtn: {
        width: 250,
        height: 48,
        borderRadius: 30,
        backgroundColor: COLORS.yellow,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 28,
        alignSelf: 'center',
    },
    clearBtnText: {
        fontFamily: 'SFPro-Medium',
        fontSize: 16,
        color: COLORS.black,
    },
});
