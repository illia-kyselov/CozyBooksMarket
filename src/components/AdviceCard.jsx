import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const manImg = require('../assets/images/AdviseMan.png');

export default function AdviceCard({ text }) {
    return (
        <View style={styles.container}>
            <Image source={manImg} style={styles.avatar} resizeMode="contain" />

            <Text style={styles.text}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 122,
        marginTop: 35,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 30,
        backgroundColor: '#FFFFFF2E',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 90,
        height: 90,
        marginLeft: 10,
        marginRight: 12,
    },
    text: {
        flex: 1,
        fontFamily: 'SFPro-Regular',
        fontSize: 18,
        letterSpacing: -0.32,
        color: '#FFFFFF',
        textAlignVertical: 'center',
    },
});
