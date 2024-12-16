import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const ChangePassword: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordChange = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('エラー', '全ての項目を入力してください');
            return;
        }

        if (newPassword.length < 8) {
            Alert.alert('エラー', 'パスワードは8文字以上である必要があります');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('エラー', '新しいパスワードが一致しません');
            return;
        }

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user || !user.email) {
            Alert.alert('エラー', '現在のユーザー情報が取得できません');
            return;
        }

        try {
            // 現在のパスワードで再認証
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Firebaseでパスワードを更新
            await updatePassword(user, newPassword);

            console.log('パスワード変更後のユーザー情報:');
            console.log('Email:', user.email);
            console.log('新しいパスワード:', newPassword);

            Alert.alert('成功', 'パスワードが正常に変更されました');
            onGoBack();
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/wrong-password') {
                Alert.alert('エラー', '現在のパスワードが正しくありません');
            } else if (error.code === 'auth/requires-recent-login') {
                Alert.alert('エラー', 'もう一度ログインし直してください');
            } else {
                Alert.alert('エラー', `パスワードの変更中にエラーが発生しました: ${error.message}`);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>パスワード変更</Text>

            <Text style={styles.label}>現在のパスワード</Text>
            <TextInput
                style={styles.input}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="現在のパスワードを入力"
                secureTextEntry
            />

            <Text style={styles.label}>新しいパスワード</Text>
            <TextInput
                style={styles.input}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="新しいパスワードを入力"
                secureTextEntry
            />

            <Text style={styles.label}>新しいパスワード（確認）</Text>
            <TextInput
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="新しいパスワードを再入力"
                secureTextEntry
            />
            

            <TouchableOpacity style={styles.changeButton} onPress={handlePasswordChange}>
                <Text style={styles.changeButtonText}>パスワードを変更</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                <Text style={styles.backButtonText}>戻る</Text>
            </TouchableOpacity>
        </View>
    );
};
// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    formContainer: {
        padding: 20,
        backgroundColor: 'white',
        margin: 15,
        borderRadius: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
    },
    changeButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    changeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        backgroundColor: '#ADD8E6',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    backButtonText: {
        color: 'black',
        fontSize: 16,
    },
});
export default ChangePassword ;