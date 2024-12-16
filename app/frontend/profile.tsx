import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../header";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const Profile: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const handleBack = () => {
    console.log("aa");
    onGoBack();
  };

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: "",
    id: "",
    waterGoal: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user || !user.uid) {
          console.error("ログイン中のユーザーがいません");
          return null;
        }
        const firestore = getFirestore(); // Firestoreのインスタンスを取得
        const userId = user?.uid; // ログイン中のユーザーIDを取得する必要あり
        const profileRef = doc(firestore, "users", userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            name: data.name || "",
            id: profileSnap.id || "",
            waterGoal: data.waterGoal || 0,
          });
        } else {
          Alert.alert("エラー", "プロフィール情報が見つかりません");
        }
      } catch (error) {
        console.error("プロフィール取得エラー:", error);
        Alert.alert("エラー", "プロフィール情報を取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="プロフィール" back="Back" onBackPress={handleBack} />
      <ScrollView style={styles.scrollContainer}>
        {/* Profile Section */}
        {/* <View style={styles.profileSection}>
                    <Image
                        source={require('@/assets/images/dittrau.png')}
                        style={styles.icon}
                    />
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileText}>Name</Text>
                    </View>
                    <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                </View> */}

        {/* 自分の紹介 Section */}
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <Text style={styles.sectionTitle}>自分の紹介</Text>
            <TouchableOpacity>
              <Text>修正</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text>プロフィールを読み込んでいます...</Text>
          ) : (
            <>
              <Image
                source={require("@/assets/images/dittrau.png")}
                style={styles.icon}
              />
              <View style={styles.profileDetails}>
                <Text
                  style={styles.profileText}
                >{`名前: ${profile.name}`}</Text>
                <Text style={styles.profileText}>{`ID: ${profile.id}`}</Text>
                <Text
                  style={styles.profileText}
                >{`毎日の目標: ${profile.waterGoal}ml`}</Text>
              </View>
            </>
          )}
        </View>

        {/* 毎日の目標 Section */}
        <View style={styles.section}>
          <View style={styles.settingItem}>
            <Text style={styles.sectionTitle}>毎日の目標:</Text>
            <TouchableOpacity>
              <Text>修正</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require("@/assets/images/water.png")} // Chỉnh đường dẫn hình ảnh nếu cần
            style={styles.goalIcon}
          />
        </View>

        {/* 取得したバッジ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取得したバッジ:</Text>
          <View style={styles.badgeContainer}>
            <Image
              source={require("@/assets/images/plus.png")} // Chỉnh đường dẫn hình ảnh nếu cần
              style={styles.badgeIcon}
            />
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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    margin: 10,
    borderRadius: 10,
  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  angle_right: {
    width: 20,
    height: 20,
  },
  profileDetails: {
    flexDirection: "column",
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  section: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    margin: 10,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  infoText: {
    fontSize: 16,
    color: "#333",
    flex: 2,
  },
  goalIcon: {
    width: 40,
    height: 40,
    marginTop: 10,
  },
  badgeContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
});

export default Profile;
