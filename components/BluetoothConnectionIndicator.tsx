import {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Characteristic, Device} from 'react-native-ble-plx';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useBluetooth } from './providers/bluetooth';
import { Colors, GlobalStyles } from '../common/data-types/styles';
import { ActivityIndicator } from 'react-native-paper';

export const BluetoothConnectionIndicator = ({connectedDevice}:{connectedDevice: Device | null}) => {
  return (
    <>
    {connectedDevice && (
      <View style={{flexDirection: 'row', gap: 15, backgroundColor:'white', borderRadius: 8, padding: 5}}>
        <Text style={{...GlobalStyles.appSubHeadingText, color: Colors.primary}}>Wearable Connected</Text>
        <FontAwesomeIcon size={20} style={{color: "#37823a"}} icon={faCircleCheck} />
    </View>
    )}
    {!connectedDevice && (
      <View style={{flexDirection: 'row', gap: 15, backgroundColor:'white', borderRadius: 8, padding: 5}}>
        <Text style={{...GlobalStyles.appSubHeadingText, color: Colors.primary}}>Connecting to Wearable</Text>
        {/* <FontAwesomeIcon size={20} style={{color: "red"}} icon={ faCircleExclamation } /> */}
        <ActivityIndicator animating={true} color={Colors.primary}/>
      </View>
    )}
    </>
  )
};