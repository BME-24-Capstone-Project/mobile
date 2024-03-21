import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, ProgressBar, TextInput} from "react-native-paper";
import { Colors, GlobalStyles } from "../../common/data-types/styles";
import LottieView from "lottie-react-native";
import { AirbnbRating } from "react-native-ratings";
import { BaseURL, Manager, DEVICE_UUID, CONTROL_CHARACTERISTIC_UUID, DATA_CHARACTERISTIC_UUID } from "../../common/common";
import { FeedbackMappings, Feedback } from "../../common/feedback";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import base64 from 'base-64';
import { Characteristic, Subscription } from "react-native-ble-plx";
import * as child_process from "child_process";
import YoutubeIframe from "react-native-youtube-iframe";

export const ExerciseInProgressScreen = ({navigation, route, isDeviceConnected}: {navigation: any, route: any, isDeviceConnected: boolean}) => {


  const session_id = route.params.session_id
  const [currentSetAndSessionData, setCurrentSetAndSessionData] = useState<CurrentSetAndSessionData>()
  const [setInProgress, setSetInProgress] = useState<boolean>(false)
  const [countdownInProgress, setCountdownInProgress] = useState<boolean>(false)
  const [countdownValue, setCountdownValue] = useState<number>(3)
  const [feedbackFromPrev, setFeedbackFromPrev] = useState<Feedback>()
  const [deviceData, setDeviceData] = useState<any>()
  const [loadingFeedback, setLoadingFeedback] = useState<boolean>(false)
  const [exerciseSetsComplete, setExerciseSetsComplete] = useState<boolean>(false)
  const [calibrating, setCalibrating] = useState<boolean>(false)
  const [needsCalibration, setNeedsCalibrating] = useState<boolean>(false)
  const [painRating, setPainRating] = useState<number>(3)
  const [submittedPainRating, setSubmittedPainRating] = useState<number>()
  const [note, setNote] = useState<string>("")
  const [feedbackError, setFeedbackError] = useState<string>("")
  const [wantsFeedback, setWantsFeedback] = useState<boolean>(route.params.wants_feedback)
  const [startSetText, setStartSetText] = useState<string>(`Press "Start Set" to get started!`)
  const [playing, setPlaying] = useState(false);

  let exerciseData = useRef({
    'acc_x': [[], []],
    'acc_y': [[], []],
    'acc_z': [[], []],
    'roll': [[], []],
    'pitch': [[], []],
    'yaw': [[], []],
    'angle': []
  })

  useEffect(() => {
    loadCurrentExerciseAndSessionData()
  }, [])

  useEffect(() => {
    let controlCharMonitor: Subscription | null = null;
    if (calibrating) {
        Manager.devices([DEVICE_UUID]).then((devices) => {
            devices[0].services().then((services) => {
                services[0].writeCharacteristicWithResponse(CONTROL_CHARACTERISTIC_UUID, base64.encode('10')).then((characteristic) => {
                    controlCharMonitor = characteristic.monitor((error, characteristic) => {
                        if(error) {
                            console.log(error)
                        } else {
                            if(characteristic?.value && base64.decode(characteristic.value) === "11") {
                                setCalibrating(false)
                            }
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })
    }

    return () => {
      controlCharMonitor?.remove()
    }
  }, [calibrating]);

  useEffect(() => {
    let dataCharMonitor: Subscription | null = null;
    if (countdownInProgress) {
        const interval = setInterval(() => {
          setCountdownValue((prevCount) => {
            if (prevCount === 1) {
              () => clearInterval(interval);
              setCountdownInProgress(false);
              Manager.devices([DEVICE_UUID]).then((devices) => {
                  devices[0].onDisconnected((error, device) => {
                      cancelSet()
                      setLoadingFeedback(false)
                      setFeedbackError("Error generating feedback. ")
                      setCalibrating(false)
                      setStartSetText("Device disconnected. Please try again.")
                  })
                  devices[0].services().then((services) => {
                      services[0].writeCharacteristicWithResponse(CONTROL_CHARACTERISTIC_UUID, base64.encode('20')).then((characteristic) => {
                        dataCharMonitor = services[0].monitorCharacteristic(DATA_CHARACTERISTIC_UUID, (err, characteristic) => {
                              if(err) {
                                  console.log(err)
                              } else {
                                  if(characteristic?.value) {
                                      const payload = JSON.parse(base64.decode(characteristic.value))
                                      exerciseData.current.acc_x[0] = [...exerciseData.current.acc_x[0], payload['acc_x_1']] as never
                                      exerciseData.current.acc_x[1] = [...exerciseData.current.acc_x[1], payload['acc_x_2']] as never
                                      exerciseData.current.acc_y[0] = [...exerciseData.current.acc_y[0], payload['acc_y_1']] as never
                                      exerciseData.current.acc_y[1] = [...exerciseData.current.acc_y[1], payload['acc_y_2']] as never
                                      exerciseData.current.acc_z[0] = [...exerciseData.current.acc_z[0], payload['acc_z_1']] as never
                                      exerciseData.current.acc_z[1] = [...exerciseData.current.acc_z[1], payload['acc_z_2']] as never
                                      exerciseData.current.roll[0] = [...exerciseData.current.roll[0], payload['roll_1']] as never
                                      exerciseData.current.roll[1] = [...exerciseData.current.roll[1], payload['roll_2']] as never
                                      exerciseData.current.yaw[0] = [...exerciseData.current.yaw[0], payload['yaw_1']] as never
                                      exerciseData.current.yaw[1] = [...exerciseData.current.yaw[1], payload['yaw_2']] as never
                                      exerciseData.current.pitch[0] = [...exerciseData.current.pitch[0], payload['pitch_1']] as never
                                      exerciseData.current.pitch[1] = [...exerciseData.current.pitch[1], payload['pitch_2']] as never
                                      exerciseData.current.angle = [...exerciseData.current.angle, payload['angle']] as never
                                  }
                              }
                          })
                      }).catch((err) => {
                          console.log(err)
                      })
                  }).catch((err) => {
                      console.log(err)
                  })
              }).catch((err) => {
                  console.log(err)
              })
              return 3
            }
            return prevCount - 1;
          });
        }, 1000);
        return () => {
          dataCharMonitor?.remove()
          clearInterval(interval)
        }
    }
  }, [countdownInProgress]);

  useEffect(() => {
    if (loadingFeedback) {
        Manager.devices([DEVICE_UUID]).then((devices) => {
            devices[0].services().then((services) => {
                services[0].writeCharacteristicWithResponse(CONTROL_CHARACTERISTIC_UUID, base64.encode('30')).then((characteristic) => {
                    axios.post(`${BaseURL}/exercise_sets/${session_id}/${currentSetAndSessionData?.assigned_exercise.id}`, exerciseData.current).then((response: any) => {
                        const integerObtainedFromResponse = response.data.data.feedback
                        if (wantsFeedback) {
                            const feedback = FeedbackMappings.find(obj => obj.feedback == integerObtainedFromResponse);
                            setFeedbackFromPrev(feedback)
                        }
                        setLoadingFeedback(false)
                        loadCurrentExerciseAndSessionData()
                    }).catch((error: any) => {
                        setLoadingFeedback(false)
                        loadCurrentExerciseAndSessionData()
                        setFeedbackError("Error generating feedback. ")
                        console.log('Error creating exercise set: ')
                        console.log(error)
                    })
                }).catch((err) => {
                  console.log(err)
                })
            }).catch((err) => {
                console.log(err)
            })
        }).catch((err) => {
            console.log(err)
        })

    }
  }, [loadingFeedback]);

  const loadCurrentExerciseAndSessionData = () => {
    if (!exerciseSetsComplete) {
      axios.get(`${BaseURL}/exercise_sets/${session_id}`).then((response: any) => {
        setCurrentSetAndSessionData(response.data.data)
        if (response.data.data && response.data.data.completed_session_sets === 0) {
          setNeedsCalibrating(true)
        } else if (!response.data.data) {
          console.log("No response data received, sets complete")
          setExerciseSetsComplete(true);
        }
      }).catch((error: any) => {
        console.log("Error Getting currentSetAndSessionData")
        console.log(`error: ${error}`);
      })
    }
  }

  const calibrate = () => {
    setNeedsCalibrating(false)
    setCalibrating(true)
  }
  
  const submitPainRating = () => {
    setSubmittedPainRating(painRating)
  }

  const startSet = () => {
    setFeedbackError("")
    setFeedbackFromPrev(undefined)
    setCountdownInProgress(true)
    setSetInProgress(true)
    setStartSetText(`Press "Start Set" to get started!`)
  }

  const submitSet = () => {
    setSetInProgress(false)
    setLoadingFeedback(true)
  }

  const cancelSet = () => {
    setSetInProgress(false)
    setCountdownInProgress(false)
      Manager.devices([DEVICE_UUID]).then((devices) => {
          devices[0].services().then((services) => {
              services[0].writeCharacteristicWithResponse(CONTROL_CHARACTERISTIC_UUID, base64.encode('00')).then((characteristic) => {})
          }).catch((err) => {
              console.log(err)
          })
      }).catch((err) => {
          console.log(err)
      })
  }

  const submitSession = () => {
    axios.post(`${BaseURL}/surveys/${session_id}`, {
      five_point_pain_scale_response: submittedPainRating,
      notes: note,
    }).then((response: any) => {
        console.log("Survey submitted")
        axios.put(`${BaseURL}/sessions/${session_id}`, {}).then((response) => {
          console.log("Session Completed")
          navigation.navigate('CurrentDayScreen', {completed_session: true})
        }).catch((error) => {
          console.log("Error Completing Session")
          console.log(`error: ${error}`);
        })
    }).catch((error: any) => {
        console.log("Error Submitting Survey")
        console.log(`error: ${error}`);
    })
  }

  const contentContainer = () => {
    if (countdownInProgress) {
      return (<Text style={{...GlobalStyles.appHeadingText, fontSize: 100}}>{countdownValue}</Text>)
    } else if (feedbackFromPrev && !needsCalibration && !calibrating && !exerciseSetsComplete) {
      return (
        <View style={{alignContent: 'center', justifyContent:'center', alignItems:'center', gap: 15}}>
          {(feedbackFromPrev.feedback === 1 || feedbackFromPrev.feedback === 6) && 
            <FontAwesomeIcon icon={faCheck} size={100} color="green"/>
          }
          <Text style={GlobalStyles.appHeadingText}>{feedbackFromPrev.error_mode}</Text>
          {(feedbackFromPrev.feedback !== 1 && feedbackFromPrev.feedback !==6) && 
            <YoutubeIframe
              height={200}
              width={300}
              play={playing}
              videoId={feedbackFromPrev.video_id}
            />
          }
          <Text style={GlobalStyles.appLargeParagraphText}>{feedbackFromPrev.instructions}</Text>
        </View>
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
    } else if (loadingFeedback && wantsFeedback) {
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
    } else if (exerciseSetsComplete && !submittedPainRating && !feedbackFromPrev) {
      return (
        <View style={{alignItems: "center", gap: 50}}>
          <Text style={GlobalStyles.appHeadingText}>How was your pain during today's session?</Text>
          <AirbnbRating
            count={5}
            selectedColor={Colors.primary}
            reviews={["No pain", "Mild", "Moderate", "Severe", "Extreme"]}
            defaultRating={3}
            size={40}
            onFinishRating={(rating) => setPainRating(rating)}
            starContainerStyle={{gap: 10}}
            reviewColor={Colors.primary}
          />
        </View>
      )
    } else if (exerciseSetsComplete && !submittedPainRating && feedbackFromPrev) {
      return (
        <View style={{alignContent: 'center', justifyContent:'center', alignItems:'center', gap: 15}}>
        {(feedbackFromPrev.feedback === 1 || feedbackFromPrev.feedback === 6) && 
          <FontAwesomeIcon icon={faCheck} size={100} color="green"/>
        }
        <Text style={GlobalStyles.appHeadingText}>{feedbackFromPrev.error_mode}</Text>
        {(feedbackFromPrev.feedback !== 1 && feedbackFromPrev.feedback !==6) && 
          <YoutubeIframe
            height={200}
            width={300}
            play={playing}
            videoId={feedbackFromPrev.video_id}
          />
        }
        <Text style={{...GlobalStyles.appLargeParagraphText, textAlign: 'center'}}>{feedbackFromPrev.instructions}</Text>
      </View>
      )
    } else if (exerciseSetsComplete && submittedPainRating) {
      return (
        <ScrollView scrollEnabled={false} keyboardShouldPersistTaps='handled' contentContainerStyle={{paddingTop: '15%'}}>
        <View style={{alignItems: "center", gap: 50, width: '100%', padding: 30}}>
          <Text style={GlobalStyles.appHeadingText}>Include any notes for your physiotherapist below.</Text>
          <TextInput
            label="Note"
            value={note}
            style={{backgroundColor: Colors.tertiary, width: '100%'}}
            onChangeText={input => setNote(input)}
            mode='outlined'
            multiline={true}
          />
        </View>
        </ScrollView>
      )
    } else if (calibrating) {
      return (
        <View style={{alignItems: "center", gap: 50}}>
        <LottieView
          source={require('../../assets/feedback-loading-animation.json')}
          style={styles.lottie}
          autoPlay
          loop
        />
        <Text style={{...GlobalStyles.appHeadingText, textAlign: 'center'}}>Calibrating device. Please sit perfectly still.</Text>
      </View>
      )
    } else if (needsCalibration) {
      return <Text style={{...GlobalStyles.appHeadingText, textAlign: "center"}}>Please get in position and press "Start Calibrating". While calibrating, please sit still.</Text>
    } 
     else {
      return <Text style={{...GlobalStyles.appHeadingText, textAlign: "center"}}>{feedbackError}{startSetText}</Text>
    }
  }

  return (
    <SafeAreaView>
      {(currentSetAndSessionData  || exerciseSetsComplete) && (
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <View style={styles.headerItemContainer}>
              <View style={styles.progressBarAndPercentageContainer}>
                <View style={styles.progressBarContainer}>
                  <ProgressBar progress={currentSetAndSessionData ? currentSetAndSessionData?.completed_session_sets/currentSetAndSessionData?.total_session_sets : 100} color={Colors.primary} style={styles.progressBarStyle}/>
                </View>
                <Text style={styles.percentageContainer}>{currentSetAndSessionData ? currentSetAndSessionData?.completed_session_sets*100/currentSetAndSessionData?.total_session_sets | 0 : 100} %</Text>
              </View>
            </View>
            <View style={{...styles.headerItemContainer, alignItems:'center', gap: 5}}>
              {currentSetAndSessionData && !exerciseSetsComplete ? (
                <>
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
                </>
              ) : (
                <>
                  <Text style={GlobalStyles.appHeadingText}>Session Complete!</Text>
                </>
              )}
              
            </View>
          </View>
          <View style={styles.contentContainer}>
            <View style={{...styles.headerItemContainer, height: '100%', alignItems: 'center', justifyContent: 'center'}}>
              {contentContainer()}
            </View>
          </View>
          <View style={GlobalStyles.footerContainer}>
            {setInProgress && (
              <View style={{gap: 10}}>
                <Button 
                  style={GlobalStyles.button}  
                  mode="contained" 
                  buttonColor={Colors.primary}
                  disabled={countdownInProgress || calibrating}
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
              disabled={countdownInProgress || !isDeviceConnected}
              buttonColor={Colors.primary}
              onPress={calibrate}
              >
              <Text style={styles.startExerciseButtonText}>
                  {isDeviceConnected ? "Start Calibrating" : "Device disconnected"}
              </Text>
            </Button> 
            }
            {(!needsCalibration && !setInProgress && !exerciseSetsComplete) &&
              <Button 
              style={GlobalStyles.button}  
              mode="contained"
              disabled={countdownInProgress || calibrating || !isDeviceConnected}
              buttonColor={Colors.primary}
              onPress={startSet}
              >
              <Text style={styles.startExerciseButtonText}>
                  {isDeviceConnected ? "Start Set" : "Device disconnected"}
              </Text>
            </Button> 
            }
            {(exerciseSetsComplete && !submittedPainRating && !feedbackFromPrev) &&
              <Button 
                style={GlobalStyles.button}  
                mode="contained"
                disabled={countdownInProgress || calibrating}
                buttonColor={Colors.primary}
                onPress={submitPainRating}
              >
                <Text style={styles.startExerciseButtonText}>
                  Submit Pain Rating
                </Text>
              </Button> 
            }
            {(exerciseSetsComplete && !submittedPainRating && feedbackFromPrev) &&
              <Button 
                style={GlobalStyles.button}  
                mode="contained"
                disabled={countdownInProgress || calibrating}
                buttonColor={Colors.primary}
                onPress={() => setFeedbackFromPrev(undefined)}
              >
                <Text style={styles.startExerciseButtonText}>
                  Finish Exercises
                </Text>
              </Button> 
            }
            {(exerciseSetsComplete && submittedPainRating) &&
              <Button 
                style={GlobalStyles.button}  
                mode="contained"
                disabled={countdownInProgress || calibrating}
                buttonColor={Colors.primary}
                onPress={submitSession}
              >
                <Text style={styles.startExerciseButtonText}>
                  Finish Session
                </Text>
              </Button>}
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
  