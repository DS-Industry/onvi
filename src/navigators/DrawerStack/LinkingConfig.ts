// Updated deep linking configuration
export const config = {
  screens: {
    // Auth screens
    AuthStack: {
      screens: {
        Login: 'login',
        Register: 'register',
        ForgotPassword: 'forgot-password',
      },
    },
    // Main drawer screens (when authenticated)
    Главная: {
      path: '',
    },
    Промокоды: 'promos',
    Настройки: 'settings',
    Избранное: 'favorites',
    'О приложении': 'about',
    Партнер: {
      path: 'partner/:id',
      parse: {
        id: (id: any) => `${id}`,
      },
    },
    'Ввод Промокода': 'promo-input',
    'Перенести баланс': 'transfer-balance',
    'Правовые документы': 'legal',
    // Event screen with parameters
    EventSingleDetailScreen: {
      path: 'event-management/:item',
      parse: {
        item: (item: any) => `${item}`,
      },
    },
  },
};
