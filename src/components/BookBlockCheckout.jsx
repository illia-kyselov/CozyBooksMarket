import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import ForwardArrowSVG from '../components/svg/ForwardArrowSVG';

export default function BookBlockCheckout({ title, cover, style }) {
    return (
        <View style={[styles.container, style]}>
            {cover ? (
                <Image source={cover} style={styles.cover} resizeMode="cover" />
            ) : (
                <View style={[styles.cover, styles.coverPlaceholder]} />
            )}

            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {title}
            </Text>

            <ForwardArrowSVG />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 351,
        height: 94,
        borderRadius: 40,
        backgroundColor: '#F1F1F1',
        paddingTop: 8,
        paddingRight: 19,
        paddingBottom: 8,
        paddingLeft: 19,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    cover: {
        width: 75,
        height: 78,
        borderRadius: 20,
    },
    coverPlaceholder: {
        backgroundColor: '#E3E3E3',
    },
    title: {
        flex: 1,
        fontFamily: 'SFPro-Semibold',
        fontSize: 20,
        letterSpacing: -0.32,
        color: '#005AA2',
    },
});
