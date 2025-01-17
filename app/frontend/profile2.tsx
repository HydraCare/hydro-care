// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   Alert,
// } from "react-native";
// import Header from "../header";
// import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const Profile: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
//   const handleBack = () => {
//     onGoBack();
//   };

//   // プロフィールデータと取得したバッジを管理するための state
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState({
//     name: "",
//     id: "",
//     waterGoal: 0,
//   });
//   const [badges, setBadges] = useState<string[]>([]);

//   // 編集モードを管理する state
//   const [isEditingName, setIsEditingName] = useState(false);
//   const [isEditingGoal, setIsEditingGoal] = useState(false);

//   // 編集用の入力値を管理
//   const [newName, setNewName] = useState("");
//   const [newWaterGoal, setNewWaterGoal] = useState("");

//   useEffect(() => {
//     const fetchProfileAndBadges = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;

//         if (!user || !user.uid) {
//           console.error("ログイン中のユーザーがいません");
//           return;
//         }

//         const firestore = getFirestore();
//         const userId = user.uid;
//         const profileRef = doc(firestore, "users", userId);
//         const profileSnap = await getDoc(profileRef);

//         if (profileSnap.exists()) {
//           const data = profileSnap.data();
//           setProfile({
//             name: data.name || "",
//             id: profileSnap.id || "",
//             waterGoal: data.waterGoal || 0,
//           });
//           setNewName(data.name || "");
//           setNewWaterGoal(String(data.waterGoal || ""));
//           setBadges(data.badges || []); // badgesデータを取得
//         } else {
//           Alert.alert("エラー", "プロフィール情報が見つかりません");
//         }
//       } catch (error) {
//         console.error("プロフィールまたはバッジの取得エラー:", error);
//         Alert.alert("エラー", "プロフィール情報を取得できませんでした");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfileAndBadges();
//   }, []);

//   // 名前を保存する
//   const handleSaveName = async () => {
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) return;

//       const firestore = getFirestore();
//       const profileRef = doc(firestore, "users", user.uid);

//       await updateDoc(profileRef, { name: newName });
//       setProfile((prev) => ({ ...prev, name: newName }));
//       setIsEditingName(false);
//       Alert.alert("成功", "名前が更新されました！");
//     } catch (error) {
//       console.error("名前の更新エラー:", error);
//       Alert.alert("エラー", "名前を更新できませんでした");
//     }
//   };

//   // 毎日の目標を保存する
//   const handleSaveWaterGoal = async () => {
//     try {
//       const auth = getAuth();
//       const user = auth.currentUser;
//       if (!user) return;

//       const firestore = getFirestore();
//       const profileRef = doc(firestore, "users", user.uid);

//       const waterGoal = parseInt(newWaterGoal, 10);
//       await updateDoc(profileRef, { waterGoal });
//       setProfile((prev) => ({ ...prev, waterGoal }));
//       setIsEditingGoal(false);
//       Alert.alert("成功", "毎日の目標が更新されました！");
//     } catch (error) {
//       console.error("目標の更新エラー:", error);
//       Alert.alert("エラー", "毎日の目標を更新できませんでした");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Header title="プロフィール" back="Back" onBackPress={handleBack} />
//       <ScrollView style={styles.scrollContainer}>
//         {/* 自分の紹介 Section */}
//         <View style={styles.section}>
//           <View style={styles.settingItem}>
//             <Text style={styles.sectionTitle}>自分の紹介</Text>
//           </View>
//           {loading ? (
//             <Text>プロフィールを読み込んでいます...</Text>
//           ) : (
//             <>
//               <Image
//                 source={require("@/assets/images/dittrau.png")}
//                 style={styles.badgeIcon}
//               />
//               <View style={styles.profileDetails}>
//                 {/* 名前編集 */}
//                 {isEditingName ? (
//                   <View style={styles.editContainer}>
//                     <TextInput
//                       style={styles.input}
//                       value={newName}
//                       onChangeText={setNewName}
//                       placeholder="名前を入力"
//                     />
//                     <TouchableOpacity
//                       onPress={handleSaveName}
//                       style={styles.saveButton}
//                     >
//                       <Text style={styles.buttonText}>保存</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   <View style={styles.infoContainer}>
//                     <Text
//                       style={styles.profileText}
//                     >{`名前: ${profile.name}`}</Text>
//                     <TouchableOpacity
//                       onPress={() => setIsEditingName(true)}
//                       style={styles.editButton}
//                     >
//                       <Text style={styles.buttonText}>修正</Text>
//                     </TouchableOpacity>
//                   </View>
//                 )}
//                 <Text style={styles.profileText}>{`ID: ${profile.id}`}</Text>
//               </View>
//             </>
//           )}
//         </View>

//         {/* 毎日の目標 Section */}
//         <View style={styles.section}>
//           <View style={styles.settingItem}>
//             <Text style={styles.sectionTitle}>毎日の目標 (ml)</Text>
//           </View>
//           {isEditingGoal ? (
//             <View style={styles.editContainer}>
//               <TextInput
//                 style={styles.input}
//                 value={newWaterGoal}
//                 onChangeText={setNewWaterGoal}
//                 keyboardType="numeric"
//                 placeholder="目標を入力"
//               />
//               <TouchableOpacity
//                 onPress={handleSaveWaterGoal}
//                 style={styles.saveButton}
//               >
//                 <Text style={styles.buttonText}>保存</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.infoContainer}>
//               <Text
//                 style={styles.profileText}
//               >{`毎日の目標: ${profile.waterGoal}ml`}</Text>
//               <TouchableOpacity
//                 onPress={() => setIsEditingGoal(true)}
//                 style={styles.editButton}
//               >
//                 <Text style={styles.buttonText}>修正</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* 取得したバッジ Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>取得したバッジ:</Text>
//           {badges.length > 0 ? (
//             <View style={styles.badgeContainer}>
//               {badges.map((badge, index) => (
//                 <Image
//                   key={index}
//                   source={require("@/assets/images/badge2.jpg")} // 用意したバッジ画像表示
//                   //   source={{ uri: badge }} // バッジ画像のURLを利用
//                   style={styles.badgeIcon}
//                 />
//               ))}
//             </View>
//           ) : (
//             <Text style={styles.profileText}>まだバッジはありません。</Text>
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E6F2F9",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   section: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     margin: 10,
//   },
//   settingItem: {
//     marginBottom: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   profileDetails: {
//     flexDirection: "column",
//   },
//   profileText: {
//     fontSize: 18,
//     marginBottom: 10,
//     color: "#333",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 8,
//     marginBottom: 10,
//     flex: 1,
//   },
//   saveButton: {
//     backgroundColor: "#4CAF50",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   editButton: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   buttonText: {
//     color: "#fff",
//     textAlign: "center",
//   },
//   badgeContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 10,
//   },
//   badgeIcon: {
//     width: 50,
//     height: 50,
//     margin: 5,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   editContainer: {
//     flexDirection: "column",
//   },
//   infoContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
// });

// export default Profile;

// // 修正前
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import Header from "../header";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { getAuth } from "firebase/auth";

// const Profile: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
//   const handleBack = () => {
//     console.log("aa");
//     onGoBack();
//   };

//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState({
//     name: "",
//     id: "",
//     waterGoal: 0,
//   });

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user || !user.uid) {
//           console.error("ログイン中のユーザーがいません");
//           return null;
//         }
//         const firestore = getFirestore(); // Firestoreのインスタンスを取得
//         const userId = user?.uid; // ログイン中のユーザーIDを取得する必要あり
//         const profileRef = doc(firestore, "users", userId);
//         const profileSnap = await getDoc(profileRef);

//         if (profileSnap.exists()) {
//           const data = profileSnap.data();
//           setProfile({
//             name: data.name || "",
//             id: profileSnap.id || "",
//             waterGoal: data.waterGoal || 0,
//           });
//         } else {
//           Alert.alert("エラー", "プロフィール情報が見つかりません");
//         }
//       } catch (error) {
//         console.error("プロフィール取得エラー:", error);
//         Alert.alert("エラー", "プロフィール情報を取得できませんでした");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <Header title="プロフィール" back="Back" onBackPress={handleBack} />
//       <ScrollView style={styles.scrollContainer}>
//         {/* Profile Section */}
//         {/* <View style={styles.profileSection}>
//                     <Image
//                         source={require('@/assets/images/dittrau.png')}
//                         style={styles.icon}
//                     />
//                     <View style={styles.profileDetails}>
//                         <Text style={styles.profileText}>Name</Text>
//                     </View>
//                     <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
//                 </View> */}

//         {/* 自分の紹介 Section */}
//         <View style={styles.section}>
//           <View style={styles.settingItem}>
//             <Text style={styles.sectionTitle}>自分の紹介</Text>
//             <TouchableOpacity>
//               <Text>修正</Text>
//             </TouchableOpacity>
//           </View>

//           {loading ? (
//             <Text>プロフィールを読み込んでいます...</Text>
//           ) : (
//             <>
//               <Image
//                 source={require("@/assets/images/dittrau.png")}
//                 style={styles.icon}
//               />
//               <View style={styles.profileDetails}>
//                 <Text
//                   style={styles.profileText}
//                 >{`名前: ${profile.name}`}</Text>
//                 <Text style={styles.profileText}>{`ID: ${profile.id}`}</Text>
//                 <Text
//                   style={styles.profileText}
//                 >{`毎日の目標: ${profile.waterGoal}ml`}</Text>
//               </View>
//             </>
//           )}
//         </View>

//         {/* 毎日の目標 Section */}
//         <View style={styles.section}>
//           <View style={styles.settingItem}>
//             <Text style={styles.sectionTitle}>毎日の目標:</Text>
//             <TouchableOpacity>
//               <Text>修正</Text>
//             </TouchableOpacity>
//           </View>
//           <Image
//             source={require("@/assets/images/water.png")} // Chỉnh đường dẫn hình ảnh nếu cần
//             style={styles.goalIcon}
//           />
//         </View>

//         {/* 取得したバッジ Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>取得したバッジ:</Text>
//           <View style={styles.badgeContainer}>
//             <Image
//               source={require("@/assets/images/dittrau.png")} // Chỉnh đường dẫn hình ảnh nếu cần
//               style={styles.badgeIcon}
//             />
//             <Image
//               source={require("@/assets/images/badge2.jpg")}
//               style={styles.badgeIcon}
//             />
//             <Image
//               source={require("@/assets/images/badge3.jpg")}
//               style={styles.badgeIcon}
//             />
//             <Image
//               source={require("@/assets/images/badge4.jpg")}
//               style={styles.badgeIcon}
//             />
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#E6F2F9",
//   },
//   scrollContainer: {
//     flex: 1,
//   },
//   profileSection: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     margin: 10,
//     borderRadius: 10,
//   },
//   icon: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 15,
//   },
//   angle_right: {
//     width: 20,
//     height: 20,
//   },
//   profileDetails: {
//     flexDirection: "column",
//   },
//   profileText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   section: {
//     backgroundColor: "#fff",
//     padding: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     margin: 10,
//   },
//   settingItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   infoItem: {
//     flexDirection: "row",
//     marginBottom: 10,
//   },
//   infoLabel: {
//     fontSize: 16,
//     color: "#555",
//     flex: 1,
//   },
//   infoText: {
//     fontSize: 16,
//     color: "#333",
//     flex: 2,
//   },
//   goalIcon: {
//     width: 40,
//     height: 40,
//     marginTop: 10,
//   },
//   badgeContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginTop: 10,
//   },
//   badgeIcon: {
//     width: 40,
//     height: 40,
//     marginRight: 10,
//   },
// });

// export default Profile;
