import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Portal, ProgressBar, Switch} from "react-native-paper";

export const ExerciseInProgressScreen = ({navigation, route}) => {

  const [currentExercise, setCurrentExercise] = useState<any>(undefined)



  const exercises = [
    {
      name: "One Legged Stair Climb",
      description: "Description here",
      repetitions: 10,
      notes: "Physiotherapists notes",
      sets: 3,
    },
    {
      name: "Sit to Stand",
      description: "Description here",
      repetitions: 10,
      sets: 3,
      helpVideoID: "y6NUWq_AEvI"
    },
    {
      name: "Walking",
      description: "Description here",
      distance: "2 km",
      notes: "Physiotherapists notes",
    },
  ]

  let total = 0
  for (const exercise in exercises) {
      exercise.sets ? total += exercise.sets : total += 1;
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
            <ProgressBar progress={0.5} color={"green"} style={{height: 15}}/>
        </View>
        <View style={styles.contentContainer}>
          <Text>Body</Text>
        </View>
        <View style={styles.footerContainer}>
            <View style={styles.startExerciseButtonContainer}>
              <Button 
                style={styles.startExerciseButton}  
                mode="contained" 
                buttonColor="green"  
                onPress={() => navigation.navigate('ExerciseInProgressScreen')}
              > 
                <Text style={styles.startExerciseButtonText}>
                  Start Set 
                </Text>
              </Button>
            </View>
            <View style={styles.startExerciseButtonContainer}>
              <Button 
                style={styles.startExerciseButton}  
                mode="contained" 
                buttonColor="red"  
                onPress={() => navigation.navigate('ExerciseInProgressScreen')}
              > 
                <Text style={styles.startExerciseButtonText}>
                  Cancel Session 
                </Text>
              </Button>
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 15,
    },
    headerContainer: {
        width: '100%',
    },
    contentContainer: {
        width: '100%'
    },
    footerContainer: {
        width: '100%',
        gap: 5,
    },
    startExerciseButton: {
        padding: 5,
    },
    startExerciseButtonContainer: {
        width: '100%', 
        paddingLeft: 10,
        paddingRight: 10,
    },
    startExerciseButtonText: {
        fontSize: 20,
    },
});
  