import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, IconButton, Modal, Portal, Switch} from "react-native-paper";
import YoutubeIframe from "react-native-youtube-iframe";

export const CurrentDayScreen = ({navigation, route}) => {

  const [wantsFeedback, setWantsFeedback] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(undefined)
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

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

  const exerciseList = exercises.map(exercise =>
    <View style={styles.exerciseListItem} key={exercise.name}>
      <View style={styles.exerciseListItemDetailsContainer}>
        <Text style={styles.exerciseTitle}>{exercise.name}</Text>
        {exercise.sets && <Text style={styles.exerciseDetails}>Sets: {exercise.sets}</Text>}
        {exercise.repetitions && <Text style={styles.exerciseDetails}>Repetitions: {exercise.repetitions}</Text>}
        {exercise.distance && <Text style={styles.exerciseDetails}>Distance: {exercise.distance}</Text>}
      </View>
      <TouchableOpacity style={styles.exerciseListItemHelpContainer} onPress={() => {
        setSelectedExercise(exercise)
        showModal()
      }}>
        <FontAwesomeIcon size={40} icon={ faCircleInfo } />
        <Text style={styles.helpIconText}>More Info</Text>
      </TouchableOpacity>
    </View>
  )   

  const HelpModal = ({exercise}) => {
    
    const [playing, setPlaying] = useState(false);

    return ( 
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainerStyle}>
        <TouchableOpacity onPress={() => hideModal()}>
          <FontAwesomeIcon size={30} icon={ faXmark }/>
        </TouchableOpacity>
        <View style={styles.youtubePlayerContainer}>
          {exercise.helpVideoID && (
            <YoutubeIframe
              height={300}
              play={playing}
              videoId={exercise.helpVideoID}
            />
          )}
        </View>
          
         {exercise.notes && <Text>Physiotherapist's Notes: {exercise.notes}</Text>}
       </Modal>
      </Portal>
    ) 
  }
  

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
            onPress={() => navigation.navigate('ExerciseInProgressScreen')}
          > 
            <Text style={styles.startExerciseButtonText}>
              Start Session 
            </Text>
          </Button>
        </View>
      </View>
      {selectedExercise && (
        <HelpModal exercise={selectedExercise}/>
      )}
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
  },
  modalContainerStyle: {
    backgroundColor: 'white', 
    padding: 10,
    width:'90%',
    alignSelf: 'center',
  },
  youtubePlayerContainer: {
    padding: 10,
  },
  startExerciseButtonText: {
    fontSize: 20,
  },
});
