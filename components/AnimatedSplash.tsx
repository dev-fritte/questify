import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplash({ onFinish }: { onFinish?: () => void }) {
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.timing(logoAnim, {
      toValue: 1,
      duration: 900,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Splashscreen ausblenden nach 2.5s
    const timeout = setTimeout(() => {
      onFinish && onFinish();
    }, 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/questify-logo.png')}
        style={[
          styles.logo,
          {
            opacity: logoAnim,
            transform: [
              { scale: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }) },
            ],
          },
        ]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffdfaa', // Grundfarbe der Farbpalette für nahtlose Integration
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  logo: {
    width: 300,
    height: 300,
  },
}); 