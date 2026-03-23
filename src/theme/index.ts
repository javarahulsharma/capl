export const theme = {
  colors: {
    primary: '#2d4a96', // Corporate Blue
    primaryHover: '#1e3a8a',
    background: '#ffffff', // White
    card: '#ffffff', // White cards
    cardSecondary: '#e0e7ff', // Light blue-gray for "Mark Attendance"
    text: '#1e293b', // Dark slate
    textMuted: '#64748b', // Slate
    border: '#e2e8f0', // Light gray border
    error: '#ef4444', 
    success: '#28c76f', // Green from Screenshot
    inputBackground: '#f8fafc',
    drawerBackground: '#2d4a96', 
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    fontFamily: {
      regular: 'Poppins_400Regular',
      medium: 'Poppins_500Medium',
      semibold: 'Poppins_600SemiBold',
      bold: 'Poppins_700Bold',
    },
    h1: {
      fontSize: 32,
      fontFamily: 'Poppins_700Bold',
    },
    h2: {
      fontSize: 24,
      fontFamily: 'Poppins_600SemiBold',
    },
    body: {
      fontSize: 16,
      fontFamily: 'Poppins_400Regular',
    },
    caption: {
      fontSize: 14,
      fontFamily: 'Poppins_400Regular',
    },
  },
};

export type Theme = typeof theme;
