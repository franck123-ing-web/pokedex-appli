import { ThemedView } from '@/components/themed-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [count, setCount] = useState<number>(0);
  const [scaleAnim] = useState(new Animated.Value(1));

  const animate = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 1.15, duration: 120, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true })
    ]).start();
  };

  const handleIncrement = () => {
    setCount(prev => prev + 1);
    animate();
  };

  const handleDecrement = () => {
    setCount(prev => prev - 1);
    animate();
  };

  const handleReset = () => {
    setCount(0);
    animate();
  };

  return (
    <ThemedView style={styles.container}>
      <LinearGradient
        colors={['#0f2027', '#203a43', '#2c5364']}
        style={StyleSheet.absoluteFill}
      />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Counter App et Pokemon</Text>
        <Text style={styles.subtitle}>Gestion d'état avec React Native</Text>
      </View>

      {/* COUNTER */}
      <View style={styles.counterContainer}>
        <Animated.Text style={[styles.counter, { transform: [{ scale: scaleAnim }] }]}>
          {count}
        </Animated.Text>
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, styles.increment]} onPress={handleIncrement}>
          <Text style={styles.actionText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.decrement]} onPress={handleDecrement}>
          <Text style={styles.actionText}>-</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.reset]} onPress={handleReset}>
          <Text style={styles.actionText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* NAVIGATION */}
      <View style={styles.footer}>
        <Link href="/(tabs)/PokemonListScreen">
          <Text style={styles.link}>
            Explorer les Pokémon →
          </Text>
        </Link>
      </View>

    </ThemedView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 60,
  },

  /* HEADER */
  header: {
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 5,
  },

  /* COUNTER */
  counterContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  counter: {
    fontSize: 90,
    fontWeight: "900",
    color: "#00ffe0",
    textShadowColor: "#00ffe0",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  actionBtn: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    borderRadius: 18,
    elevation: 8,
  },

  increment: {
    backgroundColor: "#00c853",
  },

  decrement: {
    backgroundColor: "#d50000",
  },

  reset: {
    backgroundColor: "#2962ff",
  },

  actionText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  /* FOOTER */
  footer: {
    alignItems: "center",
  },

  link: {
    color: "#00ffe0",
    fontSize: 16,
    fontWeight: "bold",
  },

});