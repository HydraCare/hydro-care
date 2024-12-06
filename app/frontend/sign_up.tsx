import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "./types"; //
import Svg, { Path } from "react-native-svg";

const { width } = Dimensions.get("window");

const Register: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <View style={styles.container}>
            {/* タイトル */}
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
                <Ionicons
                    name={email ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={email ? "green" : "gray"}
                />
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
                    <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>

            {/* パスワード確認 */}
            <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={24} color="black" />
                <TextInput
                    style={styles.input}
                    placeholder="パスワード確認"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                        name={showPassword ? "eye" : "eye-off"}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            </View>
            {/* 登録ボタン */}
            <TouchableOpacity style={styles.loginButton}>
                <Text style={styles.loginButtonText}>アカウントを作成</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.registerText}>既にアカウントをお持ちですか？</Text>
            </TouchableOpacity>

            {/* パスワードを忘れた場合 */}
            {/* <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
        <Text style={styles.forgotPasswordText}>アカウントをお持ちの方</Text>
      </TouchableOpacity> */}

            {/* SVG波のデザインを「パスワードをお忘れの方」のリンクの下に配置 */}
            <View style={styles.waveContainer}>
                <Svg
                    height="100%"
                    width={width}
                    viewBox="0 0 1440 320"
                    preserveAspectRatio="none" // レスポンシブ対応
                >
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
        backgroundColor: "#a2d9ff", // 上部の背景色を水色に変更
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: 20,
    },
    // 新規登録(テキスト)
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
    // プレースホルダ
    input: {
        flex: 1,
        paddingHorizontal: 10,
        color: "#999fa1",
    },
    // ログインボタン
    loginButton: {
        backgroundColor: "#4A90E2",
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        marginTop: 20,
        width: width * 0.8,
        alignItems: "center",
    },
    // ログインボタンのテキスト
    loginButtonText: {
        color: "#fff",
        fontSize: 18,
    },
    // パスワードをお忘れの方(テキスト)
    forgotPasswordText: {
        color: "#4A90E2",
        marginTop: 10,
    },
    // 波SVG
    waveContainer: {
        width: "100%",
        height: 200, // 波の高さを調整
        marginTop: 20, // 「パスワードをお忘れの方」リンクの下に配置
    },
    registerContainer: {
        position: "absolute",
        bottom: 20,
        flexDirection: "row",
        alignItems: "center",
    },
    // アカウントをお持ちでない方は(テキスト)
    registerText: {
        color: "#333",
        fontWeight: 'bold',
        padding: 10
    },
    // 新規登録リンク
    registerLink: {
        color: "#4A90E2",
        fontWeight: "bold",
    },
});

export default Register;
