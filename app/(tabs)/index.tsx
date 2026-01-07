
import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react'; //useState = for memory, useEffect = for Timing (run after screen appears etc)
import { ActivityIndicator, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../../services/supabase';

export default function TabOneScreen() {
  const [exercises, setExercises] = useState<any[]>([]); // State to hold exercise data, only can be modified by setExercises
  const [loading, setLoading] = useState(true); // State to manage loading indicator
  const [isAdding, setIsAdding] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');//Initial value is empty string
  



  useEffect(() => { //lifecycle hook, empty array means it runs once when screen loads
    fetchExercises();
  }, []);



  async function fetchExercises() { //async and await tells the ohone to wait for the internet to respond without freezing the screen.
    try {
      const { data, error } = await supabase.from('exercises').select('*'); //select all from exercises table, the data and error are destructured from the response. The response will be almost like an object with a data and object field. This will take the data and error field and make them into their own variables.
      if (error) throw error;
      setExercises(data || []); //update state with fetched data, the || [] ensures that if data is null or undefined, an empty array is used instead. <- Defensive programming
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); //stop loading indicator
    }
  }

  if (loading) { //show loading indicator while fetching data
    return <ActivityIndicator style={{ flex: 1 }} size="large" />; 
  }




  async function addExercise() {
    //Simple validation
    if (newExerciseName.trim().length === 0) return;

    setIsAdding(true); // Let the UI know we are working

    try {
      //Database call
      const { error } = await supabase
        .from('exercises')
        .insert([{ 
          name: newExerciseName.trim(), 
          muscle_group: 'Full Body' 
        }]);

      
      if (error) throw error; // We manually "throw" this so it gets handled by the catch block below
      

      // 4. Success Logic
      setNewExerciseName(''); 
      await fetchExercises(); // Refresh the list
      
    } catch (error: any) { //error: any = Typescript syntax to tell the compiler to not worry about the type of error. Techincally anything can be thrown in JS, so any disables type checking for this variable.
      console.error("Critical Error adding exercise:", error.message);
      alert(error.message);
    } finally {
      //Reset UI regardless of success or failure
      setIsAdding(false);
    }
  }





  async function deleteExercise(id: string) { //an asynchronous function is one that allows your program to continue running other tasks instead of waiting for it to finish a potentially long operation 
    const { error } = await supabase.from('exercises').delete().eq('id', id);
    if (error) {
      console.error("Error deleting:", error.message);
      alert("Could not delete exercise.");
    } else {
      fetchExercises();
    }
  }





  async function updateExercise(id: string, newName: string) {
    const { error } = await supabase
      .from('exercises')
      .update({ name: newName })
      .eq('id', id);
    if (error) {
      console.error("Error updating:", error.message);
      alert("Could not update exercise.");
    } else {
      fetchExercises();
    }
  }




  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Library</Text>

      {/* Input field and button to add new exercise */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input} 
          placeholder="New exercise (e.g. Squat)"
          placeholderTextColor="#888"
          value={newExerciseName}
          onChangeText={setNewExerciseName}
        />
        <TouchableOpacity style={styles.button} onPress={addExercise}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>



      <FlatList //Scrollable list component
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/exercise/${item.id}`} asChild>
            <TouchableOpacity style={styles.exerciseCard}>
              <View style={styles.cardTextContainer}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseDetail}>{item.muscle_group}</Text>
              </View>
              <Text style={{ color: '#888' }}>:</Text>
            </TouchableOpacity>
          </Link>
        )}
        style={{ width: '100%' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '100%',
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  exerciseDetail: {
    fontSize: 14,
    color: '#888',
  },
  inputContainer: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    gap: 10 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#1c1c1e', 
    color: '#fff', 
    padding: 12, 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333' 
  },
  button: { 
    backgroundColor: '#007AFF', 
    padding: 12, 
    borderRadius: 8, 
    justifyContent: 'center' 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  cardTextContainer: {
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
  
});