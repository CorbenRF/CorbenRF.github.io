<template>
   <ul class="catalog__pagination pagination">
          <li class="pagination__item">
            <a href="#" class="pagination__link pagination__link--arrow" @click.prevent="paginate(--page)" :class="{ 'pagination__link--disabled': page == 1 }" :disabled="page == 1" aria-label="Предыдущая страница">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-left"></use>
              </svg>
            </a>
          </li>
          <li class="pagination__item" v-for="PageNumber in pages" :key="PageNumber">
            <a href="#" class="pagination__link" :class="{'pagination__link--current': PageNumber === page}" @click.prevent="paginate(PageNumber)">
              {{ PageNumber }}
            </a>
          </li>
          <li class="pagination__item">
            <a class="pagination__link pagination__link--arrow" href="#" aria-label="Следующая страница" @click.prevent="paginate(++page)" :class="{ 'pagination__link--disabled': page == pages }" :disabled="page == pages">
              <svg width="8" height="14" fill="currentColor">
                <use xlink:href="#icon-arrow-right"></use>
              </svg>
            </a>
          </li>
        </ul>
</template>

<script>
export default {
  props: ['page', 'count', 'perPage'],

  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage);
    },
  },
  methods: {
    paginate(page) {
      console.log('Page changed to', page);
      this.$emit('paginate', page);
    },
  },
};
</script>
