import { StyleSheet } from "react-native";
import { Colors, GlobalStyles } from "../../common/data-types/styles";


export const styles = StyleSheet.create({
    container: {
      ...GlobalStyles.container,
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    headerContainer: {
      justifyContent: 'flex-start',
      width: '100%',
      paddingBottom: 10,
    },
    exerciseList: {
      gap: 15,
      width: '100%',
    },
    exerciseListItem: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      padding: 10,
      borderRadius: 8,
      shadowColor: '#171717',
      shadowOffset: {width: -3, height: 1},
      shadowOpacity: 0.2,
      shadowRadius: 3,
      backgroundColor: Colors.tertiary,
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
    sessionOptionsList: {
      gap: 15,
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
      backgroundColor: Colors.tertiary,
    },
    modalContainerStyle: {
      backgroundColor: 'white', 
      padding: 20,
      width:'90%',
      alignSelf: 'center',
      gap: 20, 
      borderRadius: 8,
    },
    youtubePlayerContainer: {
      padding: 10,
    },
  });