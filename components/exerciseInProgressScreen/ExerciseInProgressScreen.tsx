import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Button, ProgressBar} from "react-native-paper";
import { Colors, GlobalStyles } from "../../common/data-types/styles";
import LottieView from "lottie-react-native";
import { BleManager } from "react-native-ble-plx";

// add "done calibrating screen"
// add images of calibration poses
// add session progress header
// remove calibrating

export const ExerciseInProgressScreen = ({navigation, route}: {navigation: any, route: any}) => {
  const manager = new BleManager();

  const session_id = route.params.session_id
  console.log(`sessionid: ${session_id}`)
  const [currentSetAndSessionData, setCurrentSetAndSessionData] = useState<CurrentSetAndSessionData>()
  const [setInProgress, setSetInProgress] = useState<boolean>(false)
  const [countdownInProgress, setCountdownInProgress] = useState<boolean>(false)
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [feedbackFromPrev, setFeedbackFromPrev] = useState<Feedback>()
  const [connectedDevice, setConnectedDevice] = useState<any>()
  const [deviceData, setDeviceData] = useState<any>()
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false)
  const [exerciseSetsComplete, setExerciseSetsComplete] = useState<boolean>(false)
  const [calibrating, setCalibrating] = useState<boolean>(false)
  const [needsCalibration, setNeedsCalibrating] = useState<boolean>(false)

  // could show previous exercises feedback on next exercise page. 
  useEffect(() => {
    loadCurrentExerciseAndSessionData()
    // scanAndConnect()
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
        }, 300);
        return () => clearInterval(interval)
    }
  }, [countdownInProgress]);

  useEffect(() => {
    //add bluetooth calibrate code
    if (calibrating) {
      setTimeout(() => {
        setCalibrating(false)
      }, 1000)
    }
  }, [calibrating]);

  useEffect(() => {
    //add bluetooth calibrate code
    if (loadingFeedback) {
      axios.post(`http://localhost:8080/exercise_sets/${session_id}/${currentSetAndSessionData?.assigned_exercise.id}`, {
        acc_x: [],
        acc_y: [],
        acc_z: [],
        roll: [],
        pitch: [],
        yaw: [],
        angle: [],
      }).then((response: any) => {
        //setFeedbackFromPrev(response.data.data)
        console.log(response.data)
        loadCurrentExerciseAndSessionData()
      }).catch((error: any) => {
        console.log('Error creating Session: ')
        console.log(error)
      })
      setTimeout(() => {
        setLoadingFeedback(false)
        setFeedbackFromPrev({
          error_mode: "Error Mode.",
          instructions: "Do this instead of that."
        })
      }, 1000)
    }
  }, [loadingFeedback]);

  // function scanAndConnect() {
  //   axios.get(`http://localhost:8080/device`).then((response: any) => {
  //     console.log(response.data)
  //     setDeviceData(response.data.data)
  //     console.log("Scan Started")
  //     manager.startDeviceScan(null, null, (error, device) => {
  //     if (error) {
  //       // Handle error (scanning will be stopped automatically)
  //       console.log('Error while scanning devices');
  //       console.log(error);
  //       return;
  //     }
  //     if (device && (device.name === response.data.data.name || device.localName === response.data.data.name )) {
  //       device.connect().then(device => {
  //         console.log("Connected to: " + device.name)
  //         setConnectedDevice(device)
  //         device.discoverAllServicesAndCharacteristics()
  //       }).catch(error => {
  //         console.log("Error connecting to device: ")
  //         console.log(error)
  //         manager.stopDeviceScan()
  //       })
  //       manager.stopDeviceScan()
  //     }
  //     });
  //   }).catch((error: any) => {
  //     console.log("Error Getting device id")
  //     console.log(error);
  //   })
    
  // }

  

  const loadCurrentExerciseAndSessionData = () => {
    axios.get(`http://localhost:8080/exercise_sets/${session_id}`).then((response: any) => {
      setCurrentSetAndSessionData(response.data.data)
      if (response.data.data.completed_exercise_sets === 0) {
        setNeedsCalibrating(true)
      }
    }).catch((error: any) => {
      console.log("Error Getting currentSetAndSessionData")
      console.log(error);
    })
  }

  const calibrate = () => {
    setNeedsCalibrating(false)
    setCalibrating(true)
  }

  const startSet = () => {
    setFeedbackFromPrev(undefined)
    setCountdownInProgress(true)
    setSetInProgress(true)
    // tell bluetooth to read data
  }

  const submitSet = () => {
    setSetInProgress(false)
    setLoadingFeedback(true)
    // pull data from bluetooth
    // submit to DB
    // submit feedback
    // page should rerender automatically 
  }

  const cancelSet = () => {
    setSetInProgress(false)
    setCountdownInProgress(false)
  }

  const contentContainer = () => {
    if (countdownInProgress) {
      return (<Text style={{...GlobalStyles.appHeadingText, fontSize: 100}}>{countdownValue}</Text>)
    } else if (feedbackFromPrev && !needsCalibration && !calibrating) {
      return (
        <>
          <Text style={GlobalStyles.appHeadingText}>{feedbackFromPrev.error_mode}</Text>
          <Text style={GlobalStyles.appLargeParagraphText}>Feedback shows here</Text>
        </>
      )
      
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
    } else if (loadingFeedback) {
      return (
        <View style={{alignItems: "center", gap: 50}}>
          <LottieView
            source={require('../../assets/feedback-loading-animation.json')}
            style={styles.lottie}
            autoPlay
            loop
          />
          <Text style={GlobalStyles.appHeadingText}>Loading Feedback</Text>
        </View>
      )
    } else if (exerciseSetsComplete) {
      
    } else if (calibrating) {
      return (
        <View style={{alignItems: "center", gap: 50}}>
        <LottieView
          source={require('../../assets/feedback-loading-animation.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
        <Text style={GlobalStyles.appHeadingText}>Calibrating device</Text>
      </View>
      )
    } else if (needsCalibration) {
      return <Text style={{...GlobalStyles.appHeadingText, textAlign: "center"}}>Please get in position and press "Start Calibrating" to calibrate your device for the current exercise.</Text>
    } 
     else {
      return <Text style={{...GlobalStyles.appHeadingText, textAlign: "center"}}>Press "Start Set" to get started!</Text>
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
                <Text style={styles.percentageContainer}>{currentSetAndSessionData?.completed_session_sets*100/currentSetAndSessionData?.total_session_sets | 0} %</Text>
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
              {currentSetAndSessionData.assigned_exercise.distance && 
                <View style={{flexDirection: 'row'}}>
                  <Text style={GlobalStyles.appSubHeadingText}>Distance: </Text>
                  <Text style={GlobalStyles.appLargeParagraphText}>{currentSetAndSessionData.assigned_exercise.distance} km</Text>
                </View>
              }
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
            {setInProgress && (
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
            )}
            {needsCalibration &&
              <Button 
              style={GlobalStyles.button}  
              mode="contained"
              disabled={countdownInProgress}
              buttonColor={Colors.primary}
              onPress={calibrate}
              >
              <Text style={styles.startExerciseButtonText}>
                Calibrate Device 
              </Text>
            </Button> 
            }
            {(!needsCalibration && !setInProgress) &&
              <Button 
              style={GlobalStyles.button}  
              mode="contained"
              disabled={countdownInProgress || calibrating}
              buttonColor={Colors.primary}
              onPress={startSet}
              >
              <Text style={styles.startExerciseButtonText}>
                Start Set 
              </Text>
            </Button> 
            }
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
  