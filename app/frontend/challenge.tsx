import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Header from "../header";

const Challenge: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [loading, setLoading] = useState(true);
  const [challengeData, setChallengeData] = useState({
    loginCount: 0,
    totalWater: 0,
  });

  const handleBack = () => {
    onGoBack();
  };

  useEffect(() => {
    const fetchChallengeData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.uid) {
          console.error("ログイン中のユーザーがいません");
          return;
        }

        const firestore = getFirestore();
        const userId = user.uid;
        const userDocRef = doc(firestore, "users", userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setChallengeData({
            loginCount: data.loginCount || 0,
            totalWater: data.totalWater || 0,
          });
        } else {
          Alert.alert("エラー", "チャレンジデータが見つかりません");
        }
      } catch (error) {
        console.error("チャレンジデータ取得エラー:", error);
        Alert.alert("エラー", "チャレンジデータを取得できませんでした");
      } finally {
        setLoading(false);
      }
    };

    fetchChallengeData();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="チャレンジ" back="Back" onBackPress={handleBack} />
      <ScrollView style={styles.scrollContainer}>
        {/* チャレンジ統計セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>チャレンジ統計</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>総ログイン日数:</Text>
                <Text style={styles.statValue}>
                  {challengeData.loginCount} 日
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>総水分摂取量:</Text>
                <Text style={styles.statValue}>
                  {challengeData.totalWater} ml
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* バッジセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取得したバッジ:</Text>
          <View style={styles.badgeContainer}>
            <Image
              source={require("@/assets/images/badge.png")}
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>初めての記録</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Image
              source={require("@/assets/images/badge2.jpg")}
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>1日の目標達成</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Image
              source={require("@/assets/images/badge4.jpg")}
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>3種類の飲み物</Text>
          </View>
          <View style={styles.badgeContainer}>
            <Image
              source={require("@/assets/images/badge3.jpg")}
              style={styles.badgeIcon}
            />
            <Text style={styles.badgeText}>1ヶ月の目標達成</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    marginTop: 10,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  statValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  badgeIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 16,
    color: "#333",
  },
});

export default Challenge;
