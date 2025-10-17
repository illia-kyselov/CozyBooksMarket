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
        height: 126,
        marginTop: 38,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 26,
        backgroundColor: '#FFFFFF32',
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
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
