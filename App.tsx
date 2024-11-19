import {SafeAreaView, ScrollView, StyleSheet, useWindowDimensions, View} from 'react-native';
import { useRef, useState} from 'react';
import SoundPlayer, {SoundPlayerRef} from './components/SoundPlayer.tsx';
import {playerLogic, PhraseInterface} from './logic/playerLogic.ts';
import { Phrase } from './components/Phrase.tsx';
import {COLORS} from './logic/constants.ts';
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';

function App() {
  const {top, bottom} = useSafeAreaInsets();
  const soundPlayerRef = useRef<SoundPlayerRef>(null);
  const {height, width} = useWindowDimensions();
  const [selectedPhrase, setSelectedPhrase] = useState<PhraseInterface>();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={{ backgroundColor: COLORS.secondaryLight, width: '100%', height: height * 0.03, borderBottomWidth: 1, borderColor: COLORS.secondary }} />

        <LinearGradient
          colors={['rgba(194,195,203,0.32)', 'transparent']}
          style={{
            position: 'absolute',
            right: 0,
            top: top + height * 0.03,
            height: height * 0.07,
            width,
            zIndex: 999,
          }}
        />


        <LinearGradient
          colors={['transparent', 'rgba(194,195,203,0.24)']}
          style={{
            position: 'absolute',
            right: 0,
            bottom: bottom + 100,
            height: height * 0.07,
            width,
            zIndex: 999,
          }}
        />

        <ScrollView style={styles.scrollContainer}>
          {playerLogic.phrases.map((phrase, index) => {
            const isSelected = selectedPhrase && playerLogic.comparePhrase(phrase, selectedPhrase);
            return (
              <Phrase
                key={index}
                isSelected={isSelected}
                onPress={() => {
                  setSelectedPhrase(phrase); // Set the selected phrase
                  if (soundPlayerRef.current) {
                    soundPlayerRef.current.play(phrase.startTime); // Play from the phrase start time
                  }
                }}
                {...phrase}
              />
            );
          })}
        </ScrollView>

        <SoundPlayer
          ref={soundPlayerRef}
          onFinish={() => {
            setSelectedPhrase(undefined); // Clear the selected phrase
          }}
          onChange={(positionMillis) => {
            const currentPhrase = playerLogic.phrases[playerLogic.findIntervalIndex(positionMillis)];
            if (currentPhrase && (!selectedPhrase || !playerLogic.comparePhrase(currentPhrase, selectedPhrase))) {
              setSelectedPhrase(currentPhrase);
            }
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.secondaryLight },
  scrollContainer: { flex: 1, paddingHorizontal: 16, backgroundColor: '#fafafa' },
});

export default App;
