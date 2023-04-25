import { createApp } from 'vue';
import { createStore } from 'vuex';
import axios, { isCancel, AxiosError } from 'axios';
import { API_BASE_URL } from '../config';
// Create a new store instance.
const store = createStore({
  state: {
    cartProducts: [
      // {productId: 1, amount: 2}
    ],
    userAccessKey: null,
    cartProductsData: [],
    orderInfo: null,
    productsLoading: false,
    productsLoadingFailed: false,
  },
  mutations: {
    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },
    resetCart(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },
    updateCartProductAmount(state, { productId, basketItemId, amount }) { //
      const item = state.cartProducts.find((item) => item.basketItemId === basketItemId); // error here because of id
      console.log('update result: ', item);
      if (item) {
        item.amount = amount;
      }
    },
    deleteCartProduct(state, { productId, basketItemId }) {
      state.cartProducts = state.cartProducts.filter((item) => item.basketItemId !== basketItemId);
    },
    updateUserAccessKey(state, accessKey) {
      state.userAccessKey = accessKey;
    },
    updatecartProductsData(state, items) {
      state.cartProductsData = items;
    },
    syncCartProducts(state) {
      state.cartProducts = state.cartProductsData.map((item) => ({
        productId: item.product.id,
        amount: item.quantity,
        basketItemId: item.id,
        color: item.color,
        size: item.size,
      }));
    },
  },
  getters: {
    cartDetailProducts(state) {
      return state.cartProducts.map((item) => {
        const { product } = state.cartProductsData.find((p) => p.product.id === item.productId);
        return {
          ...item,
          product: {
            ...product,
            image: product.colors[0].gallery ? product.colors[0].gallery[0].file.url : '',
            basketItemId: item.id, // added to try and find basket item id
          },
        };
      });
    },
    cartTotalPrice(state, getters) {
      return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0);
    },
    orderDetailRequest(state) {
      return state.orderInfo;
    },
  },
  actions: {
    loadOrderInfo(context, orderId) {
      return axios.get(`${API_BASE_URL}/api/orders/${orderId}`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        });
    },
    loadCart(context) {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      return axios.get(`${API_BASE_URL}/api/baskets`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          if (!context.state.userAccessKey || context.state.userAccessKey !== response.data.user.accessKey) {
            console.log('user access key', response.data.user.accessKey);
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => this.productsLoadingFailed = true)
        .then(() => this.productsLoading = false);
    },
    addProductToCart(context, {
      productId, colorId, sizeId, amount,
    }) {
      return (new Promise((resolve) => setTimeout(resolve, 1000)))
        .then(() => axios.post(`${API_BASE_URL}/api/baskets/products`, {
          productId,
          colorId,
          sizeId,
          quantity: amount,
        }, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
          .then((response) => {
            context.commit('updatecartProductsData', response.data.items);
            context.commit('syncCartProducts');
          }));
    },
    updateCartProductAmount(context, { productId, basketItemId, amount }) {
      context.commit('updateCartProductAmount', { productId, basketItemId, amount });

      if (amount < 1) {
        return;
      }

      return axios.put(`${API_BASE_URL}/api/baskets/products`, {
        basketItemId,
        quantity: amount,
      }, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
      })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
    deleteCartProduct(context, { id }) {
      console.log('delete basket item id: ', id);
      return axios.delete(`${API_BASE_URL}/api/baskets/products`, {
        params: {
          userAccessKey: context.state.userAccessKey,
        },
        data: {
          basketItemId: id,
        },
      })
        .then((response) => {
          context.commit('updatecartProductsData', response.data.items);
          context.commit('syncCartProducts');
        })
        .catch(() => {
          context.commit('syncCartProducts');
        });
    },
  },
  watch: {
    productsLoading() {
      return this.productsLoading;
    },
    productsLoadingFailed() {
      return this.productsLoadingFailed;
    },
  },
});

export default store;
