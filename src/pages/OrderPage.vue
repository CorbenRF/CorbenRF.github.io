<template>
  <main class="preloader-4" style="position:absolute; top:50%; left:50%; z-index: 1000;" v-show="productLoading">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div></main>
  <main class="content container" v-bind:class="{gray: productLoading}">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <RouterLink class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </RouterLink>
        </li>
        <li class="breadcrumbs__item">
          <RouterLink class="breadcrumbs__link" :to="{name: 'cart'}">
            Корзина
          </RouterLink>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ products.length }} товар{{ grammar(products.length) }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormText v-model:value="formData.name" :error="formError.name" type="text" title="ФИО" placeholder="Введите ваше полное имя"/>
            <BaseFormText v-model:value="formData.address" :error="formError.address" type="text" title="Адрес доставки" placeholder="Введите ваш адрес"/>
            <BaseFormText v-model:value="formData.phone" :error="formError.phone" type="tel" title="Телефон" placeholder="Введите ваш телефон"/>
            <BaseFormText v-model:value="formData.email" :error="formError.email" type="tel" title="Email" placeholder="Введите ваш Email"/>

            <BaseFormTextarea v-model:value="formData.comment" title="Комментарий к заказу" :error="formError.comment" placeholder="Ваши пожелания"/>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="option of deliveryOptions">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="{price: option.price, type: option.id, title: option.title}" v-model.number="deliveryInfo">
                  <span class="options__value">
                    {{ option.title }} <b>{{ option.price == 0 ? "Бесплатно" : option.price + "₽" }}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="option of paymentOptions">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="option" v-model="paymentInfo" required>
                  <span class="options__value">
                    {{ option.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="item in products" :key="item.productId">
              <h3>{{ item.product.title }} <h3 v-if="item.amount > 0">x {{ item.amount }}</h3></h3>
              <b>{{ (item.product.price * item.amount).toLocaleString() }} ₽</b>
              <span>Артикул: {{ item.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>{{ deliveryInfo.price == 0 ? "Бесплатно" : deliveryInfo.price + "₽" }}</b></p>
            <p>Итого: <b>{{ products.length }}</b> товар{{ grammar(products.length) }} на сумму <b>{{ (totalPrice + Number(deliveryInfo.price)).toLocaleString() }} ₽</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ formErrorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormText from '@/components/BaseFormText.vue';
import BaseFormTextarea from '@/components/BaseFormTextarea.vue';
import cartItemMixin from '@/mixins/cartItemMixin';
import axios from 'axios';
import { API_BASE_URL } from '@/config';

export default {
  mixins: [cartItemMixin],
  components: { BaseFormText, BaseFormTextarea },
  data() {
    return {
      productLoading: false,
      formData: {},
      formError: {},
      deliveryInfo: {},
      paymentInfo: {},
      formErrorMessage: '',
      deliveryOptions: [],
      paymentOptions: [],
    };
  },
  computed: {
    paymentInfo() {
      return axios.get(`${API_BASE_URL}/api/payments`, {
        params: {
          deliveryTypeId: this.deliveryInfo.type,
        },
      })
        .then((res) => { this.paymentOptions = res.data; this.paymentInfo = res.data[0]; });
    },
  },
  methods: {
    order() {
      this.productLoading = true;
      this.formError = {};
      this.formErrorMessage = '';
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.post(`${API_BASE_URL}/api/orders`, {
          ...this.formData,
          deliveryTypeId: this.deliveryInfo.type,
          paymentTypeId: this.paymentInfo.id,
        }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
          .then((response) => {
            this.$store.commit('resetCart');
            this.$store.commit('updateOrderInfo', response.data);
            this.$router.push({ name: 'orderInfo', params: { id: response.data.id } });
          })
          .catch((error) => {
            this.formError = error.response.data.error.request || {};
            this.formErrorMessage = error.response.data.error.message;
          })
          .then(() => this.productLoading = false);
      }, 1000);
    },

  },
  created() {
    axios.get(`${API_BASE_URL}/api/deliveries`).then((response) => {
      this.deliveryOptions = response.data;
      this.deliveryInfo = { price: response.data[0].price, type: response.data[0].id, title: response.data[0].title };
    })
      .then(() => {
        axios.get(`${API_BASE_URL}/api/payments`, {
          params: {
            deliveryTypeId: this.deliveryInfo.type,
          },
        })
          .then((res) => { this.paymentOptions = res.data; this.paymentInfo = res.data[0]; });
      });
  },
};
</script>
