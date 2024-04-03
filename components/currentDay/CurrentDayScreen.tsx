import { faCircleInfo, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button, Dialog, Modal, Portal, Switch, useTheme} from "react-native-paper";
import YoutubeIframe from "react-native-youtube-iframe";
import { Colors, GlobalStyles } from "../../common/data-types/styles";
import { styles } from "./CurrentDayScreenStyles";
import { BaseURL, Manager } from "../../common/common";
import { useBluetooth } from "../providers/bluetooth";

export const CurrentDayScreen = ({navigation, route}: {navigation: any, route: any}) => {

  const theme = useTheme()
  const [exercises, setExercises] = useState<AssignedExercise[]>()
  const [session, setSession] = useState<Session>()
  const [wantsFeedback, setWantsFeedback] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dayFinished, setDayFinished] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<AssignedExercise>()
  
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);
  let exerciseList = undefined;

  useEffect(() => {
    loadExercises()
    loadSession()
  }, [])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadSession()
    });

    return unsubscribe;
  }, [navigation]);

  const loadExercises = () => {
    axios.get(`${BaseURL}/assigned_exercises`).then((response: any) => {
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
      navigation.navigate('ExerciseInProgressScreen', {session_id: session.id, wants_feedback: wantsFeedback})
    } else {
      axios.post(`${BaseURL}/sessions`, {}).then((response: any) => {
        setSession(response.data.data)
        console.log(`SESSION ID NEW: ${response.data.data.id}`)
        console.log('Session Created')
        navigation.navigate('ExerciseInProgressScreen', {session_id: response.data.data.id, wants_feedback: wantsFeedback})
      }).catch((error: any) => {
        console.log('Error creating Session: ')
        console.log(error)
      })
    }
  }

  const deleteSession = () => {
    axios.delete(`${BaseURL}/sessions/${session?.id}`, {}).then((response: any) => {
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
    axios.get(`${BaseURL}/sessions`).then((response: any) => {
      console.log(response.data)
      if (!response.data.error) {
        console.log('Session Found')
        setSession(response.data.data)
      } else {
        setSession(undefined)
      }
    
    }).catch((error: any) => {
      console.log('Error finding Session: ')
      console.log(error)
    })

    //uncomment this to prevent users form doing multiple sessions in a day.
    // axios.get(`${BaseURL}/sessions/recent`).then((response: any) => {
    //   if (!response.data.error) {
    //     console.log('Recently complete session Found')
    //     setSession(undefined)
    //     setDayFinished(true)
    //   }
    // }).catch((error: any) => {
    //   console.log('Error finding recently completed session: ')
    //   console.log(error)
    // })
  }
  
  if (exercises) {
    exerciseList = exercises.map(exercise =>
      <View style={styles.exerciseListItem} key={exercise.exercise.name}>
        <View style={styles.exerciseListItemDetailsContainer}>
          <Text style={GlobalStyles.appHeadingText}>{exercise.exercise.name}</Text>
          {(exercise.num_sets && exercise.num_sets > 0) && <Text style={GlobalStyles.appParagraphText}>Sets: {exercise.num_sets}</Text>}
          {(exercise.num_reps && exercise.num_reps > 0) && <Text style={GlobalStyles.appParagraphText}>Repetitions: {exercise.num_reps}</Text>}
          {exercise.distance && <Text style={GlobalStyles.appParagraphText}>Distance: {exercise.distance}m</Text>}
          <View style={styles.youtubePlayerContainer}>
            {exercise.exercise.video_id && (
              <YoutubeIframe
                height={200}
                play={playing}
                videoId={exercise.exercise.video_id}
              />
            )}
            {exercise.note && (
            <View style={{gap: 5}}>
              <Text style={GlobalStyles.appSubHeadingText}>Physiotherapist's Notes:</Text>
              <Text style={GlobalStyles.appParagraphText}>{exercise.note}</Text>
            </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            {dayFinished &&
              <View style={styles.sessionOptionsList}>
                <View style={{...styles.sessionOptionsItem, backgroundColor: 'green', height: 50}}>
                  <Text style={{...GlobalStyles.appSubSubHeadingText, color: Colors.tertiary, textAlign: 'center' }}>Session completed! You're done for the day.</Text>
                </View>
              </View>
            }
          </View>
          <View style={styles.contentContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{padding: 10}} style={styles.scrollView}>
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
            </ScrollView>
          </View>
        <View style={GlobalStyles.footerContainer}>
          <Button 
            style={GlobalStyles.button}  
            mode="contained"
            disabled={dayFinished}
            buttonColor={theme.colors.primary}
            onPress={startOrContinueSession}
          > 
            <Text style={GlobalStyles.buttonText}>
              {session ? "Continue Session": "Start Session"}
            </Text>
          </Button>
          {session && (
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
          )}
        </View>
      </View>
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
    </SafeAreaView>
  );
};



