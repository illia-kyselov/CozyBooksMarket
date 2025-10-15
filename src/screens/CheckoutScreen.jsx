import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    StyleSheet,
    ImageBackground,
    View,
    Pressable,
    ScrollView,
    Text,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { placeOrder } from '../store/ordersSlice';
import { formatPriceFromGBP } from '../utils/currency';

import CheckoutSVG from '../components/svg/CheckoutSVG';
import BackArrowSVG from '../components/svg/BackArrowSVG';
import BookBlockCheckout from '../components/BookBlockCheckout';
import FormForCourier from '../components/FormForCourier';
import FormForPickUp from '../components/FormForPickUp';
import PlaceOrderActiveButtonSVG from '../components/svg/PlaceOrderActiveButtonSVG';
import PlaceOrderNonActiveButtonSVG from '../components/svg/PlaceOrderNonActiveButtonSVG';
import OrderPlacedButtonSVG from '../components/svg/OrderPlacedButtonSVG';
import MyOrdersButtonSVG from '../components/svg/MyOrdersButtonSVG';
import OrderPlacedCard from '../components/OrderPlacedCard';

const BG = require('../assets/images/bg.png');

const TITLE_W = 160;
const TITLE_H = 40;
const HEADER_MARGIN_TOP = 92;
const ARROW_TOUCH = 44;
const ARROW_ICON = 18;
const VERTICAL_NUDGE = 8;

const COLORS = {
    yellow: '#FCFF3C',
    black: '#0A0A0A',
    white: '#F1F1F1',
    transparent: 'transparent',
    pink: '#FF78E4',
};

function isNotAvailableBook(book) {
    const badge = (book?.badge || book?.status || '').toLowerCase();
    if (badge.includes('not avaible') || badge.includes('not available')) return true;
    const t = (book?.title || '').toLowerCase();
    return (
        t.includes('the bear and the piano') ||
        t.includes('the night circus') ||
        t.includes('the snow child')
    );
}

const normalizeDeliveryType = (val) =>
    String(val || '').toLowerCase().includes('pick') ? 'pick-up' : 'courier';

export default function CheckoutScreen(props) {
    const navigation = props?.navigation;
    const dispatch = useDispatch();

    const route = props.route ?? { params: {} };
    const { book } = route.params || {};
    const notAvailable = isNotAvailableBook(book);

    const currency = useSelector((s) => s?.settings?.currency ?? 'USD');

    const orders = useSelector((s) => s?.orders?.items ?? []);
    const lastOrderForBook =
        orders.filter((o) => o.bookId === (book?.id ?? 'unknown-book')).slice(-1)[0] || null;
    const alreadyOrdered = Boolean(lastOrderForBook);

    const [selectedFormat, setSelectedFormat] = useState('Paper');
    const [selectedDelivery, setSelectedDelivery] = useState('Courier');
    const [selectedStatus, setSelectedStatus] = useState(
        notAvailable ? 'Waiting' : 'In Stock'
    );
    const [qty, setQty] = useState(1);

    const [dateTime, setDateTime] = useState('');
    const [address, setAddress] = useState('');

    const [isPlaced, setIsPlaced] = useState(false);
    const [justPlaced, setJustPlaced] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (justPlaced) return;
        if (alreadyOrdered && lastOrderForBook) {
            const d = lastOrderForBook.deliveryType === 'courier' ? 'Courier' : 'Pick-up';
            setSelectedDelivery(d);
            setSelectedFormat(lastOrderForBook.format || 'Paper');
            setSelectedStatus(lastOrderForBook.status || 'In Stock');
            setQty(lastOrderForBook.quantity || 1);
            setDateTime(lastOrderForBook.dateLabel || '');
            setAddress(lastOrderForBook.address || '');
            setIsPlaced(true);
            setJustPlaced(false);
        }
    }, [alreadyOrdered, lastOrderForBook, justPlaced]);

    const dec = () => setQty((q) => Math.max(1, q - 1));
    const inc = () => setQty((q) => q + 1);

    const basePriceGBP =
        typeof book?.basePriceGBP === 'number'
            ? book.basePriceGBP
            : (() => {
                const raw = String(book?.price ?? '').replace(/[^\d.,]/g, '').replace(',', '.');
                const n = parseFloat(raw);
                return Number.isFinite(n) ? n : 0;
            })();

    const priceText = formatPriceFromGBP(basePriceGBP, currency);

    const buildOrderPayload = () => {
        const deliveryType = normalizeDeliveryType(selectedDelivery);
        return {
            bookId: book?.id ?? 'unknown-book',
            title: book?.title ?? 'Book',
            price: basePriceGBP,
            format: selectedFormat,
            quantity: qty,
            status: selectedStatus,
            deliveryType,
            dateLabel: (dateTime || '').trim(),
            address: (deliveryType === 'courier' ? address : '').trim(),
        };
    };

    const isCourier = selectedDelivery === 'Courier';
    const isPickup = selectedDelivery === 'Pick-up';

    const isFormValid =
        !isPlaced &&
        !notAvailable &&
        ((isCourier && String(dateTime).trim() && String(address).trim()) ||
            (isPickup && String(dateTime).trim()));

    const startPlaceFlow = () => {
        if (!isFormValid) return;
        setIsPlaced(true);
        setJustPlaced(true);
        dispatch(placeOrder(buildOrderPayload()));
    };

    useEffect(() => {
        if (!justPlaced) return;
        timeoutRef.current = setTimeout(() => {
            navigation?.navigate?.('MyOrders');
        }, 3000);
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [justPlaced, navigation]);

    const dimStyle = isPlaced ? styles.dimmed : null;

    return (
        <ImageBackground source={BG} style={styles.background} resizeMode="cover">
            <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <CheckoutSVG width={TITLE_W} height={TITLE_H} />
                        <Pressable
                            onPress={() => navigation?.goBack?.()}
                            hitSlop={12}
                            style={styles.backBtn}
                            accessibilityRole="button"
                            accessibilityLabel="Go back"
                        >
                            <BackArrowSVG width={ARROW_ICON} height={ARROW_ICON} />
                        </Pressable>
                    </View>

                    <BookBlockCheckout
                        style={{ marginTop: 34 }}
                        title={book?.title || 'Book title'}
                        cover={book?.cover}
                    />

                    <View style={dimStyle}>
                        <Text style={styles.selectFormat}>Select Format</Text>
                        <View style={styles.formatRow}>
                            <FormatButton
                                label="Paper"
                                isActive={selectedFormat === 'Paper'}
                                onPress={() => setSelectedFormat('Paper')}
                                disabled={isPlaced}
                            />
                            <FormatButton
                                label="Electronic"
                                isActive={selectedFormat === 'Electronic'}
                                onPress={() => setSelectedFormat('Electronic')}
                                disabled={isPlaced}
                            />
                        </View>
                    </View>

                    <View style={[{ marginTop: 37 }, dimStyle]}>
                        <Text style={styles.selectQuantity}>Select Quantity</Text>
                        <View style={styles.qtyBox}>
                            <Pressable onPress={!isPlaced ? dec : undefined} hitSlop={10}>
                                <Text style={styles.qtyText}>-</Text>
                            </Pressable>
                            <Text style={[styles.qtyText, { marginHorizontal: 25 }]}>{qty}</Text>
                            <Pressable onPress={!isPlaced ? inc : undefined} hitSlop={10}>
                                <Text style={styles.qtyText}>+</Text>
                            </Pressable>
                        </View>
                    </View>

                    <View style={[{ marginTop: 37 }, dimStyle]}>
                        <Text style={styles.preferredDelivery}>Preferred Delivery</Text>
                        <View style={styles.deliveryRow}>
                            <FormatButton
                                label="Courier"
                                isActive={selectedDelivery === 'Courier'}
                                onPress={() => setSelectedDelivery('Courier')}
                                disabled={isPlaced}
                            />
                            <FormatButton
                                label="Pick-up"
                                isActive={selectedDelivery === 'Pick-up'}
                                onPress={() => setSelectedDelivery('Pick-up')}
                                disabled={isPlaced}
                            />
                        </View>
                    </View>

                    <View style={dimStyle}>
                        {selectedDelivery === 'Courier' && (
                            <FormForCourier
                                valueDateTime={dateTime}
                                onChangeDateTime={setDateTime}
                                valueAddress={address}
                                onChangeAddress={setAddress}
                                disabled={isPlaced}
                            />
                        )}
                        {selectedDelivery === 'Pick-up' && (
                            <FormForPickUp
                                valueDateTime={dateTime}
                                onChangeDateTime={setDateTime}
                                disabled={isPlaced}
                            />
                        )}
                    </View>

                    <View style={dimStyle}>
                        <Text style={styles.statusTitle}>Status</Text>
                        <View style={styles.statusRow}>
                            <StatusButton
                                label="In Stock"
                                isActive={selectedStatus === 'In Stock'}
                                onPress={() => setSelectedStatus('In Stock')}
                                disabled={isPlaced || notAvailable}
                            />
                            <StatusButton
                                label="Waiting"
                                isActive={selectedStatus === 'Waiting'}
                                onPress={() => setSelectedStatus('Waiting')}
                                disabled={isPlaced}
                            />
                            <StatusButton
                                label="Reserved"
                                isActive={selectedStatus === 'Reserved'}
                                onPress={() => setSelectedStatus('Reserved')}
                                disabled={isPlaced}
                            />
                        </View>
                    </View>

                    <View style={styles.priceBox}>
                        <Text style={styles.priceLabel}>Price</Text>
                        <Text style={styles.priceValue}>{priceText}</Text>
                    </View>
                    <View style={styles.cashRow}>
                        <Text style={styles.cashText}>Cash on Delivery</Text>
                    </View>

                    {notAvailable ? (
                        <View
                            style={styles.placeOrderWrapper}
                            accessible
                            accessibilityRole="button"
                            accessibilityState={{ disabled: true }}
                            accessibilityLabel="Place order (disabled)"
                        >
                            <PlaceOrderNonActiveButtonSVG />
                        </View>
                    ) : isPlaced ? (
                        <View style={styles.placeOrderWrapper}>
                            <OrderPlacedButtonSVG />
                        </View>
                    ) : (
                        <Pressable
                            style={[styles.placeOrderWrapper, !isFormValid && { opacity: 0.6 }]}
                            accessibilityRole="button"
                            accessibilityState={{ disabled: !isFormValid }}
                            accessibilityLabel="Place Order"
                            onPress={isFormValid ? startPlaceFlow : undefined}
                            disabled={!isFormValid}
                        >
                            <PlaceOrderActiveButtonSVG />
                        </Pressable>
                    )}

                    <Pressable
                        style={styles.myOrdersWrapper}
                        accessibilityRole="button"
                        accessibilityLabel="My Orders"
                        onPress={() => navigation?.navigate?.('MyOrders')}
                        disabled={justPlaced}
                    >
                        <MyOrdersButtonSVG />
                    </Pressable>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>

            {justPlaced && (
                <View style={styles.overlayCenter} pointerEvents="auto">
                    <OrderPlacedCard deliveryType={selectedDelivery} dateTime={dateTime} address={address} />
                </View>
            )}
        </ImageBackground>
    );
}

function FormatButton({ label, isActive, onPress, disabled = false }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.formatBtnBase,
                isActive ? styles.formatBtnActive : styles.formatBtnInactive,
                disabled && styles.dimmed,
                pressed && !disabled && { opacity: 0.9 },
            ]}
            android_ripple={{ color: '#ffffff22', borderless: true }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled }}
            accessibilityLabel={label}
        >
            <Text
                numberOfLines={1}
                style={[
                    styles.formatBtnTextBase,
                    isActive ? styles.formatTextActive : styles.formatTextInactive,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

function StatusButton({ label, isActive, onPress, disabled = false }) {
    return (
        <Pressable
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                styles.statusBtnBase,
                isActive ? styles.statusBtnActive : styles.statusBtnInactive,
                disabled && styles.statusBtnDisabled,
                pressed && !disabled && { opacity: 0.9 },
            ]}
            android_ripple={{ color: '#ffffff22', borderless: true }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive, disabled }}
            accessibilityLabel={label}
        >
            <Text
                numberOfLines={1}
                style={[
                    styles.statusBtnTextBase,
                    isActive ? styles.statusTextActive : styles.statusTextInactive,
                    disabled && styles.statusTextDisabled,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, width: '100%', height: '100%' },
    safeArea: { flex: 1 },
    content: { flexGrow: 1, alignItems: 'center', justifyContent: 'flex-start' },
    header: {
        marginTop: HEADER_MARGIN_TOP,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '100%',
        height: TITLE_H,
    },
    backBtn: {
        position: 'absolute',
        top: '50%',
        left: 16,
        transform: [{ translateY: -(ARROW_TOUCH / 2 - ARROW_ICON / 2) - VERTICAL_NUDGE }],
        width: ARROW_TOUCH,
        height: ARROW_TOUCH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectFormat: {
        alignSelf: 'flex-start',
        marginTop: 25,
        marginLeft: 20,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.white,
    },
    selectQuantity: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.white,
    },
    preferredDelivery: {
        alignSelf: 'flex-start',
        marginLeft: 20,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.white,
    },
    statusTitle: {
        alignSelf: 'flex-start',
        marginTop: 28,
        marginLeft: 20,
        fontFamily: 'SFPro-Regular',
        fontSize: 22,
        letterSpacing: -0.32,
        color: COLORS.white,
    },
    formatRow: {
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    deliveryRow: {
        flexDirection: 'row',
        gap: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    statusRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginLeft: 20,
        marginTop: 20,
    },
    formatBtnBase: {
        width: 165,
        height: 47,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formatBtnActive: { backgroundColor: COLORS.yellow, borderWidth: 0 },
    formatBtnInactive: {
        backgroundColor: COLORS.transparent,
        borderWidth: 1,
        borderColor: COLORS.yellow,
    },
    formatBtnTextBase: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    formatTextActive: { color: COLORS.black },
    formatTextInactive: { color: COLORS.yellow },
    statusBtnBase: {
        width: 110,
        height: 47,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    statusBtnActive: { backgroundColor: COLORS.yellow, borderWidth: 0 },
    statusBtnInactive: {
        backgroundColor: COLORS.transparent,
        borderWidth: 1,
        borderColor: COLORS.yellow,
    },
    statusBtnDisabled: {
        backgroundColor: 'rgba(252, 255, 60, 0.55)',
        borderWidth: 0,
    },
    statusBtnTextBase: {
        fontFamily: 'SFPro-Regular',
        fontSize: 18,
        letterSpacing: -0.32,
        textAlign: 'center',
    },
    statusTextActive: { color: COLORS.black },
    statusTextInactive: { color: COLORS.yellow },
    statusTextDisabled: { color: COLORS.black, opacity: 0.7 },
    qtyBox: {
        width: 350,
        height: 45,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: COLORS.yellow,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    qtyText: {
        fontFamily: 'SFPro-Regular',
        fontSize: 24,
        letterSpacing: -0.32,
        textAlign: 'center',
        color: COLORS.yellow,
    },
    priceBox: {
        width: 350,
        height: 73,
        alignSelf: 'center',
        marginTop: 42,
        borderRadius: 30,
        backgroundColor: '#FFFFFF2E',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 15,
        paddingRight: 15,
    },
    priceLabel: {
        fontFamily: 'SFPro-Medium',
        fontSize: 20,
        letterSpacing: -0.32,
        color: COLORS.white,
    },
    priceValue: {
        fontFamily: 'SFPro-Medium',
        fontSize: 20,
        letterSpacing: -0.32,
        color: COLORS.pink,
    },
    cashRow: {
        width: 350,
        alignSelf: 'center',
        marginTop: 4,
        alignItems: 'flex-end',
    },
    cashText: {
        fontFamily: 'SFPro-Light',
        fontSize: 16,
        letterSpacing: -0.32,
        color: '#FFFFFFA8',
    },
    placeOrderWrapper: {
        width: 350,
        alignSelf: 'center',
        marginTop: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    myOrdersWrapper: {
        width: 350,
        alignSelf: 'center',
        marginTop: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dimmed: {
        opacity: 0.55,
    },
    overlayCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
});
