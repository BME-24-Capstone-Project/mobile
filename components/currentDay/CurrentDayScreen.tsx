import { faCircleInfo, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React = require("react");
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Card, Icon, IconButton, Switch} from "react-native-paper";

export const CurrentDayScreen = ({navigation, route}) => {

  const [wantsFeedback, setWantsFeedback] = React.useState(true);

  const exercises = [
    {
      name: "One legged stair climb",
      description: "Description here",
      repetitions: 10,
      sets: 3,
    },
    {
      name: "Sit to stand",
      description: "Description here",
      repetitions: 10,
      sets: 3,
    },
    {
      name: "Walking",
      description: "Description here",
      distance: "2 km"
    },
  ]

  const exerciseList = exercises.map(exercise =>
    <View style={styles.exerciseListItem} key={exercise.name}>
      <View style={styles.exerciseListItemDetailsContainer}>
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        {exercise.sets && <Text style={styles.exerciseDetails}>Sets: {exercise.sets}</Text>}
        {exercise.repetitions && <Text style={styles.exerciseDetails}>Repetitions: {exercise.repetitions}</Text>}
        {exercise.distance && <Text style={styles.exerciseDetails}>Distance: {exercise.distance}</Text>}
      </View>
      <TouchableOpacity style={styles.exerciseListItemHelpContainer} onPress={() => console.log('Pressed')}>
        <FontAwesomeIcon size={40} icon={ faCircleInfo } />
        <Text style={styles.helpIconText}>Help</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.exerciseHeaderText}>Session Options:</Text>
        </View>
        <View style={styles.sessionOptionsList}>
          <View style={styles.sessionOptionsItem}>
            <Text style={styles.exerciseDetails}>Receive feedback on exercise form?</Text>
            <Switch value={wantsFeedback} onValueChange={() => setWantsFeedback(!wantsFeedback)}></Switch>
          </View>
        </View>
        <View style={styles.headerContainer}>
          <Text style={styles.exerciseHeaderText}>Your Exercises:</Text>
        </View>
        <View style={styles.exerciseList}>
        {exerciseList}
        </View>
        <View style={styles.startExerciseButtonContainer}>
          <Button 
            style={styles.startExerciseButton}  
            mode="contained" 
            buttonColor="green"  
            onPress={() => console.log("Start Exercies")}
          > 
            Start Session 
          </Button>
        </View>
        
      </View>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    justifyContent: 'flex-start',
    width: '100%',
    paddingLeft: 20,
  },
  exerciseHeaderText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  startExerciseButton: {
    padding: 5,
  },
  startExerciseButtonContainer: {
    width: '100%', 
    paddingLeft: 10,
    paddingRight: 10,
  },
  exerciseList: {
    padding: 10,
    width: '100%',
  },
  exerciseListItem: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: -3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  exerciseListItemHelpContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    gap: 5,
  },
  exerciseListItemDetailsContainer: {
    flex: 3,
    gap: 5,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  exerciseDetails: {
    fontSize: 16,
  },
  helpIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sessionOptionsList: {
    padding: 10,
    width: '100%',
  },
  sessionOptionsItem: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: -3, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    backgroundColor: 'white',
  }

});
