import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icon1 from './svg/TouchBarIcons/Icon1SVG';
import Icon1Active from './svg/TouchBarIcons/Icon1OnPressSVG';
import Icon2 from './svg/TouchBarIcons/Icon2SVG';
import Icon2Active from './svg/TouchBarIcons/Icon2OnPressSVG';
import Icon3 from './svg/TouchBarIcons/Icon3SVG';
import Icon3Active from './svg/TouchBarIcons/Icon3OnPressSVG';
import Icon4 from './svg/TouchBarIcons/Icon4SVG';
import Icon4Active from './svg/TouchBarIcons/Icon4OnPressSVG';
import Icon5 from './svg/TouchBarIcons/Icon5SVG';
import Icon5Active from './svg/TouchBarIcons/Icon5OnPressSVG';

const ICONS = [
    { Default: Icon1, Active: Icon1Active }, // 0 → Main
    { Default: Icon2, Active: Icon2Active }, // 1 → MyOrders
    { Default: Icon3, Active: Icon3Active }, // 2 → MyBooks
    { Default: Icon4, Active: Icon4Active }, // 3 → Quiz
    { Default: Icon5, Active: Icon5Active }, // 4 → Settings
];

const ROUTES_BY_INDEX = {
    0: 'Main',
    1: 'MyOrders',
    2: 'MyBooks',
    3: 'Quiz',
    4: 'Settings',
};

export default function TouchBar({ activeIndex }) {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    
    const routeToIndex = useMemo(
        () => ({ Main: 0, MyOrders: 1, MyBooks: 2, Quiz: 3, Settings: 4 }),
        []
    );

    const currentActive =
        typeof activeIndex === 'number'
            ? activeIndex
            : (routeToIndex[route?.name] ?? 0);

    // Адаптивное позиционирование для всех размеров экрана
    const screenHeight = Dimensions.get('window').height;
    const screenWidth = Dimensions.get('window').width;
    
    // Вычисляем позицию снизу экрана с учетом safe area
    const bottomPosition = insets.bottom + 16; // 16px отступ от низа
    const centerPosition = (screenWidth - 258) / 2; // центрируем по горизонтали (258 - ширина таббара)

    return (
        <View style={[styles.container, { bottom: bottomPosition, left: centerPosition }]}>
            {ICONS.map(({ Default, Active }, idx) => {
                const Icon = idx === currentActive ? Active : Default;
                return (
                    <Pressable
                        key={idx}
                        onPress={() => {
                            const routeName = ROUTES_BY_INDEX[idx];
                            if (routeName) navigation.navigate(routeName);
                        }}
                        style={styles.iconBtn}
                        android_ripple={{ color: '#E5E000', borderless: false }}
                        hitSlop={10}
                        accessibilityRole="button"
                        accessibilityLabel={`TouchBar item ${idx + 1}`}
                    >
                        <Icon width={28} height={28} />
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        width: 258,
        height: 62,
        backgroundColor: '#FCFF3C',
        borderRadius: 40,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        // Убираем фиксированную позицию top, теперь используем bottom
    },
    iconBtn: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
