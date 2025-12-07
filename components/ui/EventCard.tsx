import { View, Text, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';

export interface EventCardProps {
  title: string;
  date: string;
  location: string;
  onPress?: () => void;
}

export const EventCard = ({ title, date, location, onPress }: EventCardProps) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>{date}</Text>
      <Text style={styles.text}>{location}</Text>

      <View style={styles.buttonContainer}>
        <Button label="Sign up" onPress={onPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgb(109, 42, 254)',
    backgroundColor: 'rgba(183, 152, 250, 0.27)',
    width: 300,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
    color: 'rgba(32, 13, 243, 0.81)'
  },
  text: {
    fontSize: 14,
    marginBottom: 4,
    color: 'rgba(32, 13, 243, 0.81)'
  },
  buttonContainer: {
    marginTop: 12,
    color: 'rgba(32, 13, 243, 0.81)'
  },
});
