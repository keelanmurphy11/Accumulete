import { Text, View } from '@/components/Themed';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { Pressable } from 'react-native-gesture-handler';
import { supabase } from '../../services/supabase';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams(); // Grabs the ID from the URL, what ever is in the [id] position in the URL will be stored in variable id, Will morph the page for each exercise.
  const router = useRouter(); // Used for navigation actions like going back.
  const [exercise, setExercise] = useState<any>(null); //exercise starts as null, can only be modified by setExercise. <any> is called a generic type, it means exercise can be any type of data.
  const [loading, setLoading] = useState(true); // Loading state to show a spinner while fetching data.

  useEffect(() => {
    fetchExerciseDetails();
  }, [id]); //ID is a dependency, so if the ID changes, the effect runs again.

  async function fetchExerciseDetails() {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*')
        .eq('id', id)
        .single(); // .single() ensures we get one object, not an array

      if (error) throw error;
      setExercise(data);
    } catch (e: any) {
      Alert.alert("Error", e.message);
      router.back(); // Send them back if the exercise doesn't exist
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />; //loading icon



  function showManageMenu() {

  }

  async function handleDelete() {
    Alert.alert(
      "Delete Exercise",
      "Are you sure you want to delete this exercise? This will remove the exercise and its associated data from your library. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", style: "destructive", onPress: async () => {
            try {
              const { error } = await supabase
                .from('exercises')
                .delete()
                .eq('id', id); 
                
              if (error) throw error;

              router.back(); // Go back to the previous screen after deletion
            } catch (error: any) {
              Alert.alert("Error", error.message);
            }
          }
        }
      ]
    );
  }

  

  


  return (
    <View style={styles.container}>
      {/* Tries to set the screen title to the exercise name, but if the name is missing/ hasn't arrived yet, it defaults to 'Details' */}
      <Stack.Screen options={{ title: exercise?.name || 'Details' }} /> 

      <View style={styles.header}>
        <Text style={styles.title}>{exercise?.name}</Text>  {/*exercise?.name means it will only try to access name if exercise is not null or undefined */}
        <Text style={styles.subtitle}>{exercise?.muscle_group}</Text>
      </View>

      <View style={styles.content}>
        <Text style={{ color: '#888' }}>History and Personal Bests will go here...</Text>
      </View>

      {/*management actions: */} 
      <Pressable 
        style = {({ pressed }) => [
          styles.deleteButton,
          { backgroundColor: pressed ? '#fa6565ff' : 'transparent' }// Subtle red flash when tapped
        ]}
          onPress={showManageMenu}
      >
        <Text style={styles.deleteText}>Manage Exercise</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 30, marginTop: 20 },
  title: { fontSize: 32, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: '#888', marginTop: 5 },
  content: { flex: 1 },
  deleteButton: { padding: 20, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#333' },
  deleteText: { color: '#FF3B30', fontWeight: '600' }
});