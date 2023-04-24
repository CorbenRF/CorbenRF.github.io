import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router';
import OrderPage from '@/pages/OrderPage';
import OrderInfoPage from '@/pages/OrderInfoPage';
import MainPage from '../pages/MainPage';
import NotFoundPage from '../pages/NotFoundPage';
import ProductPage from '../pages/ProductPage';
import CartPage from '../pages/CartPage';
import config from '../../vue.config';

const routes = [
  { name: 'main', component: MainPage, path: '/' }, // vue-app
  { name: 'product', component: ProductPage, path: '/product/:id' },
  { name: 'cart', component: CartPage, path: '/cart' },
  { name: 'order', component: OrderPage, path: '/order' },
  { name: 'orderInfo', component: OrderInfoPage, path: '/order/:id' },
  { name: 'notFound', component: NotFoundPage, path: '/:pathMatch(.*)' },
];

const router = createRouter({
  history: createWebHashHistory(config.publicPath), //vueConfig.publicPath
  routes,
});

export default router;
