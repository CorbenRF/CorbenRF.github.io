<template>

<main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">
        Каталог
      </h1>
      <span class="content__info">
        {{ countProducts }} товар{{ grammar(countProducts) }}
      </span>
    </div>

    <div class="content__catalog">
      <ProductFilter v-model:priceFrom="filterPriceFrom" v-model:priceTo="filterPriceTo"
      v-model:categoryId.number="filterCategoryId" v-model:color="filterColorIds" v-model:material="filterMaterialIds" v-model:season="filterSeasonIds" :products="products"
      />
      <section class="catalog">
        <div class="preloader-4" v-if="productsLoading"><div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div></div>
    <div v-if="productsLoadingFailed">Произошла ошибка при загрузке товаров. Попробуйте позднее
        <button @click.prevent="loadProducts">Попробовать еще раз</button>
        </div>
    <ProductList v-else :products="products" @gotoPage="(pageName, pageParams) => $emit('gotoPage', pageName, pageParams)"/>
<BasePagination :page="page" :count="countProducts" :per-page="productsPerPage"
@paginate="page = $event"/>

      </section>
    </div>
  </main>
</template>

<script>
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import axios, { isCancel, AxiosError } from 'axios';
import grammar from '@/mixins/grammar';
import { API_BASE_URL } from '../config';

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      // products: null,
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColorIds: [],
      filterMaterialIds: [],
      filterSeasonIds: [],
      page: 1,
      productsPerPage: 6,
      productsData: null,
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  emits: ['gotoPage'],
  computed: {
    products() {
      return this.productsData ? this.productsData.items.map((product) => ({
        ...product,
        // basketItemId: product.id,
      })) : [];
    },

    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },

  },
  mixins: [grammar],
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios.get(`${API_BASE_URL}/api/products`, {
          params: {
            page: this.page,
            limit: this.productsPerPage,
            categoryId: this.filterCategoryId,
            colorIds: this.filterColorIds,
            materialIds: this.filterMaterialIds,
            seasonIds: this.filterSeasonIds,
            minPrice: this.filterPriceFrom,
            maxPrice: this.filterPriceTo,
          },
        })
          .then((response) => this.productsData = response.data)
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false);
      }, 200);
    },
  },
  watch: {
    page() {
      this.loadProducts();
    },
    filterPriceFrom() {
      this.loadProducts();
    },
    filterPriceTo() {
      this.loadProducts();
    },
    filterCategoryId() {
      this.loadProducts();
    },
    filterMaterialIds() {
      this.loadProducts();
    },
    filterSeasonIds() {
      this.loadProducts();
    },
    filterColorIds() {
      this.loadProducts();
    },
  },
  created() {
    this.loadProducts();
  },

};
</script>
