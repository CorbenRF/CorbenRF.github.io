<template>
<li class="cart__item product">
              <div class="product__pic">
                <img :src="item.color.gallery ? item.color.gallery[0].file.url : './img/noimg.png'" width="120" height="120" :alt="item.product.title">
              </div>
              <h3 class="product__title">
                {{ item.product.title }}
              </h3>
              <p class="product__info product__info--color">
                Цвет:
                <span>
                  <i :style="{'background-color':item.color.color.code}"></i>
                  {{ item.color.color.title }}
                </span>
              </p>
              <p class="product__info-size">
                Размер:
                <span>
                  {{ item.size.title }}
                </span>
              </p>
              <span class="product__code">
                Артикул: {{ item.product.id }}
              </span>

              <div class="product__counter form__counter">
                <button type="button" aria-label="Убрать один товар" @click="decrement">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="amount" name="count">

                <button type="button" aria-label="Добавить один товар" @click="increment">
                  <svg width="10" height="10" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="product__price">
                {{ (item.amount * item.product.price).toLocaleString() }} ₽
              </b>

              <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины"
              @click.prevent="deleteProduct(item.productId)">
                <svg width="20" height="20" fill="currentColor">
                  <use xlink:href="#icon-close"></use>
                </svg>
              </button>
            </li>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';

export default {
  props: ['item'],
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch('updateCartProductAmount', { productId: this.item.productId, basketItemId: this.item.basketItemId, amount: value });
      },
    },
  },
  methods: {
    ...mapActions(['deleteCartProduct']),
    deleteProduct() {
      // this.$store.dispatch('deleteCartProduct', {productId: this.item.productId})
      this.deleteCartProduct({ id: this.item.basketItemId });
    },
    increment() {
      this.amount++;
    },
    decrement() {
      if (this.amount > 1) {
        this.amount--;
      }
    },
  },
};
</script>
