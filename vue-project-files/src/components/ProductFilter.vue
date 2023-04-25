<template>
  <aside class="filter">
        <form class="filter__form form" action="#" method="get" @submit.prevent="submit">
          <fieldset class="form__block">
            <legend class="form__legend">Цена</legend>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom">
              <span class="form__value">От</span>
            </label>
            <label class="form__label form__label--price">
              <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo">
              <span class="form__value">До</span>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Категория</legend>
            <label class="form__label form__label--select">
              <select class="form__select" name="category" v-model="currentCategoryId">
                <option value="0">Все категории</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">{{ category.title }}</option>
              </select>
            </label>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Цвет</legend>
            <ul class="colors colors--black">
              <li class="colors__item" v-for="color in colorsList" :key="color.id">
                <label class="colors__label">
                  <input class="colors__radio sr-only" type="checkbox" :name="color.title" :value="color.id" v-model="currentColor">
                  <span class="colors__value" :style="{'background-color':color.code}">
                  </span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Материал</legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="material in materialsList" :key="material.id">
                <label class="check-list__label">
                  <input class="check-list__check sr-only" type="checkbox" :name="material.title" :value="material.id" v-model="currentMaterial">
                  <span class="check-list__desc" :value="material.id">
                    {{ material.title }}
                  </span>
                  <span>({{ material.productsCount }})</span>
                </label>
              </li>
            </ul>
          </fieldset>

          <fieldset class="form__block">
            <legend class="form__legend">Коллекция</legend>
            <ul class="check-list">
              <li class="check-list__item" v-for="season in seasonsList" :key="season.id">
                <label class="check-list__label">
                  <input class="check-list__check sr-only" type="checkbox" name="collection" :value="season.id" v-model="currentSeason">
                  <span class="check-list__desc" :value="season.id">
                    {{ season.title }}
                  </span>
                  <span>({{ season.productsCount }})</span>
                </label>
              </li>
            </ul>
          </fieldset>

          <button class="filter__submit button button--primery" type="submit">
            Применить
          </button>
          <button class="filter__reset button button--second" type="button" @click.prevent="reset" v-if="flagFilter">
            Сбросить
          </button>
        </form>
      </aside>
</template>

<script>
import axios, { isCancel, AxiosError } from 'axios';
import { API_BASE_URL } from '../config';

export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColor: [],
      currentMaterial: [],
      currentSeason: [],
      categoriesData: null,
      colorsData: null,
      materialsData: null,
      seasonsData: null,
      // flagFilter: false,
    };
  },
  props: ['priceFrom', 'priceTo', 'categoryId', 'color', 'material', 'season'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colorsList() {
      return this.colorsData ? this.colorsData.items : [];
    },
    materialsList() {
      return this.materialsData ? this.materialsData.items : [];
    },
    seasonsList() {
      return this.seasonsData ? this.seasonsData.items : [];
    },
    flagFilter() {
      return this.currentPriceFrom > 0 || this.currentPriceTo > 0 || this.currentCategoryId > 0 || this.currentColor.length > 0 || this.currentMaterial.length > 0 || this.currentSeason.length > 0;
    },
  },
  watch: {
    priceFrom(value) { this.currentPriceFrom = value; },
    priceTo(value) { this.currentPriceTo = value; },
    categoryId(value) { this.currentCategoryId = value; },
    color(value) { this.currentColor = value; },
    material(value) { this.currentMaterial = value; },
    season(value) { this.currentSeason = value; },
  },
  methods: {
    submit() {
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:color', this.currentColor);
      this.$emit('update:material', this.currentMaterial);
      this.$emit('update:season', this.currentSeason);
    },
    reset() {
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:color', []);
      this.$emit('update:material', []);
      this.$emit('update:season', []);
    },
    loadCategories() {
      axios.get(`${API_BASE_URL}/api/productCategories`)
        .then((response) => this.categoriesData = response.data);
    },
    loadColors() {
      axios.get(`${API_BASE_URL}/api/colors`)
        .then((response) => this.colorsData = response.data);
    },
    loadMaterials() {
      axios.get(`${API_BASE_URL}/api/materials`)
        .then((response) => this.materialsData = response.data);
    },
    loadSeasons() {
      axios.get(`${API_BASE_URL}/api/seasons`)
        .then((response) => this.seasonsData = response.data);
    },
  },
  created() { this.loadCategories(), this.loadColors(), this.loadMaterials(), this.loadSeasons(); },
};
</script>
