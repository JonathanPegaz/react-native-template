import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

// Base components
export * from './base/avatar';
export * from './base/badge';
export * from './base/button';
export * from './base/card';
export * from './base/checkbox';
export * from './base/icon-button';
export * from './base/image';
export * from './base/input';
export * from './base/select';
export { CustomSwitch } from './base/switch';
export * from './base/text';

// Feedback components
export * from './feedback';
export * from './feedback/modal';
export * from './feedback/progress-bar';

// Layout components
export * from './layout';
export * from './layout/list';

// Utilities
export { default as colors } from './colors';
export * from './focus-aware-status-bar';
export * from './utils';

// export base components from react-native
export {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
export { SafeAreaView } from 'react-native-safe-area-context';

//Apply cssInterop to Svg to resolve className string into style
cssInterop(Svg, {
  className: {
    target: 'style',
  },
});
