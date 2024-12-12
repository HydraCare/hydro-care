import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import Header from '../header';
import { getAuth } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { database, firestore } from './firebase';
import { doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
const Sign_up_info = ({ navigation }: any) => {
    const [userId, setUserId] = useState(""); // State for user ID
    const [currentPage, setCurrentPage] = useState(0);
    const [name, setName] = useState('');
    const [gender, setGender] = useState('');
    const [waterGoal, setWaterGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false); //  loading
    //firebase 関連コード
    useEffect(() => {

        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
            setUserId(user.uid); // Save the user ID from Firebase Authentication
        }
    }, []);
    const updateUserData = async () => {
        setIsLoading(true);
        if (!userId) {
            Alert.alert("Error", "User is not logged in.");
            return;
        }
        const db = getFirestore();
        const userRef = doc(db, "users", userId); // Reference to the user's document in Firestore
        try {
            // Update the user data
            await updateDoc(userRef, {
                name: name,
                gender: gender,
                createdAt: new Date().toString(),
                waterGoal: waterGoal,
            });
            const updatedUserDoc = await getDoc(userRef);
            if (updatedUserDoc.exists()) {
                const updatedUserData = [
                    { name: updatedUserDoc.data().name },
                    { gender: updatedUserDoc.data().gender },
                    { createdAt: updatedUserDoc.data().createdAt },
                    { waterGoal: updatedUserDoc.data().waterGoal }
                ];
                console.log("User data updated successfully:", updatedUserData);

                navigation.navigate("Home", { userId });
                setIsLoading(false);
            }
            Alert.alert("Success", "User data updated successfully!");
        } catch (error) {
            setIsLoading(false);
            console.error("Error updating user data:",);
            Alert.alert("Error", "An error occurred while updating user data.");
        }
    }

    const handleNext = () => {
        if (currentPage === 0) {
            if (name) {

                setCurrentPage(1);

            } else {
                Alert.alert('名前を入力してください'); // Please enter a name
            }
        } else if (currentPage === 1) {
            if (gender) {

                setCurrentPage(2);

            } else {
                Alert.alert('性別を選択してください'); // Please select gender
            }
        } else if (currentPage === 2) {
            if (waterGoal) {
                // Final submission to Firebase and show completion alert
                Alert.alert('登録完了'); // Registration complete
                updateUserData();
            } else {
                Alert.alert('1日の水分目標を入力してください'); // Please enter a daily water goal
            }
        }
    };
    const renderPage = () => {
        if (currentPage === 0) {
            return (
                <View style={styles.page}>

                    <Text style={styles.title}>名前を入力してください</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="名前"
                        value={name}
                        onChangeText={setName}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>次へ</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (currentPage === 1) {
            return (
                <View style={styles.page}>
                    <Text style={styles.title}>性別は</Text>
                    <TouchableOpacity onPress={() => setGender('男性')} style={styles.optionButton}>
                        <Text style={styles.optionText}>男性</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('女性')} style={styles.optionButton}>
                        <Text style={styles.optionText}>女性</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setGender('その他')} style={styles.optionButton}>
                        <Text style={styles.optionText}>その他</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>次へ</Text>
                    </TouchableOpacity>
                </View>
            );
        } else if (currentPage === 2) {
            return (
                <View style={styles.page}>
                    <Text style={styles.title}>1日の水分目標</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="目標水分量（ml）"
                        keyboardType="numeric"
                        value={waterGoal}
                        onChangeText={setWaterGoal}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleNext}>
                        <Text style={styles.buttonText}>次へ</Text>
                    </TouchableOpacity>
                    {isLoading && (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4A90E2" />
                        </View>
                    )}
                </View>

            );
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container_page}>
            <Header title="新規登録" back='Back' />
            <View style={styles.container}>
                {renderPage()}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container_page: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E6F2F9',
        padding: 20,
    },
    page: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 50,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    optionButton: {
        backgroundColor: '#f0f0f0',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginBottom: 10,
    },
    optionText: {
        fontSize: 18,
        color: '#333',
    },
    loadingContainer: {
        margin: 20,
    }
});

export default Sign_up_info;
