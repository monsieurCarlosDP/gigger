import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  invert?: boolean;
  type?: 'default' | 'title' | 'title2' | 'defaultSemiBold' | 'subtitle' | 'link' | 'subtitle2'| 'tagAvatar';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  invert=false,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: invert? lightColor:darkColor, dark: invert? darkColor:lightColor }, 'text');
  
  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'title2' ? styles.title2 : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'subtitle2' ? styles.subtitle2 : undefined,
        type === 'tagAvatar' ? styles.tagAvatar : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  title2: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tagAvatar: {
    fontSize: 12,
    fontWeight: 'normal',
    color: 'white'
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
