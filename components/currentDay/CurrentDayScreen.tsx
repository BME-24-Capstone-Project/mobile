import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Switch} from "react-native-paper";
import YoutubeIframe from "react-native-youtube-iframe";

export const CurrentDayScreen = ({navigation, route}) => {
  const [exercises, setExercises] = useState<AssignedExercise[]>()
  const [session, setSession] = useState<Session>()
  const [wantsFeedback, setWantsFeedback] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<AssignedExercise>()
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  let exerciseList = undefined;


  // Pull assigned_exercises
  // Pull current session if it exists/ otherwise create one. 
  // Update wantsFeedback here

  useEffect(() => {
    loadExercises()
    loadSession()
  }, [])

  const loadExercises = () => {
    axios.get(`http://localhost:8080/assigned_exercises`).then((response: any) => {
      setExercises(response.data.data)
    }).catch((error: any) => {
      console.log(error);
      Alert.alert(
        'Error Fetching Assigned Exercises',
        error,
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    })
  }

  const loadSession = () => {
    axios.get(`http://localhost:8080/sessions`).then((response: any) => {
      if (!response.error) {
        setSession(response.data.data)
      } else {
        // TODO: Move to separate function
        // axios.post(`http://localhost:8080/sessions`, {}).then((response: any) => {
          
        // }).catch((error: any) => {
        //   console.log(error)
        // })
      }
    }).catch((error: any) => {
      console.log(error);
      Alert.alert(
        'Error Fetching Session',
        error,
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
        },
      );
    })
  }
  
  if (exercises) {
    exerciseList = exercises.map(exercise =>
      <View style={styles.exerciseListItem} key={exercise.exercise.name}>
        <View style={styles.exerciseListItemDetailsContainer}>
          <Text style={styles.exerciseTitle}>{exercise.exercise.name}</Text>
          {(exercise.num_sets && exercise.num_sets > 1) && <Text style={styles.exerciseDetails}>Sets: {exercise.num_sets}</Text>}
          {(exercise.num_reps && exercise.num_reps > 1) && <Text style={styles.exerciseDetails}>Repetitions: {exercise.num_reps}</Text>}
          {exercise.distance && <Text style={styles.exerciseDetails}>Distance: {exercise.distance}m</Text>}
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
  }


  const HelpModal = ({assignedExercise}: {assignedExercise: AssignedExercise}) => {
    
    const [playing, setPlaying] = useState(false);

    return ( 
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainerStyle}>
        <TouchableOpacity onPress={() => hideModal()}>
          <FontAwesomeIcon size={30} icon={ faXmark }/>
        </TouchableOpacity>
        <View style={styles.youtubePlayerContainer}>
          {assignedExercise.exercise.video_id && (
            <YoutubeIframe
              height={200}
              play={playing}
              videoId={assignedExercise.exercise.video_id}
            />
          )}
          {assignedExercise.note && (
          <>
            <Text style={styles.physioHeaderText}>Physiotherapist's Notes:</Text>
            <Text>{assignedExercise.note}</Text>
          </>
          )}
        </View>
         
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
          {exerciseList ? exerciseList : <Text>No assigned exercies</Text>}
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
        <HelpModal assignedExercise={selectedExercise}/>
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
  physioHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 10,
  }
});
