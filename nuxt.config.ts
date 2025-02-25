import Aura from '@primevue/themes/aura';

const locale = {
  accept: 'Подтвердить',
  reject: 'Отменить',
  cancel: 'Отменить',
  clear: 'Очистить',
  dateIs: 'Дата',
  dateIsNot: 'Не дата',
  dateBefore: 'Дата до',
  dateAfter: 'Дата после',
  chooseYear: 'Выбрать год',
  chooseMonth: 'Выбрать месяц',
  chooseDate: 'Выбрать дату',
  prevDecade: 'Предыдущее десятилетие',
  nextDecade: 'Следующее десятилетие',
  prevYear: 'Предыдущий год',
  nextYear: 'Следующий год',
  prevMonth: 'Предыдущий месяц',
  nextMonth: 'Следующий месяц',
  prevHour: 'Предыдущий час',
  nextHour: 'Следующий час',
  prevMinute: 'Предыдущая минута',
  nextMinute: 'Следующая минута',
  prevSecond: 'Предыдущая секунда',
  nextSecond: 'Следующая секунда',
  today: 'Сегодня',
  weekHeader: 'Неделя',
  firstDayOfWeek: 1,
  dateFormat: 'dd.mm.yy',
  monthNames: [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ],
  monthNamesShort: [
    'Янв',
    'Фев',
    'Мар',
    'Апр',
    'Май',
    'Июн',
    'Июл',
    'Авг',
    'Сен',
    'Окт',
    'Ноя',
    'Дек',
  ],
  dayNames: [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота',
  ],
  dayNamesShort: [
    'Вс',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
  ],
  dayNamesMin: [
    'Вс',
    'Пн',
    'Вт',
    'Ср',
    'Чт',
    'Пт',
    'Сб',
  ],
}


export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  nitro: {
    minify: true,
    compressPublicAssets: true,
    preset: 'node-server',
    experimental: {
      wasm: false, 
    }
  },
  modules: [
    '@primevue/nuxt-module',
    '@pinia/nuxt',
    '@formkit/auto-animate/nuxt',
    '@vueuse/nuxt',
    '@nuxt/image',
  ],
  primevue: {
    options: {
      theme: {
        preset: Aura,
      },
      locale,
    },
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  css: [
    '~/assets/css/main.css',
    'primeicons/primeicons.css',
  ],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL,
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      script: [
        {
          src: 'https://telegram.org/js/telegram-web-app.js',
        },
      ],
    },
  },
  ssr: false,
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL?.replace(/\/$/, ''),
    },
  },
})