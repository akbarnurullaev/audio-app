import React, {useState, useEffect, forwardRef, useImperativeHandle} from 'react';
import {View, Text, StyleSheet, useWindowDimensions, TouchableOpacity, Image} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Sound} from 'expo-av/build/Audio/Sound';
import {Audio} from 'expo-av';
import {playerLogic} from '../logic/playerLogic.ts';

const INTERVAL = 10;

export interface SoundPlayerRef {
  play: (position?: number) => Promise<void>;
  pause: () => Promise<void>;
}

export interface SoundPlayerProps {
  onChange: (positionMillis: number) => void;
  onFinish: () => void;
}

const SoundPlayer = forwardRef<SoundPlayerRef, SoundPlayerProps>(({onChange, onFinish}, ref) => {
  const { width } = useWindowDimensions();

  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMillis, setPositionMillis] = useState(0);
  const [durationMillis, setDurationMillis] = useState<number>();
  const [sound, setSound] = useState<Sound>();

  const progress = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({width: progress.value}));

  const {rewind, forward} = playerLogic;

  async function play(position?: number) {
    if (sound) {
      await sound.playFromPositionAsync(position ?? positionMillis ?? 0); // Resume from current position
      setIsPlaying(true);
    }
  }

  async function pause() {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  }

  useImperativeHandle(ref, () => ({
    play,
    pause,
  }));

  useEffect(() => {
    if (sound && isPlaying) {
      const interval = setInterval(async () => {
        if (sound) {
          const status = await sound.getStatusAsync();
          if (status.isLoaded) {
            setPositionMillis(status.positionMillis);
            progress.value = withTiming(
              (status.positionMillis / (status.durationMillis || 1)) * (width + 5),
              { duration: INTERVAL }
            );
            onChange(status.positionMillis);
          }
        }
      }, INTERVAL);

      return () => clearInterval(interval);
    }
  }, [sound, isPlaying, durationMillis, progress, width, onChange]);

  useEffect(() => {
    return sound
      ? () => {
        sound.unloadAsync();
      }
      : undefined;
  }, [sound]);

  useEffect(() => {
    (async () => {
      if (!durationMillis) {
        const { sound } = await Audio.Sound.createAsync(require('../assets/example_audio.mp3'));
        setSound(sound);

        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          setDurationMillis(status?.durationMillis || 1);
        }

        sound!.setOnPlaybackStatusUpdate((status) => {
          if (status.isLoaded && status.didJustFinish) {
            setIsPlaying(false);
            setPositionMillis(0);
            progress.value = withTiming(0);
            onFinish();
          }
        });
      }
    })();
  }, []);

  return (
    <View style={{height: 100}}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text
          style={{
            color: '#00000080',
            fontSize: 12,
            fontFamily: 'Outfit-SemiBold',
          }}
        >
          {formatTime(positionMillis)}
        </Text>
        <Text
          style={{
            color: '#00000080',
            fontSize: 12,
            fontFamily: 'Outfit-SemiBold',
          }}
        >
          {formatTime(durationMillis ?? 0)}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={ () => {
            console.log('WEFEF');
            play(rewind(positionMillis));
          }}
        >
          <Image style={{width: 20, height: 20}} source={require('../assets/rewind.png')}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            if (isPlaying) {
              await pause();
            } else {
              await play();
            }
          }}
          style={{
            backgroundColor: '#e0e2fa',
            width: 50,
            height: 50,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 32,
          }}
        >
          <Image style={{width: 30, height: 30}} source={require('../assets/play.png')}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={ () => {
            play(forward(positionMillis));
          }}
        >
          <Image style={{width: 20, height: 20}} source={require('../assets/fast-forward.png')}/>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 10,
    backgroundColor: 'rgba(135,148,255,0.51)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'rgba(219,166,4,0.6)',
    borderEndEndRadius: 5,
    borderStartEndRadius: 5,
  },
});

export default SoundPlayer;
