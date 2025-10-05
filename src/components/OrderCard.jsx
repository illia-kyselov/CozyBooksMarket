import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

const BTN_W = 93;
const BTN_H = 32;

export default function OrderCard({
    coverSource,
    title,
    subtitle,
    isOnShelf = false,
    onAddToShelf = () => { },
    onGift = () => { },
}) {
    const addBtnStyle = isOnShelf ? styles.btnPrimary : styles.btnGhost;
    const addBtnText = isOnShelf ? styles.btnPrimaryText : styles.btnGhostText;

    const giftBtnStyle = isOnShelf ? styles.btnGhost : styles.btnPrimary;
    const giftBtnText = isOnShelf ? styles.btnGhostText : styles.btnPrimaryText;

    return (
        <View style={styles.card}>
            <Image source={coverSource} style={styles.cover} resizeMode="cover" />
            <View style={styles.right}>
                <Text numberOfLines={2} style={styles.title}>{title}</Text>
                <Text numberOfLines={2} style={styles.subtitle}>{subtitle}</Text>

                <View style={styles.buttonsRow}>
                    <Pressable
                        style={({ pressed }) => [addBtnStyle, pressed && styles.btnPressed]}
                        onPress={onAddToShelf}
                        accessibilityRole="button"
                        accessibilityLabel="Add To Shelf"
                    >
                        <Text style={addBtnText}>Add To Shelf</Text>
                    </Pressable>

                    <Pressable
                        style={({ pressed }) => [giftBtnStyle, pressed && styles.btnPressedGhost]}
                        onPress={onGift}
                        accessibilityRole="button"
                        accessibilityLabel="A Gift"
                    >
                        <Text style={giftBtnText}>A Gift</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 350,
        minHeight: 134,
        backgroundColor: '#F1F1F1',
        borderRadius: 40,
        padding: 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 22,
        alignSelf: 'center',
    },
    cover: { width: 103, height: 118, borderRadius: 30 },
    right: { flex: 1, justifyContent: 'center', gap: 10 },
    title: {
        fontFamily: 'SFPro-Semibold',
        fontSize: 20,
        letterSpacing: -0.32,
        color: '#005AA2',
    },
    subtitle: {
        fontFamily: 'SFPro-Regular',
        fontSize: 14,
        color: '#0A0A0A',
        opacity: 0.8,
    },

    buttonsRow: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    btnPrimary: {
        width: BTN_W,
        height: BTN_H,
        borderRadius: 30,
        backgroundColor: '#007ADB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnPrimaryText: {
        fontFamily: 'SFPro-Semibold',
        fontSize: 13,
        color: '#FFFFFF',
        letterSpacing: -0.1,
    },

    btnGhost: {
        width: BTN_W,
        height: BTN_H,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#007ADB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    btnGhostText: {
        fontFamily: 'SFPro-Semibold',
        fontSize: 13,
        color: '#007ADB',
        letterSpacing: -0.1,
    },

    btnPressed: { opacity: 0.9 },
    btnPressedGhost: { backgroundColor: '#007ADB14' },
});
