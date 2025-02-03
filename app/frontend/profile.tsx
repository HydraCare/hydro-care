import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import Header from "../header";
import * as ImagePicker from "expo-image-picker";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Clipboard from "@react-native-clipboard/clipboard";
const Profile: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const handleBack = () => {
    onGoBack();
  };
  const copyToClipboard = () => {
    Clipboard.setString(profile.id);
    console.log("コピーしました");
  };
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    id: "",
    gender: "",
    waterGoal: 0,
    imageUrl: "", // プロフィール画像のURL
  });
  const [badges, setBadges] = useState<string[]>([]);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newWaterGoal, setNewWaterGoal] = useState("");

  useEffect(() => {
    const fetchProfileAndBadges = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.uid) {
          console.error("ログイン中のユーザーがいません");
          return;
        }

        const firestore = getFirestore();
        const userId = user.uid;
        const profileRef = doc(firestore, "users", userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            name: data.name || "",
            id: profileSnap.id || "",
            gender: data.gender || "",
            waterGoal: data.waterGoal || 0,
            imageUrl: data.imageUrl || "", // Firestore に保存された画像URL
          });
          setNewName(data.name || "");
          setNewWaterGoal(String(data.waterGoal || ""));
          setBadges(data.badges || []); // Firestore のバッジデータ
        } else {
          Alert.alert("エラー", "プロフィール情報が見つかりません");
        }
      } catch (error) {
        console.error("プロフィールまたはバッジの取得エラー:", error);
        Alert.alert("エラー", "プロフィール情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndBadges();
  }, []);

  const handleChangeImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          "権限が必要です",
          "画像ライブラリへのアクセスを許可してください。"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProfile((prev) => ({ ...prev, imageUrl: uri }));
        Alert.alert("成功", "プロフィール画像が変更されました！");
      }
    } catch (error) {
      console.error("画像変更エラー:", error);
      Alert.alert("エラー", "プロフィール画像を変更できませんでした");
    }
  };

  const handleSaveWaterGoal = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const firestore = getFirestore();
      const profileRef = doc(firestore, "users", user.uid);

      const waterGoal = parseInt(newWaterGoal, 10);
      await updateDoc(profileRef, { waterGoal });
      setProfile((prev) => ({ ...prev, waterGoal }));
      setIsEditingGoal(false);
      Alert.alert("成功", "毎日の目標が更新されました！");
    } catch (error) {
      console.error("目標の更新エラー:", error);
      Alert.alert("エラー", "毎日の目標を更新できませんでした");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="プロフィール" back="Back" onBackPress={handleBack} />
      <ScrollView style={styles.scrollContainer}>
        {/* 自分の紹介 Section */}
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <Text style={styles.sectionTitle}>自分の紹介</Text>
          </View>
          {loading ? (
            <Text>プロフィールを読み込んでいます...</Text>
          ) : (
            <>
              <TouchableOpacity onPress={handleChangeImage}>
                <Image
                  source={
                    profile.imageUrl
                      ? { uri: profile.imageUrl }
                      : require("@/assets/images/dittrau.png")
                  }
                  style={styles.icon}
                />
              </TouchableOpacity>
              <View style={styles.profileDetails}>
                {isEditingName ? (
                  <View style={styles.editContainer}>
                    <TextInput
                      style={styles.input}
                      value={newName}
                      onChangeText={setNewName}
                      placeholder="名前を入力"
                    />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditingName(false);
                          setNewName(profile.name);
                        }}
                        style={styles.cancelButton}
                      >
                        <Text style={styles.buttonText}>キャンセル</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setProfile((prev) => ({ ...prev, name: newName }));
                          setIsEditingName(false);
                          Alert.alert("成功", "名前が変更されました！");
                        }}
                        style={styles.saveButton}
                      >
                        <Text style={styles.buttonText}>保存</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.infoContainer}>
                    <Text
                      style={styles.profileText}
                    >{`名前: ${profile.name}`}</Text>
                    <TouchableOpacity
                      onPress={() => setIsEditingName(true)}
                      style={styles.editButton}
                    >
                      <Text style={styles.buttonText}>修正</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <Text style={styles.profileText}>{`ID: ${profile.id.slice(0, 5)}...`}

                  <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                    <Text style={styles.copyButtonText}>📋</Text>
                  </TouchableOpacity>
                </Text>
                <Text style={styles.profileText}>{`性別: ${profile.gender}`}


                </Text>

              </View>
            </>
          )}
        </View>

        {/* 毎日の目標 Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>毎日の目標</Text>
          {isEditingGoal ? (
            <View style={styles.editContainer}>
              <TextInput
                style={styles.input}
                value={newWaterGoal}
                onChangeText={setNewWaterGoal}
                keyboardType="numeric"
                placeholder="目標を入力"
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  onPress={() => {
                    setIsEditingGoal(false);
                    setNewWaterGoal(String(profile.waterGoal));
                  }}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>キャンセル</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveWaterGoal}
                  style={styles.saveButton}
                >
                  <Text style={styles.buttonText}>保存</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.infoContainer}>
              <Text
                style={styles.profileText}
              >{`毎日の目標: ${profile.waterGoal}ml`}</Text>
              <TouchableOpacity
                onPress={() => setIsEditingGoal(true)}
                style={styles.editButton}
              >
                <Text style={styles.buttonText}>修正</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 取得したバッジ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取得したバッジ:</Text>
          <View style={styles.badgeContainer}>
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <Image
                  key={index}
                  source={
                    badge
                      ? { uri: badge }
                      : require("@/assets/images/badge.png")
                  }
                  style={styles.badgeIcon}
                />
              ))
            ) : (
              <Text style={styles.profileText}>まだバッジはありません。</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6F2F9",
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
  },
  settingItem: {
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  profileDetails: {
    flexDirection: "column",
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 10,
    flex: 1,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  cancelButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  badgeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    margin: 5,
  },
  icon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: "center",
    marginBottom: 15,
  },
  editContainer: {
    flexDirection: "column",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  copyButton: {
    backgroundColor: "#fff",
    padding: 0,
    borderRadius: 5,
  },
  copyButtonText: { color: "#fff", fontSize: 14 },
});

export default Profile;
