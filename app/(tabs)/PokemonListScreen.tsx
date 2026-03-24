import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function PokemonListScreen() {
  const router = useRouter();

  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);

  // ⚡ Charger favoris et historique depuis AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadStorage = async () => {
        const fav = await AsyncStorage.getItem('favorites');
        const hist = await AsyncStorage.getItem('history');
        if (fav) setFavorites(JSON.parse(fav));
        if (hist) setHistory(JSON.parse(hist));
      };
      loadStorage();
    }, [])
  );

  // 🔥 Charger les Pokémon
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
        const json = await response.json();
        const detailedData = await Promise.all(
          json.results.map(async (poke: any) => {
            const res = await fetch(poke.url);
            return await res.json();
          })
        );
        setData(detailedData);
        setFilteredData(detailedData);
      } catch {
        setError("Erreur lors du chargement");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔎 Filtrage recherche
  useEffect(() => {
    const filtered = data.filter(p => {
      const nameMatch = p.name.toLowerCase().includes(search.toLowerCase());
      const typeMatch = p.types.some((t:any) =>
        t.type.name.toLowerCase().includes(search.toLowerCase())
      );
      const idMatch = p.id.toString().includes(search);
      return nameMatch || typeMatch || idMatch;
    });
    setFilteredData(filtered);
  }, [search, data]);

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

  // Ajouter à l'historique
  const addToHistory = async (id: number) => {
    let newHist = [id, ...history.filter(h => h !== id)];
    if (newHist.length > 50) newHist = newHist.slice(0, 50);
    setHistory(newHist);
    await AsyncStorage.setItem('history', JSON.stringify(newHist));
  };

  if (isLoading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#00ffe0" />
      <Text style={styles.loadingText}>Chargement...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.center}>
      <Text style={styles.errorText}>{error}</Text>
    </View>
  );

  return (
    <LinearGradient colors={['#0f2027', '#203a43', '#2c5364']} style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Pokédex</Text>
          <Text style={styles.subtitle}>{filteredData.length} Pokémon</Text>
        </View>
      </View>

      {/* RECHERCHE */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Rechercher (nom, type, id)"
          placeholderTextColor="#888"
          style={styles.search}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={() => setSearch('')}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* HISTORIQUE */}
      {history.length > 0 && (
        <View style={{ marginBottom: 15 }}>
          <Text style={{ color: "#fff", marginBottom: 5 }}>Derniers Pokémon consultés :</Text>
          <FlatList
            data={history.map(id => data.find(p => p.id === id)).filter(Boolean)}
            horizontal
            keyExtractor={(item:any) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{ marginRight: 10 }}
                onPress={() => {
                  addToHistory(item.id);
                  router.push(`/(tabs)/PokemonDetailScreen?name=${item.name}`);
                }}
              >
                <Image source={{ uri: item.sprites.front_default }} style={{ width: 50, height: 50 }} />
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* LISTE DES POKÉMON */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              addToHistory(item.id);
              router.push(`/(tabs)/PokemonDetailScreen?name=${item.name}`);
            }}
          >
            <Text style={styles.id}>#{item.id}</Text>
            <Image source={{ uri: item.sprites.front_default }} style={styles.image} />
            <Text style={styles.name}>{item.name.toUpperCase()}</Text>
            <Text style={styles.type}>
              {item.types.map((t:any) => t.type.name).join(" / ")}
            </Text>

            {/* Favoris */}
            <TouchableOpacity
              style={{ position: "absolute", top: 10, right: 10 }}
              onPress={() => toggleFavorite(item.id)}
            >
              <Text style={{ fontSize: 20, color: favorites.includes(item.id) ? "red" : "#fff" }}>
                ♥
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, paddingHorizontal: 15 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingBottom: 10 },
  backButton: { width: 50, padding: 10, borderRadius: 50, backgroundColor: "#203a43", justifyContent: "center", alignItems: "center" },
  backText: { color: "#fff", fontSize: 20 },
  titleContainer: { flex: 1, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "900", color: "#fff" },
  subtitle: { color: "#aaa", marginTop: 4 },
  searchContainer: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  search: { flex: 1, backgroundColor: "#203a43", borderRadius: 12, padding: 12, color: "#00ffe0" },
  clearButton: { position: "absolute", right: 12, padding: 4 },
  clearText: { color: "#fff", fontSize: 18 },
  list: { paddingBottom: 100 },
  card: { flex: 1, backgroundColor: "#203a43", margin: 8, borderRadius: 16, padding: 12, alignItems: "center", elevation: 5 },
  id: { color: "#aaa", fontSize: 12 },
  image: { width: 80, height: 80 },
  name: { fontWeight: "bold", color: "#00ffe0", marginTop: 5 },
  type: { fontSize: 12, color: "#ffcc00" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f2027" },
  loadingText: { color: "#00ffe0", marginTop: 10 },
  errorText: { color: "#ff0066", fontWeight: "bold" },
});