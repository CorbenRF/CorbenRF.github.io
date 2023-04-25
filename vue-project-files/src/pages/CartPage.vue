<template>
  <main class="preloader-4" v-if="productsLoading"><div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div></main>
    <main class="content container" v-else-if="productsLoadingFailed">Не удалось загрузить корзину</main>
  <main class="content container" v-else>
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
      </ul>

      <h1 class="content__title">
        Корзина
      </h1>
      <span class="content__info">
        {{ products.length }} товар{{ grammar(products.length) }}
      </span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ totalPrice.toLocaleString() }} ₽</span>
          </p>

          <RouterLink tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit" v-if="products.length > 0">
            Оформить заказ
          </RouterLink>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import cartItemMixin from '@/mixins/cartItemMixin';

export default {
  mixins: [cartItemMixin],
};
</script>
