import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { db, auth } from '../config/firebaseConfig';
import { ref, onValue, update } from 'firebase/database';

const fases = [
  { nome: 'Porao', imagem: require('../assets/Porao.gif') },
  { nome: 'Apartamento', imagem: require('../assets/apartamento.gif') },
  { nome: 'Empresa', imagem: require('../assets/empresa.gif') }
];

export default function GameScreen() {
  const [btc, setBtc] = useState(0);
  const [btcPorClique, setBtcPorClique] = useState(1);
  const [faseAtual, setFaseAtual] = useState(0);
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      const userRef = ref(db, 'usuarios/' + user.uid);
      return onValue(userRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setBtc(data.btc || 0);
          setBtcPorClique(data.btcPorClique || 1);
          setFaseAtual(data.faseAtual || 0);
        }
      });
    }
  }, []);

  const handleClick = () => {
    const newBtc = btc + btcPorClique;
    setBtc(newBtc);
    update(ref(db, 'usuarios/' + user.uid), { btc: newBtc });
  };

  const upgrade = () => {
    if (btc >= 50) {
      const novo = btcPorClique + 1;
      update(ref(db, 'usuarios/' + user.uid), {
        btc: btc - 50,
        btcPorClique: novo
      });
    }
  };

  const mudarFase = () => {
    const proxima = (faseAtual + 1) % fases.length;
    update(ref(db, 'usuarios/' + user.uid), { faseAtual: proxima });
  };

  return (
    <ImageBackground source={fases[faseAtual].imagem} style={styles.container}>
      <Text style={styles.text}>BTC: {btc}</Text>
      <TouchableOpacity style={styles.button} onPress={handleClick}>
        <Text style={styles.text}>Hackear</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={upgrade}>
        <Text style={styles.text}>Upgrade (+1 por clique)</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={mudarFase}>
        <Text style={styles.text}>Trocar Fase</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 22, color: '#fff', marginBottom: 10 },
  button: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, marginVertical: 5, borderRadius: 10 }
});