<template>
  <main class="preloader-4" v-if="productLoading"><div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div></main>
    <main class="content container" v-else-if="!productData">Не удалось загрузить товар</main>
    <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <RouterLink class="breadcrumbs__link" :to="{name: 'main'}">
            Каталог
          </RouterLink>
        </li>
        <li class="breadcrumbs__item">
          <RouterLink class="breadcrumbs__link" :to="{name: 'main'}">
            {{ category.title }}
          </RouterLink>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="displayImg" :alt="product.title">
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="[index, item] of product.colors.entries()">
            <a class="pics__link" :class="{ 'pics__link--current': chosenColor.index == index }"
             v-on:click="chosenColor={name: item.color.title, url: item.gallery ? item.gallery[0].file.url : './img/noimg.png', index: index, id: item.color.id}">
              <img width="98" height="98" :src="(item.gallery ? item.gallery[0].file.url : './img/noimg.png')"  alt="Название товара">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" action="#" method="POST" @submit.prevent="addToCart">

            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click="decrement">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="this.productAmount">

                <button type="button" aria-label="Добавить один товар" @click="increment">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
              {{ product.price.toLocaleString() }} ₽
            </b>
            </div>

            <div class="item__row">
            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors colors--black">
                <li class="colors__item" v-for="[index, val] of product.colors.entries()" :key="product.id">
                <label class="colors__label">
                  <input class="colors__radio sr-only" type="radio"
                  :value="{name: val.color.title, url: val.gallery ? val.gallery[0].file.url : './img/noimg.png', index: index, id: val.color.id}" v-model="chosenColor">
                  <span class="colors__value" :style="{'background-color':val.color.code}">
                  </span>
                </label>
              </li>
              </ul>
            </fieldset>

            <fieldset class="form__block" v-if="product.sizes">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" name="category" v-model="chosenSize" required>
                    <option disabled value="">Выберите размер...</option> /* empty option as per vue docs for iOs compatibility */
                    <option v-for="size of product.sizes" :value="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>

            <div class="preloader-4" v-if="productAddSending">
                <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div></div>
              <button class="button button--primery" type="submit" v-else>
                В корзину
              </button>

            <div v-show="productAdded">Товар добавлен в корзину</div>
          </form>
        </div>
        </div>

        <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link" :class="{ 'tabs__link--current': activeTab == 0 }" v-on:click.prevent="setAcitveTab(0, $event)">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" :class="{ 'tabs__link--current': activeTab == 1 }" v-on:click.prevent="setAcitveTab(1, $event)">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <div class="item__content" v-if="!activeTab">
          <h3>Состав:</h3>

          <p>
            60% хлопок<br>
            30% полиэстер<br>
          </p>

          <h3>Уход:</h3>

          <p>
            Машинная стирка при макс. 30ºC короткий отжим<br>
            Гладить при макс. 110ºC<br>
            Не использовать машинную сушку<br>
            Отбеливать запрещено<br>
            Не подвергать химчистке<br>
          </p>

        </div>

        <div class="item__content" v-else>
          <h3>Доставка:</h3>

          <p>
            1. Курьерская доставка по Москве и Московской области – 290 ₽<br>
            2.Самовывоз из магазина. Список и адреса магазинов Вы можете посмотреть здесь<br>
          </p>

          <h3>Возврат:</h3>

          <p>
            Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
            Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.
            БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
            Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09<br>
          </p>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
import axios, { isCancel, AxiosError } from 'axios';
import { mapActions } from 'vuex';
// import { classProperty } from '@babel/types';
import { API_BASE_URL } from '../config';

export default {
  data() {
    return {
      productAmount: 1,
      productData: null,
      productLoading: false,
      productLoadingFailed: false,
      productAdded: false,
      productAddSending: false,
      chosenColor: {},
      chosenSize: '',
      activeTab: 0,
    };
  },
  computed: {
    product() {
      return this.productData;
    },
    category() {
      return this.productData.category;
    },
    displayImg() {
      return this.chosenColor.url;
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),
    addToCart() {
      this.productAdded = false;
      this.productAddSending = true;
      this.addProductToCart({
        productId: this.product.id, colorId: this.chosenColor.id, sizeId: this.chosenSize, amount: this.productAmount,
      })
        .then(() => {
          this.productAdded = true;
          this.productAddSending = false;
        });
    },
    increment() {
      this.productAmount++;
    },
    decrement() {
      if (this.productAmount > 0) {
        this.productAmount--;
      }
    },
    loadProduct() {
      this.productLoading = true;
      this.productLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products/${this.$route.params.id}`)
          .then((response) => {
            this.productData = response.data;
            this.chosenColor = {
              name: response.data.colors[0].color.title,
              url: response.data.colors[0].gallery ? response.data.colors[0].gallery[0].file.url : './img/noimg.png',
              index: 0,
              id: response.data.colors[0].color.id,
            };
          })
          .catch((error) => { this.productLoadingFailed = true; console.log(error); })
          .then(() => this.productLoading = false);
      }, 100);
    },
    setAcitveTab(val) {
      this.activeTab = val;
    },
  },
  created() {
    this.loadProduct();
  },
  beforeRouteUpdate() {
    this.loadProduct();
  },
};
</script>
