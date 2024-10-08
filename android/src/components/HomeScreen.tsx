import React from "react";
import { SafeAreaView, View, Text, Image } from "react-native";
import { ScreenProps } from "../interfaces/interfaces";

function HomeScreen({ navigation }: ScreenProps) {
  return (
    <SafeAreaView>
      <View>
        <Text>Home Screen</Text>
        <Image
          source={{ uri: "https://reactnative.dev/docs/assets/p_cat2.png" }}
          style={{ width: 200, height: 200 }}
        />
      </View>
    </SafeAreaView>
  );
}

export default HomeScreen;