import React, { useState } from "react";
import { View, Text, Button, Alert, TextInput, StyleSheet } from "react-native";
import { Parity, UsbSerial, UsbSerialManager } from "react-native-usb-serialport-for-android";
import { ScreenProps } from "../interfaces/interfaces";


function ConnectDeviceScreen( {navigation} : ScreenProps) {
    const [bps, setBps] = useState("115200");
    const [USBPermission, setUSBPermission] = useState(false);
    const [deviceConnected, setDeviceConnected] = useState(false);
    const [usbSerialDevice, setUsbSerialDevice] = useState<UsbSerial | null>(null);

    async function requestUSBPermission() {
        try {
            const devices = await UsbSerialManager.list();
            const granted = await UsbSerialManager.tryRequestPermission(devices[0].deviceId);

            if (granted) {
                Alert.alert("Permissão concedida", "Dispositivo conectado com sucesso!!");
                setUSBPermission(true);
            } else {
                Alert.alert("Permissão negada", "Não foi possível conectar ao dispositivo.");
            }
        } catch (error: any) {
            Alert.alert("Erro", error.message);
        }
    }

    async function connectDevice() {
        try {
            const devices = await UsbSerialManager.list();
            const device = devices[0];
            const usbSerialDevice = await UsbSerialManager.open(device.deviceId, {baudRate: parseInt(bps), parity: Parity.None, dataBits: 8, stopBits: 1 });
            setDeviceConnected(true);
            setUsbSerialDevice(usbSerialDevice);
        } catch (error: any) {
            console.log(error);
            Alert.alert("Erro", "Ocorreu algum erro na conexão, tente novamente...");
        }
    }

    if (!USBPermission) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Primeiro é preciso autorizar a conexão USB</Text>
                <Button title="Autorizar Conexão USB" onPress={requestUSBPermission}/>
            </View>
        );
    }

    if (!deviceConnected) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Conectar a um dispositivo</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => setBps(text)}
                    value={bps}
                    keyboardType="numeric"
                />
                <Button title="Conectar" onPress={connectDevice} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textSuccess}>Dispositivo conectado!</Text>
            <Button title="Voltar à tela Inicial" onPress={() => navigation.goBack()}/>
        </View>
    );
}

export default ConnectDeviceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        height: 40,
        width: 200,
        borderColor: 'gray',
        borderWidth: 1,
    },
    text: {
        fontSize: 15,
    },
    textSuccess: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});