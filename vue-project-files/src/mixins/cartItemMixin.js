import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import axios, { isCancel, AxiosError } from 'axios';

export default {
  data() {
    return {
      productsLoading: false,
      productsLoadingFailed: false,
    };
  },
  components: { CartItem },
  computed: {
    ...mapGetters({ products: 'cartDetailProducts', totalPrice: 'cartTotalPrice' }),
  },
  methods: {
    ...mapGetters({
      productsLoading: 'productsLoading',
      productsLoadingFailed: 'productsLoadingFailed',
    }),
    grammar(qty) {
      let str = '';
      if (qty === 1) {
        str = '';
      } else if ([2, 3, 4].includes((qty % 10))) { str = 'а'; } else str = 'ов';
      return str;
    },
  },
};
