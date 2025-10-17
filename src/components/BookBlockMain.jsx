import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

import BuyButtonSVG from '../components/svg/BuyButtonSVG';

const COLORS = {
    whiteText: '#F1F1F1',
    pinkPrice: '#FF6B9D',
};

export default function BookBlockMain({
    cover,
    TopBadge,
    BottomBadge,
    title,
    price,
    onBuy,
}) {
    return (
        <View style={styles.bookWrapper}>
            <View style={styles.bookIconOuter}>
                {TopBadge && (
                    <View style={styles.bookBadgeTop}>
                        <TopBadge />
                    </View>
                )}
                {BottomBadge && (
                    <View style={styles.bookBadgeBottom}>
                        <BottomBadge />
                    </View>
                )}
                <Image source={cover} style={styles.bookIconImage} resizeMode="cover" />
            </View>

            <Text
                style={styles.bookTitle}
                numberOfLines={2}
                ellipsizeMode="tail"
            >
                {title}
            </Text>

            <Text style={styles.bookPrice}>{price}</Text>

            <Pressable
                onPress={onBuy}
                style={styles.buyBtnWrapper}
                accessibilityRole="button"
                accessibilityLabel={`Buy ${title}`}
            >
                <BuyButtonSVG />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    bookWrapper: {
        width: 165,
        alignItems: 'flex-start',
    },
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
    bookIconImage: {
        width: '100%',
        height: '100%',
    },
    bookBadgeTop: {
        position: 'absolute',
        top: 6,
        left: 10,
        zIndex: 2,
    },
    bookBadgeBottom: {
        position: 'absolute',
        bottom: -2,
        right: 0,
        zIndex: 2,
    },
    bookTitle: {
        marginTop: 10,
        fontFamily: 'SFPro-Regular',
        fontSize: 23,
        letterSpacing: -0.28,
        color: COLORS.whiteText,
    },
    bookPrice: {
        marginTop: 10,
        fontFamily: 'SFPro-Regular',
        fontSize: 23,
        letterSpacing: -0.28,
        color: COLORS.pinkPrice,
    },
    buyBtnWrapper: {
        marginTop: 10,
    },
});
