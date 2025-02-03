import React, { useState, useEffect } from 'react';
import { View, Text, Image, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Header from '../header';
import Profile from './profile';
import { useNavigation } from 'expo-router';
import ChangePassword from './change_password';
import { firestore, auth } from './firebase'; // 修正: firebase.tsxのインスタンスを使用
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import * as Notifications from "expo-notifications";
import { query, orderBy, limit } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';

const WATER_THRESHOLD = 301; // 水分摂取量の閾値

const sendNotification = async (waterValue: number) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "飲みすぎ注意",
      body: `水分摂取量が ${waterValue} ml を超えました！`,
    },
    trigger: null, // 即時通知
  });
};

const Setting: React.FC<{
  onNavigateToEmail: () => void;
  onNavigateToPassword: () => void;
  onNavigate: () => void;
  onNavigateLogin: () => void;
}> = ({ onNavigateToEmail, onNavigateToPassword, onNavigate, onNavigateLogin }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({ name: '', id: '', waterGoal: 0 });

  const toggleNotification = () => setIsNotificationEnabled(!isNotificationEnabled);
  // const navigation = useNavigation();
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("ログイン中のユーザーがいません");
          return;
        }

        const userId = user.uid;
        const profileRef = doc(firestore, 'users', userId);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const data = profileSnap.data();
          setProfile({
            name: data.name || '',
            id: profileSnap.id || '',
            waterGoal: data.waterGoal || 0,
          });
        } else {
          Alert.alert('エラー', 'プロフィール情報が見つかりません');
        }
      } catch (error) {
        console.error('プロフィール取得エラー:', error);
        Alert.alert('エラー', 'プロフィール情報を取得できませんでした');
      } finally {
        setLoading(false);
      }
    };
    const setupRealtimeListener = () => {
      const user = auth.currentUser;
      if (!user) return;

      const logCollectionRef = collection(firestore, `users/${user.uid}/oneDayLog`);

      // drunkTime を基準に最新の1件を取得するクエリ
      const latestLogQuery = query(logCollectionRef, orderBy("drinktime", "desc"), limit(1));

      onSnapshot(latestLogQuery, (querySnapshot) => {
        if (!querySnapshot.empty) {
          const latestDoc = querySnapshot.docs[0];
          const data = latestDoc.data();
          console.log("最新のドキュメントID:", latestDoc.id);
          console.log("最新のドキュメントデータ:", data);

          if (data.water > WATER_THRESHOLD) {
            sendNotification(data.water);
          }
        }
      });
    };

    fetchProfile();
    setupRealtimeListener();
  }, []);
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      Alert.alert("ログアウトしました", "正常にログアウトされました。");
      onNavigateLogin();
    } catch (error) {
      console.error("ログアウトエラー:", error);
      Alert.alert("エラー", "ログアウトに失敗しました。");
    }
  };


  return (
    <View style={styles.container}>
      <Header title='設定' />
      <TouchableOpacity onPress={onNavigate} style={styles.settingSection}>
        <Text style={styles.sectionTitle}>プロフィール</Text>
        <View style={styles.profileSection}>
          {loading ? (
            <Text>プロフィールを読み込んでいます...</Text>
          ) : (
            <>
              <Image source={require('@/assets/images/dittrau.png')} style={styles.icon} />
              <View style={styles.profileDetails}>
                <Text style={styles.profileText}>{`名前: ${profile.name}`}</Text>
                <Text style={styles.profileText}>{`ID: ${profile.id.slice(0, 5)}...`}</Text>
                <Text style={styles.profileText}>{`毎日の目標: ${profile.waterGoal}ml`}</Text>
              </View>
            </>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.settingSection}>
        <View style={styles.settingItem}>
          <Text style={styles.sectionTitle}>通知</Text>
          <Switch
            value={isNotificationEnabled}
            onValueChange={toggleNotification}
            trackColor={{ false: "#ccc", true: "#4CAEE8" }}
          />
        </View>
      </View>

      <View style={styles.settingSection}>
        <Text style={styles.sectionTitle}>ユーザー情報</Text>
        <TouchableOpacity onPress={onNavigateToPassword} style={styles.settingItem}>
          <Text style={styles.settingLabel}>パスワード変更</Text>
          <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Text style={styles.settingLabel}>ログアウト</Text>
          <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const SettingApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState('Setting');
  const navigateLogin = () => setCurrentScreen('login');
  const navigateToProfile = () => setCurrentScreen('Profile');
  const navigateToChangePassword = () => setCurrentScreen('ChangePassword');
  const goBackToSetting = () => setCurrentScreen('Setting');

  return (
    <View style={styles.container}>
      {currentScreen === 'Setting' && (
        <Setting
          onNavigateToEmail={() => { }}
          onNavigateToPassword={navigateToChangePassword}
          onNavigate={navigateToProfile}
          onNavigateLogin={navigateLogin}
        />
      )}
      {currentScreen === 'Profile' && <Profile onGoBack={goBackToSetting} />}
      {currentScreen === 'ChangePassword' && <ChangePassword onGoBack={goBackToSetting} />}
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F2F9',
  },
  backButton: {
    position: 'absolute',
    left: 0,
  },
  backText: {
    fontSize: 20,
    color: '#007BFF',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 5,

  },
  icon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 30,
  },
  angle_right: {
    width: 20,
    height: 20,
  },
  profileDetails: {
    flexDirection: 'column',
  },
  profileText: {
    fontSize: 18,
    color: 'black',
  },
  settingSection: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    margin: 10,
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    fontSize: 18,
    color: '#333',
    marginTop: 5,
  },
  changeSettings: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  changeButton: {
    backgroundColor: '#ADD8E6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default SettingApp;


// import React, { useState } from 'react';
// import { View, Text, Image, Switch, TouchableOpacity, StyleSheet } from 'react-native';

// const Setting: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
//     const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);

//     const toggleNotification = () => setIsNotificationEnabled(!isNotificationEnabled);

//     return (
//         <View style={styles.container}>
//             <Text style={styles.sectionTitle}>設定</Text>

//             {/* Profile Section */}
//             <TouchableOpacity onPress={() => onNavigate('Profile')} style={styles.settingSection}>
//                 <Text style={styles.sectionTitle}>プロフィール</Text>
//                 <View style={styles.profileSection}>
//                     <Image source={require('@/assets/images/dittrau.png')} style={styles.icon} />
//                     <View style={styles.profileDetails}>
//                         <Text style={styles.profileText}>Name</Text>
//                         <Text style={styles.profileText}>ID: ABT12345</Text>
//                         <Text style={styles.profileText}>毎日の目標: 2000ml</Text>
//                     </View>
//                 </View>
//             </TouchableOpacity>

//             {/* Notification Section */}
//             <View style={styles.settingSection}>
//                 <View style={styles.settingItem}>
//                     <Text style={styles.sectionTitle}>通知</Text>
//                     <Switch
//                         value={isNotificationEnabled}
//                         onValueChange={toggleNotification}
//                         trackColor={{ false: '#ccc', true: '#4CAF50' }}
//                     />
//                 </View>
//             </View>

//             {/* User Information Section */}
//             <View style={styles.settingSection}>
//                 <Text style={styles.sectionTitle}>ユーザー情報</Text>
//                 <TouchableOpacity onPress={() => onNavigate('ChangeEmail')} style={styles.settingItem}>
//                     <Text style={styles.settingLabel}>メルアドレス</Text>
//                     <Image source={require('@/assets/images/angle-right.png')} style={styles.angleRight} />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => onNavigate('ChangePassword')} style={styles.settingItem}>
//                     <Text style={styles.settingLabel}>パスワード</Text>
//                     <Image source={require('@/assets/images/angle-right.png')} style={styles.angleRight} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// };

// const SettingApp: React.FC = () => {
//     const [currentScreen, setCurrentScreen] = useState('Setting');

//     const navigateToScreen = (screen: string) => {
//         setCurrentScreen(screen);
//     };

//     const renderScreen = () => {
//         switch (currentScreen) {
//             case 'Setting':
//                 return <Setting onNavigate={navigateToScreen} />;
//             case 'ChangeEmail':
//                 return (
//                     <View style={styles.container}>
//                         <Text style={styles.sectionTitle}>メールアドレス変更</Text>
//                         <TouchableOpacity onPress={() => navigateToScreen('Setting')} style={styles.backButton}>
//                             <Text style={styles.backText}>戻る</Text>
//                         </TouchableOpacity>
//                     </View>
//                 );
//             case 'ChangePassword':
//                 return (
//                     <View style={styles.container}>
//                         <Text style={styles.sectionTitle}>パスワード変更</Text>
//                         <TouchableOpacity onPress={() => navigateToScreen('Setting')} style={styles.backButton}>
//                             <Text style={styles.backText}>戻る</Text>
//                         </TouchableOpacity>
//                     </View>
//                 );
//             case 'Profile':
//                 return (
//                     <View style={styles.container}>
//                         <Text style={styles.sectionTitle}>プロフィール</Text>
//                         <TouchableOpacity onPress={() => navigateToScreen('Setting')} style={styles.backButton}>
//                             <Text style={styles.backText}>戻る</Text>
//                         </TouchableOpacity>
//                     </View>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return <View style={styles.container}>{renderScreen()}</View>;
// };

// export default SettingApp;

//             {/*
//             {currentScreen === 'Setting' ? (
//                 <Setting onNavigate={navigateNotification} />
//             ) : (
//                 <Profile onGoBack={goBackToBackSetting} />
//             )} */}