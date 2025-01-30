import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
} from "react-native";
import Header from "../header";
import AddFriend from "./addfriend";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Firebase Authenticationを利用

const Friend: React.FC = () => {
    const [friends, setFriends] = useState<any[]>([]);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null); // ユーザーIDをnullで初期化
    const [currentScreen, setCurrentScreen] = useState("Friend"); // 現在の画面状態を管理

    useEffect(() => {
        // ログイン中のユーザーIDを取得
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setCurrentUserId(currentUser.uid);
        } else {
            console.error("ユーザーがログインしていません");
        }
    }, []);

    useEffect(() => {
        const fetchFriends = async () => {
            if (!currentUserId) return;
            try {
                const db = getFirestore();
                const userDocRef = doc(db, "users", currentUserId);
                const unsubscribeUser = onSnapshot(userDocRef, async (userSnapshot) => {
                    if (userSnapshot.exists()) {
                        const userData = userSnapshot.data();
                        const friendIds = userData?.friends || [];

                        if (friendIds.length > 0) {
                            const usersRef = collection(db, "users");
                            const q = query(usersRef, where("__name__", "in", friendIds));
                            const unsubscribeFriends = onSnapshot(q, (querySnapshot) => {
                                const fetchedFriends = querySnapshot.docs.map((doc) => ({
                                    ...doc.data(),
                                    docId: doc.id,
                                }));
                                setFriends(fetchedFriends);
                            });
                            return () => {
                                unsubscribeFriends();
                            };
                        } else {
                            setFriends([]);
                        }
                    }
                });
                return () => {
                    unsubscribeUser();
                };
            } catch (error) {
                console.error("Error fetching friends in real-time:", error);
            }

        };

        fetchFriends();
    }, [currentUserId]);

    const navigateToAddFriend = () => {
        setCurrentScreen("AddFriend");
    };

    const goBackToFriend = () => {
        setCurrentScreen("Friend");
    };

    return (
        <View style={styles.container}>
            {currentScreen === "Friend" ? (
                <>
                    <Header title="共有中" />
                    <View style={styles.homeContainer}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={navigateToAddFriend}
                        >
                            <Text style={styles.buttonText}>IDで追加する</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={styles.textContainer}>フォロー中</Text>
                    </View>
                    <ScrollView style={styles.logsContainer}>
                        {friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <View key={index} style={styles.logItem}>
                                    <View>
                                        <Image
                                            source={friend.image ? { uri: friend.image } : require('@/assets/images/icon_user.png')}
                                            style={styles.icon}
                                        />
                                    </View>
                                    <View>
                                        <Text>Name : {friend.name}</Text>
                                        <Text>毎日の目標 : {friend.waterGoal} ㎖</Text>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noFriendsText}>
                                フォローしているユーザーはいません
                            </Text>
                        )}
                    </ScrollView>
                </>
            ) : (
                <AddFriend onGoBack={goBackToFriend} onFriendAdded={goBackToFriend} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E6F2F9",
    },
    homeContainer: {
        paddingTop: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: "#ADD8E6",
        borderRadius: 8,
    },
    buttonText: {
        fontSize: 18,
        color: "black",
    },
    textContainer: {
        fontSize: 30,
        fontWeight: "bold",
        padding: 15,
    },
    logsContainer: {
        marginTop: 10,
        padding: 10,
        backgroundColor: "#E6F2F9",
        borderRadius: 10,
    },
    logItem: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        flexDirection: "row",
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 15,
    },
    noFriendsText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginTop: 20,
    },
});

export default Friend;

// import React, { useState } from "react";
// import {
//     View,
//     Text,
//     TouchableOpacity,
//     StyleSheet,
//     ScrollView,
//     Image,
// } from "react-native";
// import AddFriend from "./addfriend";
// import Header from "../header";
// import Setting from "./setting";
// import Profile from "./profile";
// const Friend: React.FC<{ onNavigate: () => void }> = ({ onNavigate }) => {
//     const [follow] = useState([
//         {
//             Name: "tomo-tin",
//             id: "1001",
//             water: "2500 ",
//             image: require("@/assets/images/image.jpg"),
//         },
//         {
//             Name: "Trang",
//             id: "1002",
//             water: "2600 ",
//             image: require("@/assets/images/dittrau.png"),
//         },
//         {
//             Name: "Fukuda-tin",
//             id: "1003",
//             water: "2700 ",
//             image: require("@/assets/images/nobu.jpg"),
//         },
//     ]);

//     return (
//         <View style={styles.container}>
//             <Header title="共有中" />
//             <View style={styles.homeContainer}>
//                 <TouchableOpacity style={styles.button} onPress={onNavigate}>
//                     <Text style={styles.buttonText}>IDで追加する</Text>
//                 </TouchableOpacity>
//             </View>
//             <View>
//                 <Text style={styles.textContainer}>フォロー中</Text>
//             </View>
//             <ScrollView style={styles.logsContainer}>
//                 {follow.map((log, index) => (
//                     <View key={index} style={styles.logItem}>
//                         <View>
//                             <Image source={log.image} style={styles.icon} />
//                         </View>
//                         <View>
//                             <View>
//                                 <Text>Name : {log.Name} </Text>
//                             </View>
//                             <View>
//                                 <Text>毎日の目標 : {log.water} ㎖</Text>
//                             </View>
//                         </View>
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     );
// };
// const App: React.FC = () => {
//     const [currentScreen, setCurrentScreen] = useState("Friend"); // Trạng thái màn hình hiện tại

//     const navigateToAddFriend = () => {
//         console.log("aa");
//         setCurrentScreen("AddFriend"); // Chuyển sang màn hình AddFriend
//     };

//     const goBackToFriend = () => {
//         setCurrentScreen("Friend");
//     };

//     function onFriendAdded(): void {
//         throw new Error("Function not implemented.");
//     }

//     return (
//         <View style={styles.container}>
//             {/* Điều hướng hiển thị màn hình Friend và AddFriend */}
//             {currentScreen === "Friend" ? (
//                 <Friend onNavigate={navigateToAddFriend} />
//             ) : (
//                 <AddFriend onGoBack={goBackToFriend} />
//             )}
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         // paddingTop: 20,
//         backgroundColor: "#E6F2F9",
//     },
//     homeContainer: {
//         paddingTop: 20,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     button: {
//         paddingVertical: 10,
//         paddingHorizontal: 30,
//         backgroundColor: "#ADD8E6",
//         borderRadius: 8,
//     },
//     buttonText: {
//         fontSize: 18,
//         color: "black",
//     },
//     textContainer: {
//         fontSize: 30,
//         fontWeight: "bold",
//         padding: 15,
//     },
//     logsContainer: {
//         marginTop: 10,
//         padding: 10,
//         backgroundColor: "#E6F2F9",
//         borderRadius: 10,
//     },
//     logItem: {
//         padding: 10,
//         marginBottom: 10,
//         backgroundColor: "#D9D9D9",
//         borderRadius: 10,
//         flexDirection: "row",
//     },
//     icon: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         marginRight: 15,
//     },
//     addFriendContainer: {
//         alignItems: "center",
//         backgroundColor: "#E6F2F9",
//         padding: 20,
//         borderRadius: 8,
//     },
//     title: {
//         fontSize: 24,
//         fontWeight: "bold",
//         marginBottom: 20,
//     },
// });

// export default App;
