import {PhraseInterface} from '../logic/playerLogic.ts';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../logic/constants.ts';

type PhraseProps = PhraseInterface & { isSelected?: boolean, onPress: () => void }

export function Phrase({speaker, words, isSelected, onPress}: PhraseProps) {
  const textStyles = {color: isSelected ? COLORS.main : 'black'} as const;
  const alignmentStyles = {textAlign: speaker === 'John' ? 'left' : 'right'} as const;
  const backgroundStyles = {backgroundColor: isSelected ? COLORS.secondary : '#FFF'} as const;

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      <Text
        style={[styles.title, textStyles, alignmentStyles]}
      >
        {speaker}
      </Text>
      <View
        style={[styles.textContainer, backgroundStyles]}
      >
        <Text
          style={[styles.phrase, textStyles]}
        >
          {words}
        </Text>
      </View>

      {!isSelected && <View style={styles.border}/>}
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  title: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    fontSize: 15,
    fontFamily: 'Outfit-SemiBold',
  },
  phrase: {
    fontSize: 17,
    fontWeight: 'bold',
    fontFamily: 'Outfit-Bold',
  },
  textContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#f3eef7',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  border: {
    borderTopWidth: 1,
    width: '100%',
    marginTop: -8,
    borderColor: '#F6F6F6',
  },
});
