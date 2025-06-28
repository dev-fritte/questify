import { useColorScheme as useSystemColorScheme } from 'react-native';

export function useColorScheme() {
  // Always return 'light' as default, ignoring system preference
  return 'light';
}
