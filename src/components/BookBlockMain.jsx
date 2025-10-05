import React from 'react';
import { StyleSheet, View, Text, Image, Pressable } from 'react-native';

import BuyButtonSVG from '../components/svg/BuyButtonSVG';

const COLORS = {
    whiteText: '#F1F1F1',
    pinkPrice: '#FF78E4',
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
        borderRadius: 30,
        overflow: 'hidden',
        position: 'relative',
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
        marginTop: 8,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: COLORS.whiteText,
    },
    bookPrice: {
        marginTop: 8,
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        color: COLORS.pinkPrice,
    },
    buyBtnWrapper: {
        marginTop: 8,
    },
});
