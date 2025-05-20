import { StyleSheet, Image, Platform, Text, Button } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuthContext } from '@/src/context/auth-context';
import { useRouter } from 'expo-router';

export default function TabTwoScreen() {

  const {logOut} = useAuthContext();
  const router = useRouter()
  const handleLogOut = ()=>{
    logOut();
    router.navigate('/')
  }


  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <Button onPress={handleLogOut} title='Log out'/>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
