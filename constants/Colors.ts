const tintColorLight = '#68a08a'; // Akzentfarbe
const tintColorDark = '#68a08a'; // Akzentfarbe auch im Dark Mode

// Farbvariationen der Grundfarbe #ffdfaa
const baseColorVariations = {
  light: '#ffdfaa', // Grundfarbe
  lighter: '#fff2d4', // Heller (für Karten)
  lightest: '#fff8e8', // Am hellsten (für Header)
  darker: '#f0d495', // Dunkler (für Schatten)
  darkest: '#e6c885', // Am dunkelsten (für Borders)
};

// Farbvariationen der Akzentfarbe #68a08a
const accentColorVariations = {
  light: '#68a08a', // Akzentfarbe
  lighter: '#7ab09c', // Heller
  lightest: '#8cc0ae', // Am hellsten
  darker: '#5a8f7a', // Dunkler
  darkest: '#4c7e68', // Am dunkelsten
};

export default {
  light: {
    text: '#2c3e50', // Dunkles Blaugrau für guten Kontrast
    background: baseColorVariations.light,
    tint: tintColorLight,
    tabIconDefault: baseColorVariations.darker,
    tabIconSelected: tintColorLight,
    // Neue Farben für Karten und UI-Elemente
    cardBackground: baseColorVariations.lighter,
    headerBackground: baseColorVariations.lightest,
    navigationBackground: baseColorVariations.lightest,
    borderColor: baseColorVariations.darker,
    shadowColor: baseColorVariations.darkest,
    successColor: accentColorVariations.light,
    warningColor: '#f39c12',
    errorColor: '#e74c3c',
  },
  dark: {
    text: '#ecf0f1', // Helles Grau für Dark Mode
    background: '#2c3e50', // Dunkles Blaugrau
    tint: tintColorDark,
    tabIconDefault: '#7f8c8d', // Mittleres Grau
    tabIconSelected: tintColorDark,
    // Neue Farben für Karten und UI-Elemente im Dark Mode
    cardBackground: '#34495e', // Dunkleres Blaugrau
    headerBackground: '#2c3e50', // Dunkles Blaugrau
    navigationBackground: '#2c3e50', // Dunkles Blaugrau
    borderColor: '#4a5f7a', // Mittleres Blaugrau
    shadowColor: '#1a252f', // Sehr dunkles Blaugrau
    successColor: accentColorVariations.lighter,
    warningColor: '#f39c12',
    errorColor: '#e74c3c',
  },
};
