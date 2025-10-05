import React, { useMemo, useState, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import NextButtonSVG from '../svg/NextButtonSVG';

export default function QuizStepper({ questions = [], onFinish }) {
    const total = questions.length;
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState([]);

    const stepLabel = useMemo(
        () => `${Math.min(index + 1, Math.max(total, 1))}/${Math.max(total, 1)}`,
        [index, total]
    );

    const current = questions[index] || { title: '', options: [] };
    const selected = answers[index];

    const selectOption = useCallback(
        (optIdx) => {
            const next = [...answers];
            next[index] = optIdx;
            setAnswers(next);
        },
        [answers, index]
    );

    const computeScore = useCallback(() => {
        let correctCount = 0;
        for (let i = 0; i < total; i++) {
            if (answers[i] === questions[i]?.correct) correctCount++;
        }
        return correctCount;
    }, [answers, questions, total]);

    const onNext = useCallback(() => {
        if (index < total - 1) {
            setIndex((s) => s + 1);
        } else {
            onFinish?.({ score: computeScore(), total });
        }
    }, [index, total, computeScore, onFinish]);

    return (
        <View style={styles.container}>
            <Text style={styles.progress}>{stepLabel}</Text>

            <Text style={styles.questionTitle}>{current.title}</Text>

            <View style={styles.optionsWrap}>
                {current.options.map((opt, i) => {
                    const isSelected = selected === i;
                    return (
                        <Pressable
                            key={i}
                            onPress={() => selectOption(i)}
                            style={[
                                styles.optionBase,
                                isSelected ? styles.optionSelected : styles.optionDefault,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionIndex,
                                    isSelected ? styles.indexSelected : styles.indexDefault,
                                ]}
                            >
                                {i + 1}.
                            </Text>
                            <Text
                                style={[
                                    styles.optionText,
                                    isSelected ? styles.optionTextSelected : styles.optionTextDefault,
                                ]}
                                numberOfLines={2}
                            >
                                {opt}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <Pressable
                onPress={onNext}
                disabled={typeof selected !== 'number'}
                style={{ marginTop: 132, opacity: typeof selected !== 'number' ? 0.5 : 1 }}
                android_ripple={{ color: '#e0f6ff', borderless: false }}
            >
                <NextButtonSVG width={298} height={74} />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { width: '100%', alignItems: 'center' },

    progress: {
        marginTop: 122,
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 30,
        letterSpacing: -0.32,
        color: '#FCFF3C',
    },

    questionTitle: {
        marginTop: 50,
        color: '#fff',
        textAlign: 'center',
        fontFamily: 'Slackey-Regular',
        fontSize: 20,
    },

    optionsWrap: {
        width: '100%',
        marginTop: 50,
        gap: 16,
        alignItems: 'center',
    },

    optionBase: {
        width: 351,
        height: 55,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 22,
        paddingRight: 16,
    },

    optionDefault: {
        borderWidth: 1,
        borderColor: '#FCB998',
        backgroundColor: 'transparent',
    },

    optionSelected: {
        borderWidth: 0,
        backgroundColor: '#9747FF',
    },

    optionIndex: {
        width: 28,
        marginRight: 8,
        textAlign: 'left',
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
    },
    indexDefault: { color: '#FCB998' },
    indexSelected: { color: '#F1F1F1' },

    optionText: {
        flex: 1,
        textAlign: 'left',
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
    },
    optionTextDefault: { color: '#FCB998' },
    optionTextSelected: { color: '#F1F1F1' },
});
