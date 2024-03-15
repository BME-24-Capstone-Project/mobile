import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button, Modal, Portal, Switch, useTheme} from "react-native-paper";
import YoutubeIframe from "react-native-youtube-iframe";
import { GlobalStyles } from "../../common/data-types/styles";
import { styles } from "./CurrentDayScreenStyles";

export const CurrentDayScreen = ({navigation, route}: {navigation: any, route: any}) => {
  const theme = useTheme()
  const [exercises, setExercises] = useState<AssignedExercise[]>()
  const [session, setSession] = useState<Session>()
  const [wantsFeedback, setWantsFeedback] = useState(true);
  const [visible, setVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<AssignedExercise>()
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  let exerciseList = undefined;

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

  const startOrContinueSession = () => {
    navigation.navigate('ExerciseInProgressScreen')
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
          <Text style={GlobalStyles.appHeadingText}>{exercise.exercise.name}</Text>
          {(exercise.num_sets && exercise.num_sets > 1) && <Text style={GlobalStyles.appParagraphText}>Sets: {exercise.num_sets}</Text>}
          {(exercise.num_reps && exercise.num_reps > 1) && <Text style={GlobalStyles.appParagraphText}>Repetitions: {exercise.num_reps}</Text>}
          {exercise.distance && <Text style={GlobalStyles.appParagraphText}>Distance: {exercise.distance}m</Text>}
        </View>
        <TouchableOpacity style={styles.exerciseListItemHelpContainer} onPress={() => {
          setSelectedExercise(exercise)
          showModal()
        }}>
          <FontAwesomeIcon size={40} icon={ faCircleInfo } />
          <Text style={GlobalStyles.appParagraphText}>More Info</Text>
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
            <View style={{gap: 5}}>
              <Text style={GlobalStyles.appSubHeadingText}>Physiotherapist's Notes:</Text>
              <Text style={GlobalStyles.appParagraphText}>{assignedExercise.note}</Text>
            </View>
            )}
          </View>
          <Button
            // style={styles.closeModalButton}
            mode="contained" 
            buttonColor='red'
            onPress={() => hideModal()}
          >
            <Text style={GlobalStyles.buttonText}>
              Close Modal
            </Text>
          </Button>
        </Modal>
      </Portal>
    ) 
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.appHeadingText}>Session Options:</Text>
        </View>
        <View style={styles.sessionOptionsList}>
          <View style={styles.sessionOptionsItem}>
            <Text style={GlobalStyles.appParagraphText}>Receive feedback on exercise form?</Text>
            <Switch value={wantsFeedback} onValueChange={() => setWantsFeedback(!wantsFeedback)}></Switch>
          </View>
        </View>
        <View style={styles.headerContainer}>
          <Text style={GlobalStyles.appHeadingText}>Your Exercises:</Text>
        </View>
        <View style={styles.exerciseList}>
          {exerciseList ? exerciseList : <Text>No assigned exercies</Text>}
        </View>
        <View style={styles.startExerciseButtonContainer}>
          <Button 
            style={styles.startExerciseButton}  
            mode="contained" 
            buttonColor={theme.colors.primary}
            onPress={startOrContinueSession}
          > 
            <Text style={GlobalStyles.buttonText}>
              {session ? "Start Session": "Continue Session"}
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



