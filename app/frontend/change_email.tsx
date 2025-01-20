// change_email.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import {
  getAuth,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

const ChangeEmail: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const handleEmailChange = async () => {
    if (!currentPassword || !newEmail) {
      Alert.alert("エラー", "全ての項目を入力してください");
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      Alert.alert("エラー", "現在のユーザー情報が取得できません");
      return;
    }

    try {
      // 現在のパスワードで再認証
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Firebaseでメールアドレスを更新
      await updateEmail(user, newEmail);

      Alert.alert("成功", "メールアドレスが正常に変更されました");
      onGoBack();
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/wrong-password") {
        Alert.alert("エラー", "現在のパスワードが正しくありません");
      } else if (error.code === "auth/requires-recent-login") {
        Alert.alert("エラー", "もう一度ログインし直してください");
      } else {
        Alert.alert(
          "エラー",
          `メールアドレスの変更中にエラーが発生しました: ${error.message}`
        );
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>メールアドレス変更</Text>

        <View style={styles.formContainer}>
          <Text style={styles.label}>現在のパスワード</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholder="現在のパスワードを入力"
            secureTextEntry
          />

          <Text style={styles.label}>新しいメールアドレス</Text>
          <TextInput
            style={styles.input}
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="新しいメールアドレスを入力"
            keyboardType="email-address"
          />
        </View>

        <TouchableOpacity
          style={styles.changeButton}
          onPress={handleEmailChange}
        >
          <Text style={styles.changeButtonText}>メールアドレスを変更</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
          <Text style={styles.backButtonText}>戻る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#E6F2F9",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
  },
  changeButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },
  changeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#ADD8E6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  backButtonText: {
    color: "black",
    fontSize: 16,
  },
});

export default ChangeEmail;
