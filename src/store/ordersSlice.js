import { createSlice, nanoid } from '@reduxjs/toolkit';

const normalizeDeliveryType = (val) =>
  String(val || '').toLowerCase().includes('pick') ? 'pick-up' : 'courier';

const pickDateLabel = (payload) => {
  return (
    (payload?.dateLabel ?? payload?.dateTimeISO ?? payload?.date ?? payload?.dateTime ?? '')
      .toString()
      .trim()
  );
};

const buildSubtitle = ({ deliveryType, dateLabel, address }) => {
  const prefix = dateLabel ? `${dateLabel}, ` : '';
  if (deliveryType === 'pick-up') {
    const place = (address || '').trim() || 'Pick-up location';
    return `${prefix}Pick-up at ${place}`;
  }
  const dest = (address || '').trim() || 'Your Home Address';
  return `${prefix}Courier Delivery to ${dest}`;
};

const normalizeStatus = (status) => {
  const s = String(status || '').toLowerCase();
  if (s === 'pending' || s === 'previous') return s;
  return 'pending';
};

const initialState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    placeOrder: {
      prepare(payload) {
        const id = nanoid();
        const createdAt = new Date().toISOString();

        const deliveryType = normalizeDeliveryType(payload?.deliveryType);
        const dateLabel = pickDateLabel(payload);
        const address = (payload?.address ?? '').toString().trim();
        const status = normalizeStatus(payload?.status);

        const base = {
          id,
          createdAt,
          bookId: payload?.bookId ?? 'unknown-book',
          title: payload?.title ?? 'Book',
          price: payload?.price ?? 0,
          format: payload?.format ?? 'Paper',
          quantity: payload?.quantity ?? 1,
          status,
          deliveryType,
          dateLabel,
          address,
        };

        return {
          payload: {
            ...base,
            subtitle: buildSubtitle(base),
            dateTimeISO: payload?.dateTimeISO ?? null,
          },
        };
      },
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
    },
    clearOrders(state) {
      state.items = [];
    },
  },
});

export const { placeOrder, clearOrders } = ordersSlice.actions;

export const selectPendingOrders = (state) =>
  state.orders.items.filter((o) => o.status === 'pending');

export const selectPreviousOrders = (state) =>
  state.orders.items.filter((o) => o.status === 'previous');

export default ordersSlice.reducer;
