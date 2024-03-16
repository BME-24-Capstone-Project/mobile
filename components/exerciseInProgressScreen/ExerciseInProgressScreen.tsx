import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, ProgressBar} from "react-native-paper";
import { Colors, GlobalStyles } from "../../common/data-types/styles";
import LottieView from "lottie-react-native";

export const ExerciseInProgressScreen = ({navigation, route}: {navigation: any, route: any}) => {
  const session_id = route.params.session_id
  console.log(`sessionid: ${session_id}`)
  const [currentSetAndSessionData, setCurrentSetAndSessionData] = useState<CurrentSetAndSessionData>()
  const [setInProgress, setSetInProgress] = useState<boolean>(false)
  const [countdownInProgress, setCountdownInProgress] = useState<boolean>(false)
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [feedbackFromPrev, setFeedbackFromPrev] = useState<any>()

  // could show previous exercises feedback on next exercise page. 
  useEffect(() => {
    loadCurrentExerciseAndSessionData()
  }, [])

  useEffect(() => {
    if (countdownInProgress) {
      console.log(countdownValue)
        const interval = setInterval(() => {
          setCountdownValue((prevCount) => {
            if (prevCount === 1) {
              () => clearInterval(interval);
              setCountdownInProgress(false);
              return 3
            }
            return prevCount - 1;
          });
        }, 1000);
        return () => clearInterval(interval)
    }
  }, [countdownInProgress]);

  const loadCurrentExerciseAndSessionData = () => {
    axios.get(`http://localhost:8080/exercise_sets/${session_id}`).then((response: any) => {
      setCurrentSetAndSessionData(response.data.data)
    }).catch((error: any) => {
      console.log("Error Getting currentSetAndSessionData")
      console.log(error);
    })
  }

  const startSet = () => {
    setCountdownInProgress(true)
    setSetInProgress(true)
    // tell bluetooth to read data
  }

  const submitSet = () => {
    setSetInProgress(false)
    // pull data from bluetooth
    // submit to DB
    // start loading feedback
    // page should rerender automatically 
  }

  const cancelSet = () => {
    setSetInProgress(false)
    setCountdownInProgress(false)
  }

  const contentContainer = () => {
    if (countdownInProgress) {
      return (<Text style={{...GlobalStyles.appHeadingText, fontSize: 100}}>{countdownValue}</Text>)
    } else if (feedbackFromPrev) {
      //show previous feedback here
    } else if (setInProgress) {
      return (
        <View style={{alignItems: "center", gap: 50}}>
          <LottieView
            source={require('../../assets/exercise-in-progress-animation.json')}
            style={styles.lottie}
            autoPlay
            loop
          />
          <Text style={GlobalStyles.appHeadingText}>Recording...</Text>
        </View>
      )
    } else if (!countdownInProgress && !setInProgress && !feedbackFromPrev) {
      return <Text style={GlobalStyles.appHeadingText}>Press "Start Set" to get started!</Text>
    }
  }

  return (
    <SafeAreaView>
      {currentSetAndSessionData && (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headerItemContainer}>
              <View style={styles.progressBarAndPercentageContainer}>
                <View style={styles.progressBarContainer}>
                  <ProgressBar progress={currentSetAndSessionData?.completed_session_sets/currentSetAndSessionData?.total_session_sets} color={Colors.primary} style={styles.progressBarStyle}/>
                </View>
                <Text style={styles.percentageContainer}>{currentSetAndSessionData?.completed_session_sets*100/currentSetAndSessionData?.total_session_sets} %</Text>
              </View>
            </View>
            <View style={{...styles.headerItemContainer, alignItems:'center', gap: 5}}>
              <Text style={GlobalStyles.appHeadingText}>{currentSetAndSessionData?.assigned_exercise.exercise.name}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={GlobalStyles.appSubHeadingText}>Set: </Text>
                <Text style={GlobalStyles.appLargeParagraphText}>{currentSetAndSessionData?.completed_exercise_sets + 1}/{currentSetAndSessionData.assigned_exercise.num_sets}</Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={GlobalStyles.appSubHeadingText}>Reps: </Text>
                <Text style={GlobalStyles.appLargeParagraphText}>{currentSetAndSessionData.assigned_exercise.num_reps}</Text>
              </View>
              {/* <View style={{flexDirection: 'row'}}>
                <Text style={GlobalStyles.appSubHeadingText}>Up next: </Text>
                <Text style={GlobalStyles.appLargeParagraphText}>{currentSetAndSessionData.assigned_exercise.num_reps}</Text>
              </View> */}
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={{...styles.headerItemContainer, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              {contentContainer()}
            </View>
          </View>
          <View style={GlobalStyles.footerContainer}>
            {setInProgress ? (
              <View style={{gap: 5}}>
                <Button 
                  style={GlobalStyles.button}  
                  mode="contained" 
                  buttonColor={Colors.primary}
                  onPress={submitSet}
                >
                  <Text style={styles.startExerciseButtonText}>
                    Submit Set 
                  </Text>
                </Button>
                <Button 
                  style={GlobalStyles.button}  
                  mode="contained" 
                  buttonColor='red'
                  onPress={cancelSet}
                >
                  <Text style={styles.startExerciseButtonText}>
                    Cancel Set 
                  </Text>
                </Button>
            </View>
            ) : (
              <Button 
                style={GlobalStyles.button}  
                mode="contained"
                disabled={countdownInProgress}
                buttonColor={Colors.primary}
                onPress={startSet}
              >
                <Text style={styles.startExerciseButtonText}>
                  Start Set 
                </Text>
              </Button>
            )}
        </View>
      </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
    container: {
        ...GlobalStyles.container,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    headerContainer: {
      width: '100%',
      justifyContent:'flex-start',
      gap: 10,
    },
    headerItemContainer: {
        width: '100%',
        borderRadius: 8,
        backgroundColor: Colors.tertiary,
        shadowColor: '#171717',
        shadowOffset: {width: -3, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        paddingLeft: 10,
        paddingTop: 10,
        paddingBottom: 10,
    },
    progressBarStyle: {
      height: 15,
      width: '100%',
      backgroundColor: Colors.secondary,
      borderWidth: 1,
      borderColor: Colors.primary,
    },
    progressBarAndPercentageContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    progressBarContainer: {
      flex: 8,
    },
    percentageContainer: {
      ...GlobalStyles.appSubSubHeadingText,
      alignItems: 'center',
      flex: 2,
      textAlign: 'center',
    },
    contentContainer: {
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        height: '100%',
        paddingTop: 10,
        paddingBottom: 10,
    },
    startExerciseButtonContainer: {
        width: '100%', 
        paddingLeft: 10,
        paddingRight: 10,
    },
    startExerciseButtonText: {
        fontSize: 20,
    },
    lottie: {
      width: 200,
      height: 200,
    }
});
  