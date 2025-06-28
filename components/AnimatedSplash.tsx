import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, Dimensions, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function AnimatedSplash({ onFinish }: { onFinish?: () => void }) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate title first
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 800,
      delay: 100,
      useNativeDriver: true,
    }).start();

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
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [
              { translateY: titleAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) },
            ],
          },
        ]}
      >
        KonQuest
      </Animated.Text>
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
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#68a08a', // Akzentfarbe der App
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  logo: {
    width: 300,
    height: 300,
  },
}); 