import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";

const API_URL = "http://192.168.100.219:8000";

type Plataformas = {
  tidal: string | null;
  soundcloud: string | null;
  amazon: string | null;
};

export default function App() {
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [plataformas, setPlataformas] = useState<Plataformas | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const buscarPlataformas = async () => {
    if (!spotifyUrl) {
      Alert.alert("Error", "Pega un link de Spotify");
      return;
    }

    setLoading(true);
    setStatus("🔍 Buscando plataformas...");
    setPlataformas(null);

    try {
      const res = await fetch(`${API_URL}/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spotify_url: spotifyUrl }),
      });

      const data = await res.json();

      setPlataformas(data.plataformas);
      setStatus("Selecciona una plataforma 👇");
    } catch (err) {
      setStatus("❌ Error al buscar plataformas");
    } finally {
      setLoading(false);
    }
  };

  const descargarDesdePlataforma = async (urlPlataforma: string) => {
    setLoading(true);
    setStatus("⬇️ Descargando, no cierres la app...");
    
    try {
      const res = await fetch(`${API_URL}/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlPlataforma }),
      });

      const data = await res.json();

      if (data.status === "ok") {
        setStatus("✅ Descarga completada");
      } else {
        setStatus("⚠️ Error durante la descarga");
      }

    } catch (err) {
      setStatus("❌ Error de conexión con la API");
    } finally {
      setLoading(false);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Descarga de música</Text>

      <TextInput
        style={styles.input}
        placeholder="Pega el link de Spotify"
        value={spotifyUrl}
        onChangeText={setSpotifyUrl}
        autoCapitalize="none"
      />

      <Button
        title={loading ? "Buscando..." : "Buscar plataformas"}
        onPress={buscarPlataformas}
        disabled={loading}
      />

      <Text style={styles.status}>{status}</Text>

      {/* MOSTRAR PLATAFORMAS */}
      {plataformas && (
        <View style={styles.platforms}>
          {plataformas.tidal && (
            <Button
              title="Descargar desde Tidal"
              onPress={() => descargarDesdePlataforma(plataformas.tidal!)}
              disabled={loading}
            />
          )}

          {plataformas.soundcloud && (
            <Button
              title="Descargar desde SoundCloud"
              onPress={() =>
                descargarDesdePlataforma(plataformas.soundcloud!)
              }
              disabled={loading}
            />
          )}

          {plataformas.amazon && (
            <Button
              title="Descargar desde Amazon Music"
              onPress={() =>
                descargarDesdePlataforma(plataformas.amazon!)
              }
              disabled={loading}
            />
          )}</View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
  },
  status: {
    marginTop: 15,
    textAlign: "center",
  },
  platforms: {
    marginTop: 20,
    gap: 10,
  },
});
