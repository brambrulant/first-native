// src/screens/GameScreen.js
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { DeviceMotion } from "expo-sensors";

import Camera from "./Camera";

export default function GameScreen() {
  const [color, set_color] = useState("white");
  const [torch, setTorch] = useState(true)

  useEffect(() => {
    DeviceMotion.setUpdateInterval(250);
    const subscription = DeviceMotion.addListener((data) => {
      const beta = data && data.rotation
        ? data.rotation.beta
        : null
      console.log('beta test:', beta);
      const torch = beta > 0.75
      console.log('torch test:', torch)
      setTorch(torch)
      const hue = Math.max(0, Math.round(150 + 150 * data.rotation.beta) % 360);

      // from 0% to 100% (from gray/black to fully saturated color)
      const saturation = Math.max(
        0,
        Math.round(30 + 60 * data.rotation.beta) % 100
      );

      set_color(`hsl(${hue}, ${saturation}%, 50%)`);
    });

    // cleanup on unmount
    return () => subscription.remove()
  }, []);

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: color,
      }}
    >
      <Text style={{ marginBottom: 20, fontSize: 24, fontWeight: "bold" }}>
        Choose your color!
      </Text>
      <Camera torch={torch} />
    </View>
  );
}
