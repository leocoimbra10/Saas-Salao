/**
 * APP CONSTANTS & CONTENT
 * Single source of truth for text content and configuration
 */

export const APP_TEXTS = {
    // Global
    BRAND_NAME: 'Beauty Salon Enterprise',
    COPYRIGHT: '© 2024 Beauty Salon Enterprise',

    // Home Page
    HOME_HERO_TITLE: 'Beauty Salon',
    HOME_HERO_SUBTITLE: 'Experiência Premium em Beleza e Bem-estar',
    HOME_BUTTON_LOGIN: 'Acessar Minha Conta',
    HOME_BUTTON_REGISTER_BUSINESS: 'Cadastrar Meu Negócio',

    // Home Features
    HOME_FEATURE_PREMIUM: 'Premium',
    HOME_FEATURE_SECURE: 'Seguro',
    HOME_FEATURE_DIGITAL: 'Digital',

    // Config Guard
    CONFIG_ERROR_TITLE: 'Configuração Necessária',
    CONFIG_ERROR_DESC: 'Algumas configurações essenciais estão faltando ou a conexão falhou.',
    CONFIG_BUTTON_RETRY: 'Tentar Novamente',
    CONFIG_CONTACT_SUPPORT: 'Contatar Suporte',

    // Client Booking
    BOOKING_STEP_SERVICES_TITLE: 'Selecionar Serviços',
    BOOKING_STEP_SERVICES_DESC: 'Selecione os serviços desejados. Aplicamos 10% de desconto de segunda a quinta!',
    BOOKING_STEP_DATETIME_TITLE: 'Data e Horário',
    BOOKING_STEP_DATETIME_DESC: 'Escolha a melhor data e horário para seu atendimento.',
    BOOKING_STEP_INFO_TITLE: 'Seus Dados',
    BOOKING_STEP_INFO_DESC: 'Precisamos de algumas informações para confirmar seu agendamento.',
    BOOKING_STEP_CONFIRM_TITLE: 'Confirmar',
    BOOKING_STEP_CONFIRM_DESC: 'Revise as informações do seu agendamento',

    BOOKING_SUCCESS_TITLE: 'Quase lá!',
    BOOKING_SUCCESS_DESC: 'Revise as informações do seu agendamento',

    // Actions
    BTN_CONTINUE: 'Continuar',
    BTN_CONFIRM: 'Confirmar Agendamento',
    BTN_BACK: 'Voltar',
};

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER_BUSINESS: '/register-business',
    CLIENT_DASHBOARD: '/cliente',
    CLIENT_BOOKING: '/cliente/agendar',
    BOOKING_SUCCESS: '/agendar/sucesso',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_DESIGN_SYSTEM: '/admin/design',
};
