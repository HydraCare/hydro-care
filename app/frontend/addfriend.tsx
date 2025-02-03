import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import Header from '../header';
import { arrayUnion, doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore } from './firebase';
import { set } from 'firebase/database';
// const AddFriend: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
const AddFriend: React.FC<{
    onFriendAdded: () => void;
    onGoBack: () => void;
}> = ({ onFriendAdded, onGoBack }) => {
    const [id, setId] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [friendId, setFriendId] = useState("");
    const [friendList, setFriendList] = useState<string[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isFriend, setIsFriend] = useState(true)
    const handleBack = () => {
        console.log("aa")
        onGoBack()
    }
    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (currentUser) {
            setUserId(currentUser.uid);
        }
    }, []);
    useEffect(() => {
        if (id.trim() === "") {
            setSearchResults([]);
            return;
        }

        const fetchUser = async () => {
            try {
                // Lấy thông tin người dùng theo ID đã nhập
                const db = getFirestore();
                const userRef = doc(db, "users", id);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    setSearchResults([{
                        id: docSnap.id,
                        Name: userData.name || "Unknown",
                        image: userData.image || null
                    }]);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("検索エラー:", error);
                setSearchResults([]);
            }

            try {
                if (userId) {
                    const db = getFirestore();
                    const userRef = doc(db, "users", userId);
                    const docSnap = await getDoc(userRef);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        const friends = userData.friends || [];

                        if (friends.includes(id)) {
                            console.log("co")
                            setIsFriend(true)
                            setSearchResults(prevResults => {
                                return prevResults.map(result =>
                                    result.id === id

                                        ? { ...result }
                                        : result
                                );
                            });
                        } else {
                            console.log("k co")
                            setIsFriend(false)
                            setSearchResults(prevResults => {
                                return prevResults.map(result =>
                                    result.id === id
                                        ? { ...result }
                                        : result
                                );
                            });
                        }
                    }
                }
            } catch (error) {
                console.error("エラー:", error);
            }
        };
        fetchUser();
    }, [id])
    const handleAddFriend = async (friendId: string) => {
        if (!userId) {
            Alert.alert("エラー", "ユーザーがログインしていません。");
            return;
        }

        try {
            const db = getFirestore();
            const userDocRef = doc(db, "users", userId);

            await updateDoc(userDocRef, {
                friends: arrayUnion(friendId),
            });

            Alert.alert("成功", "フレンドが追加されました！");
            setFriendList([...friendList, friendId]);
            onFriendAdded();
        } catch (error) {
            console.error("Error adding friend:", error);
            Alert.alert("エラー", "フレンドの追加に失敗しました。");
        }
    };
    return (

        <View style={styles.container}>
            <Header title="検索" back='Back' onBackPress={handleBack} />
            <Text style={styles.text}>IDで検索</Text>
            {/* Wrapper cho TextInput */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={id}
                    onChangeText={(text) => setId(text)}
                    placeholder=" 検索"
                />
            </View>
            <View style={styles.hr} />
            <ScrollView style={styles.logsContainer}>
                {searchResults.length > 0 ? (
                    searchResults.map((user, index) => {
                        return (
                            <View key={index} style={styles.logItem}>
                                <View style={styles.infoContainer}>
                                    {user.image ? (
                                        <Image source={{ uri: user.image }} style={styles.icon} />
                                    ) : (
                                        <Image source={require("@/assets/images/icon_user.png")} style={styles.icon} />
                                    )}
                                    <View style={styles.textContainer}>
                                        <Text>Name : {user.Name}</Text>
                                        <Text>ID : {user.id.slice(0, 5)}...</Text>
                                    </View>
                                </View>

                                {isFriend ? (

                                    <View style={styles.label_text}>
                                        <Text style={styles.buttonText}>Following</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.add_button}
                                        onPress={() => handleAddFriend(user.id)}
                                    >
                                        <Text style={styles.buttonText}>Follow</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.noResultText}>該当する結果がありません</Text>
                )}

            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    label_text: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 10,
        // marginRight: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        paddingLeft: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderWidth: 1,
        fontSize: 18,
        paddingLeft: 10,
        marginRight: 10,
        borderRadius: 8,
    },
    hr: {
        width: '90%',
        height: 2,
        backgroundColor: '#4CAEE8',
        marginTop: 30,
        marginLeft: 15,
    },
    logsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#E6F2F9',
        borderRadius: 10,
    },
    logItem: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
    },
    infoContainer: {
        width: "75%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    add_button: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 10,
        marginRight: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 15,
        color: 'black',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ADD8E6',
        borderRadius: 8,
    },
});


export default AddFriend;
