<template>
  <RouterLink class="header__cart" :to="{name: 'cart'}" aria-label="Корзина с товарами">
    <svg width="19" height="24">
          <use xlink:href="#icon-cart"></use>
        </svg>
        <span class="header__count" aria-label="Количество товаров">{{ $store.state.cartProducts.length }}</span>
      </RouterLink>
</template>

<script>
export default {

};
</script>
