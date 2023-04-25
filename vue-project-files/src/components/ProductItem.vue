<template>
<RouterLink class="catalog__pic" href="#" :to="{name: 'product', params: {id: product.id}}">
              <img :src="color.url" :alt="product.title">
</RouterLink>

            <h3 class="catalog__title">
              <a href="#">
                {{ product.title }}
              </a>
            </h3>

            <span class="catalog__price">
              {{ product.price.toLocaleString() }} ₽
            </span>

            <ul class="colors colors--black">
              <li class="colors__item" v-for="[index, val] of product.colors.entries()" :key="product.id">
                <label class="colors__label">
                  <input class="colors__radio sr-only" type="radio" :checked="index === 0"
                  :value="{name: val.color.title, url: val.gallery ? val.gallery[0].file.url : './img/noimg.png'}" v-model="color">
                  <span class="colors__value" :style="{'background-color':val.color.code}">
                  </span>
                </label>
              </li>
        </ul>
</template>

<script>
export default {
  data() {
    return {
      color: {
        name: this.product.colors[0].color.title,
        url: this.product.colors[0].gallery ? this.product.colors[0].gallery[0].file.url : './img/noimg.png',
      },
      image: '',
    };
  },
  emits: ['gotoPage'],
  props: ['product'],
};
</script>
