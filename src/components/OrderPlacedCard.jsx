import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
    bg: '#F1F1F1',
    title: '#0088CC',
    text: '#0A0A0A',
};

export default function OrderPlacedCard({
    deliveryType = 'Courier',
    dateTime = '',
    address = '',
    style,
}) {
    const isCourier = String(deliveryType).toLowerCase().includes('courier');

    const message = isCourier
        ? `Please Wait For The Courier on ${dateTime} At ${address}`
        : `Please Pick Up The Order on ${dateTime} At Pick-up location`;

    return (
        <View style={[styles.card, style]}>
            <Text style={styles.title}>Your Order Has Been Placed!</Text>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        height: 210,
        borderRadius: 28,
        backgroundColor: COLORS.bg,
        paddingTop: 38,
        paddingRight: 26,
        paddingBottom: 38,
        paddingLeft: 26,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.22,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 14,
        elevation: 8,
    },
    title: {
        fontFamily: 'SFPro-Semibold',
        fontWeight: '600',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
        color: COLORS.title,
        marginBottom: 26,
    },
    message: {
        fontFamily: 'SFPro-Regular',
        fontWeight: '400',
        fontSize: 20,
        letterSpacing: -0.32,
        textAlign: 'center',
        color: COLORS.text,
    },
});
