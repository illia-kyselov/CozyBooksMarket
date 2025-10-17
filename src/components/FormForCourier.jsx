import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function FormForCourier({
    valueDateTime = '',
    onChangeDateTime = () => { },
    valueAddress = '',
    onChangeAddress = () => { },
}) {
    const addressRef = useRef(null);

    return (
        <View style={styles.container}>
            <Text style={[styles.label, styles.firstLabel]}>Enter Date and Time</Text>
            <TextInput
                value={valueDateTime}
                onChangeText={onChangeDateTime}
                style={[styles.input, styles.mt11]}
                textAlignVertical="center"
                returnKeyType="next"
                onSubmitEditing={() => addressRef.current?.focus()}
            />

            <Text style={[styles.label, styles.mt11]}>Enter Address</Text>
            <TextInput
                ref={addressRef}
                value={valueAddress}
                onChangeText={onChangeAddress}
                style={[styles.input, styles.mt11]}
                textAlignVertical="center"
                returnKeyType="done"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 350,
        height: 180,
        marginTop: 16,
        alignSelf: 'center',
        borderRadius: 26,
        backgroundColor: '#FFFFFF32',
        paddingTop: 16,
        paddingBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.16,
        shadowRadius: 5,
        elevation: 4,
    },
    label: {
        marginLeft: 23,
        fontFamily: 'SFPro-Regular',
        fontSize: 20,
        letterSpacing: -0.32,
        color: '#F1F1F1',
    },
    input: {
        width: 305,
        height: 38,
        borderRadius: 20,
        backgroundColor: '#F1F1F1',
        alignSelf: 'flex-start',
        marginLeft: 23,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontFamily: 'SFPro-Regular',
        fontSize: 16,
        color: '#0A0A0A',
    },
    mt11: { marginTop: 11 },
    firstLabel: {},
});
