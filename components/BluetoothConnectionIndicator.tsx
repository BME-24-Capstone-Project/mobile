import {useEffect, useState} from 'react';
import {Button, Text, TouchableOpacity, View} from 'react-native';
import {BleManager, Characteristic, Device} from 'react-native-ble-plx';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck, faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useBluetooth } from './providers/bluetooth';

export const BluetoothConnectionIndicator = ({connectedDevice}:{connectedDevice: Device | null}) => {
  return (
    <>
    {connectedDevice && (
      <View>
        <FontAwesomeIcon size={20} style={{color: "#1FD655"}} icon={faCircleCheck} />
      </View>
    )}
    {!connectedDevice && (
      <View>
        <FontAwesomeIcon size={20} style={{color: "yellow"}} icon={ faCircleExclamation } />
      </View>
    )}
    </>
  )
};