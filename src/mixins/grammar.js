export default {
  methods: {
    grammar(qty) {
      let str = '';
      if (qty === 1) {
        str = '';
      } else if ([2, 3, 4].includes((qty % 10))) { str = 'а'; } else str = 'ов';
      return str;
    },
  },
};
