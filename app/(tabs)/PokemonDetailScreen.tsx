import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function PokemonDetailScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const router = useRouter();

  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  //  Fetch Pokémon
  useEffect(() => {
    if (!name) return;
    const fetchPokemon = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
        const data = await res.json();
        setPokemon(data);
      } catch {
        setError("Erreur chargement");
      } finally {
        setLoading(false);
      }
    };
    fetchPokemon();
  }, [name]);

  // Recharger les favoris à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        const fav = await AsyncStorage.getItem('favorites');
        if (fav) setFavorites(JSON.parse(fav));
      };
      loadFavorites();
    }, [])
  );

  // Ajouter/retirer favoris
  const toggleFavorite = async (id: number) => {
    let newFav: number[];
    if (favorites.includes(id)) {
      newFav = favorites.filter(f => f !== id);
    } else {
      newFav = [...favorites, id];
    }
    setFavorites(newFav);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFav));
  };

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#00ffe0" />
      <Text style={styles.loading}>Chargement...</Text>
    </View>
  );

  if (error || !pokemon) return (
    <View style={styles.center}>
      <Text style={styles.error}>{error || "Erreur"}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>
      {/* BOUTON RETOUR */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.replace('/(tabs)/PokemonListScreen')}
      >
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* IMAGE + NOM */}
        <Image source={{ uri: pokemon.sprites.front_default }} style={styles.image} />
        <Text style={styles.name}>{pokemon.name.toUpperCase()}</Text>
        <Text style={styles.id}>#{pokemon.id}</Text>

        {/* FAVORIS */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(pokemon.id)}
        >
          <Text style={{ fontSize: 24, color: favorites.includes(pokemon.id) ? "red" : "#fff" }}>
            ♥
          </Text>
        </TouchableOpacity>

        {/* TYPES */}
        <View style={styles.typesContainer}>
          {pokemon.types.map((t:any) => (
            <View key={t.type.name} style={styles.typeBadge}>
              <Text style={styles.typeText}>{t.type.name}</Text>
            </View>
          ))}
        </View>

        {/* INFOS */}
        <View style={styles.card}>
          <Text style={styles.info}>Taille : {pokemon.height}</Text>
          <Text style={styles.info}>Poids : {pokemon.weight}</Text>
        </View>

        {/* STATS */}
        <Text style={styles.statsTitle}>Statistiques</Text>
        {pokemon.stats.map((s:any) => (
          <View key={s.stat.name} style={styles.statRow}>
            <Text style={styles.statName}>{s.stat.name}</Text>
            <View style={styles.statBar}>
              <View style={[styles.statFill, { width: `${s.base_stat}%` }]} />
            </View>
            <Text style={styles.statValue}>{s.base_stat}</Text>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, alignItems: "center", paddingTop: 80, paddingBottom: 40 },
  backButton: { position: "absolute", top: 50, left: 20, zIndex: 10, backgroundColor: "#203a43", padding: 10, borderRadius: 50 },
  backText: { color: "#fff", fontSize: 20 },
  image: { width: 160, height: 160 },
  name: { fontSize: 30, fontWeight: "900", color: "#00ffe0", marginTop: 10 },
  id: { color: "#aaa", marginBottom: 10 },
  favoriteButton: { marginBottom: 20 },
  typesContainer: { flexDirection: "row", gap: 10, marginBottom: 20 },
  typeBadge: { backgroundColor: "#203a43", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  typeText: { color: "#ffcc00", fontWeight: "bold" },
  card: { width: "100%", backgroundColor: "#203a43", borderRadius: 16, padding: 15, marginBottom: 20 },
  info: { color: "#00ffe0", marginBottom: 5 },
  statsTitle: { fontSize: 22, fontWeight: "bold", color: "#fff", alignSelf: "flex-start", marginBottom: 10 },
  statRow: { width: "100%", marginBottom: 12 },
  statName: { color: "#aaa", fontSize: 12 },
  statBar: { width: "100%", height: 8, backgroundColor: "#333", borderRadius: 10, marginVertical: 4 },
  statFill: { height: "100%", backgroundColor: "#00ffe0", borderRadius: 10 },
  statValue: { color: "#00ffe0", fontSize: 12 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f2027" },
  loading: { color: "#00ffe0" },
  error: { color: "#ff0066" },
});