import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, ImageBackground, View, ScrollView, Text, Pressable } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setCurrency, setRegion } from '../store/settingsSlice';

import CurrencySVG from '../components/svg/CurrencySVG';
import BackArrowSVG from '../components/svg/BackArrowSVG';

const BG = require('../assets/images/bg.png');

const TITLE_W = 280;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const ARROW_TOUCH = 44;
const ARROW_ICON = 18;
const VERTICAL_NUDGE = 8;

export default function CurrencyAndRegionScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { currency, region } = useSelector((state) => state.settings);

    const currencies = ['USD', 'CAD', 'EUR', 'GBP', 'CHF', 'JPY'];
    const regions = ['America', 'Europe', 'Asia', 'Africa'];

    return (
        <ImageBackground source={BG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Pressable
                            onPress={() => navigation.goBack?.()}
                            hitSlop={12}
                            style={styles.backBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <BackArrowSVG width={ARROW_ICON} height={ARROW_ICON} />
                        </Pressable>
                        <CurrencySVG width={TITLE_W} height={TITLE_H} />
                        <View style={styles.placeholder} />
                    </View>

                    <Text style={styles.selectText}>Select Currency</Text>

                    <View style={styles.grid}>
                        {currencies.map((item) => {
                            const isActive = currency === item;
                            return (
                                <Pressable
                                    key={item}
                                    onPress={() => dispatch(setCurrency(item))}
                                    style={[styles.currencyBtn, isActive ? styles.activeBtn : styles.inactiveBtn]}
                                >
                                    <Text
                                        style={[
                                            styles.currencyText,
                                            isActive ? styles.activeText : styles.inactiveText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.regionTitle}>Select Region</Text>

                    <View style={styles.regionGrid}>
                        {regions.map((r) => {
                            const isActive = region === r;
                            return (
                                <Pressable
                                    key={r}
                                    onPress={() => dispatch(setRegion(r))}
                                    style={[styles.regionBtn, isActive ? styles.regionActive : styles.regionInactive]}
                                >
                                    <Text
                                        style={[
                                            styles.regionText,
                                            isActive ? styles.regionActiveText : styles.regionInactiveText,
                                        ]}
                                    >
                                        {r}
                                    </Text>
                                </Pressable>
                            );
                        })}
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
    content: { flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' },
    header: {
        marginTop: HEADER_MARGIN_TOP,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: TITLE_H,
    },
    backBtn: {
        width: ARROW_TOUCH,
        height: ARROW_TOUCH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    placeholder: {
        width: ARROW_TOUCH,
        height: ARROW_TOUCH,
    },
    selectText: {
        marginTop: 42,
        alignSelf: 'flex-start',
        marginLeft: 19,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: '#F1F1F1',
    },
    grid: {
        marginTop: 20,
        width: 350,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    currencyBtn: {
        width: 110,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    activeBtn: { backgroundColor: '#6EC1E4' },
    inactiveBtn: { borderWidth: 1.5, borderColor: '#6EC1E4' },
    currencyText: {
        fontFamily: 'SFPro-Regular',
        fontSize: 18,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    activeText: { color: '#0A0A0A' },
    inactiveText: { color: '#6EC1E4' },
    regionTitle: {
        marginTop: 60,
        alignSelf: 'flex-start',
        marginLeft: 19,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: '#F1F1F1',
    },
    regionGrid: {
        marginTop: 20,
        width: 350,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    regionBtn: {
        width: 165,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    regionActive: { backgroundColor: '#6EC1E4' },
    regionInactive: { borderWidth: 1.5, borderColor: '#6EC1E4' },
    regionText: {
        fontFamily: 'SFPro-Regular',
        fontSize: 17,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    regionActiveText: { color: '#0A0A0A' },
    regionInactiveText: { color: '#6EC1E4' },
});
