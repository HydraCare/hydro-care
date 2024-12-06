import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";


const { width } = Dimensions.get("window");
const Login: React.FC<LoginScreenProps> = ({ navigation, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Danh sách tài khoản ảo
  const accounts = [
    { email: "user@gmail.com", password: "1" },
    { email: "user2@gmail.com", password: "password2" },
    { email: "user3@gmail.com", password: "password3" },
  ];

  // Hàm xử lý đăng nhập
  const handleLogin = () => {
    const account = accounts.find(
      (account) => account.email === email && account.password === password
    );

    if (account) {
      console.log("login Success")
      onLoginSuccess();
    } else {
      Alert.alert("Invalid credentials", "Username or password is incorrect");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {/* Input email */}
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

      {/* Input password */}
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

      {/* Login button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>ログイン</Text>
      </TouchableOpacity>

      {/* Forget password link */}
      {/* <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}> */}
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>パスワードをお忘れの方</Text>
      </TouchableOpacity>

      {/* SVG for design */}
      <View style={styles.waveContainer}>
        <Svg
          height="100%"
          width={width}
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <Path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,224L48,197.3C96,171,192,117,288,122.7C384,128,480,192,576,192C672,192,768,128,864,122.7C960,117,1056,171,1152,213.3C1248,256,1344,288,1392,304L1440,320L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
          />
        </Svg>
      </View>

      {/* Register link */}
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>アカウントをお持ちでない方は </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.registerLink}>新規登録</Text>
        </TouchableOpacity>
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
  forgotPasswordText: {
    color: "#4A90E2",
    marginTop: 10,
  },
  waveContainer: {
    width: "100%",
    height: 200,
    marginTop: 20,
  },
  registerContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  registerText: {
    color: "#333",
    fontSize: 15
  },
  registerLink: {
    color: "#4A90E2",
    fontWeight: "bold",
    fontSize: 15
  },
});

export default Login;
