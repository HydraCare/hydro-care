import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const Login: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Danh sách tài khoản ảo
    const accounts = [
        { username: 'user1', password: 'password1' },
        { username: 'user2', password: 'password2' },
        { username: 'user3', password: 'password3' },
    ];

    const handleLogin = () => {
        const account = accounts.find((account) => account.username === username && account.password === password);

        if (account) {
            onLoginSuccess(); // Gọi hàm khi đăng nhập thành công
        } else {
            Alert.alert('Invalid credentials', 'Username or password is incorrect');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingLeft: 8,
    },
});

export default Login;
