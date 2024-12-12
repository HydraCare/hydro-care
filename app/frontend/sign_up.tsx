import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Svg, { Path } from "react-native-svg";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "./firebase"; // Ensure this is correctly imported
import { doc, setDoc } from "firebase/firestore"; // Use Firestore for saving user data

const { width } = Dimensions.get("window");

const Register: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Added confirm password field
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false); //  loading
    const registerNewUser = async () => {
        if (password !== confirmPassword) {
            // Check if passwords match
            Alert.alert("Error", "Passwords do not match!");
            return;
        }
        try {
            setIsLoading(true);
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userId = user.uid; // Automatically generated ID

            // Store user data in Firestore
            await setDoc(doc(firestore, "users/" + userId), {
                email: email,
                password: password,
                createdAt: new Date(),
            });

            console.log("User created successfully with ID:", userId);
            onLoginSuccess();
            setIsLoading(false);
            console.log("情報入力 TAB 移動")
            navigation.navigate("Sign_up_info", { userId });
        } catch (error) {
            setIsLoading(false);
            Alert.alert("エラー", "既にユーザー登録されています！！");
            console.error("Error creating user:");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>新規登録</Text>

            {/* メールアドレス入力フィールド */}
            <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={24} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder="sample@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Ionicons name={email ? "checkmark-circle" : "ellipse-outline"} size={24} color={email ? "green" : "gray"} />
            </View>

            {/* パスワード入力フィールド */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder="パスワード"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* パスワード確認 */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder="パスワード確認"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray" />
                </TouchableOpacity>
            </View>

            {/* 登録ボタン */}
            <TouchableOpacity style={styles.loginButton} onPress={registerNewUser}>
                <Text style={styles.loginButtonText}>アカウントを作成</Text>
            </TouchableOpacity>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                </View>
            )}
            {/* 既にアカウントをお持ちの方 */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.registerText}>既にアカウントをお持ちですか？</Text>
            </TouchableOpacity>

            {/* SVG波のデザイン */}
            <View style={styles.waveContainer}>
                <Svg height="100%" width={width} viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <Path
                        fill="#ffffff"
                        fillOpacity="1"
                        d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,192C672,192,768,128,864,122.7C960,117,1056,171,1152,213.3C1248,256,1344,288,1392,304L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                    />
                </Svg>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#a2d9ff",
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    title: {
        fontSize: 35,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 10,
        width: width * 0.8,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    input: {
        flex: 1,
        paddingHorizontal: 10,
        color: "#999fa1",
    },
    loginButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
        width: width * 0.8,
        alignItems: "center",
    },
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    registerText: {
        color: "#333",
        fontWeight: "bold",
        padding: 10,
    },
    waveContainer: {
        width: "100%",
        height: 200,
        marginTop: 20,
    },
    loadingContainer: {
        margin: 20,
    }
});

export default Register;
