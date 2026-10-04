"use client";

import { ThemedText } from "@/components/themed-text";
import { authStorage } from "@/lib/auth.storage";
import { useEffect, useState } from "react";
import { View } from "react-native";

const Storage = () => {
  const [token, setToken] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<string | null>(null);
  useEffect(() => {
    const getAuths = async () => {
      const access = await authStorage.getAccessToken();
      const e = await authStorage.getRefreshToken();
      setRefresh(e);
      setToken(access);
    };

    void getAuths();
  }, []);

  return (
    <View>
      {/* <ThemedText>{token}</ThemedText> */}
      <ThemedText>{refresh}</ThemedText>
    </View>
  );
};

export default Storage;
