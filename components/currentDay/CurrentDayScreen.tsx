import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Modal, Portal, Switch, useTheme} from "react-native-paper";
import YoutubeIframe from "react-native-youtube-iframe";
import { Colors, GlobalStyles } from "../../common/data-types/styles";
import { styles } from "./CurrentDayScreenStyles";

export const CurrentDayScreen = ({navigation, route}: {navigation: any, route: any}) => {
  const theme = useTheme()
  const [exercises, setExercises] = useState<AssignedExercise[]>()
  const [session, setSession] = useState<Session>()
  const [wantsFeedback, setWantsFeedback] = useState(true);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedExercise, setSelectedExercise] = useState<AssignedExercise>()
  const showHelpModal = () => setHelpModalVisible(true);
  const hideHelpModal = () => setHelpModalVisible(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  let exerciseList = undefined;

  useEffect(() => {
    loadExercises()
    loadSession()
  }, [])

  const loadExercises = () => {
    axios.get(`http://localhost:8080/assigned_exercises`).then((response: any) => {
      console.log("Assigned Exercises Loaded")
      setExercises(response.data.data)
    }).catch((error: any) => {
      console.log('Error Loading Assigned Execises: ')
      console.log(error);
    })
  }

  const startOrContinueSession = () => {
    if (session) {
      console.log(`SESSION ID EXISTS: ${session.id}`)
      navigation.navigate('ExerciseInProgressScreen', {session_id: session.id})
    } else {
      axios.post(`http://localhost:8080/sessions`, {}).then((response: any) => {
        setSession(response.data.data)
        console.log(`SESSION ID NEW: ${response.data.data.id}`)
        console.log('Session Created')
        navigation.navigate('ExerciseInProgressScreen', {session_id: response.data.data.id})
      }).catch((error: any) => {
        console.log('Error creating Session: ')
        console.log(error)
      })
    }
  }

  const deleteSession = () => {
    axios.delete(`http://localhost:8080/sessions/${session?.id}`, {}).then((response: any) => {
        console.log('Session Deleted')
        setSession(undefined)
        hideDialog()
      }).catch((error: any) => {
        console.log('Error Deleting Session: ')
        console.log(error)
        hideDialog()
      })
  }

  const loadSession = () => {
    axios.get(`http://localhost:8080/sessions`).then((response: any) => {
      if (!response.data.error) {
        console.log('Session Found')
        setSession(response.data.data)
      }
    }).catch((error: any) => {
      console.log('Error finding Session: ')
      console.log(error)
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
          showHelpModal()
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
        <Modal visible={helpModalVisible} onDismiss={hideHelpModal} contentContainerStyle={styles.modalContainerStyle}>
          <TouchableOpacity onPress={hideHelpModal}>
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
            mode="contained" 
            buttonColor='red'
            onPress={hideHelpModal}
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
        <View style={{width: '100%', paddingTop: '10%'}}>
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
        </View>
        <View style={GlobalStyles.footerContainer}>
          <Button 
            style={GlobalStyles.button}  
            mode="contained" 
            buttonColor={theme.colors.primary}
            onPress={startOrContinueSession}
          > 
            <Text style={GlobalStyles.buttonText}>
              {session ? "Continue Session": "Start Session"}
            </Text>
          </Button>
          {session && (
            <>
              <Button 
                style={GlobalStyles.button}  
                mode="contained" 
                buttonColor="red"  
                onPress={showDialog}
              > 
                <Text style={GlobalStyles.buttonText}>
                  Cancel Session 
                </Text>
              </Button>
              <Portal>
                <Dialog visible={dialogVisible} style={{backgroundColor: Colors.secondary}} onDismiss={hideDialog}>
                  <Dialog.Title>Are you sure?</Dialog.Title>
                  <Dialog.Content>
                    <Text style={GlobalStyles.appParagraphText}>Are you sure you would like to cancel your current session?</Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={deleteSession}>
                      <Text style={{
                        ...GlobalStyles.appSubHeadingText,
                        color: "red",
                      }}>
                        Yes
                      </Text>
                    </Button>
                    <Button onPress={hideDialog}>
                      <Text style={GlobalStyles.appSubHeadingText}>
                        No
                      </Text>
                    </Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </>
          )}
        </View>
      </View>
      {selectedExercise && (
        <HelpModal assignedExercise={selectedExercise}/>
      )}
    </SafeAreaView>
  );
};



