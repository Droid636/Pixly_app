import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  text: string;
  backgroundColor: string;
  textColor?: string;
  iconLetter: string; // "G" o "f"
  onPress: () => void;
};

const SocialButton = ({ text, backgroundColor, textColor = '#fff', iconLetter, onPress }: Props) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.text, { color: textColor }]}>
        <Text style={{ fontWeight: 'bold' }}>{iconLetter}</Text> {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 15,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
  },
});

export default SocialButton;
