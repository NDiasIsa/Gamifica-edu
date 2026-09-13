import { Image } from 'expo-image';
import type { StyleProp, ImageStyle } from 'react-native';

// SVGs exportados diretamente do Figma (cores já aplicadas em cada arquivo).
const icons = {
  back: require('@/assets/icons/back.svg'),
  bell: require('@/assets/icons/bell.svg'),
  'bolt-gold': require('@/assets/icons/bolt-gold.svg'),
  'bolt-reward': require('@/assets/icons/bolt-reward.svg'),
  'bolt-success': require('@/assets/icons/bolt-success.svg'),
  book: require('@/assets/icons/book.svg'),
  'book-lg': require('@/assets/icons/book-lg.svg'),
  cap: require('@/assets/icons/cap.svg'),
  cards: require('@/assets/icons/cards.svg'),
  check: require('@/assets/icons/check.svg'),
  chev: require('@/assets/icons/chev.svg'),
  'chev-active': require('@/assets/icons/chev-active.svg'),
  coin: require('@/assets/icons/coin.svg'),
  flame: require('@/assets/icons/flame.svg'),
  flask: require('@/assets/icons/flask.svg'),
  map: require('@/assets/icons/map.svg'),
  'map-light': require('@/assets/icons/map-light.svg'),
  pdf: require('@/assets/icons/pdf.svg'),
  play: require('@/assets/icons/play.svg'),
  quiz: require('@/assets/icons/quiz.svg'),
  sigma: require('@/assets/icons/sigma.svg'),
  slides: require('@/assets/icons/slides.svg'),
  sword: require('@/assets/icons/sword.svg'),
};

export type IconName = keyof typeof icons;

type IconProps = {
  name: IconName;
  size: number;
  style?: StyleProp<ImageStyle>;
};

export function Icon({ name, size, style }: IconProps) {
  return (
    <Image
      source={icons[name]}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
    />
  );
}
