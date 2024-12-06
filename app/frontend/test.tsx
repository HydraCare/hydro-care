import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const test2: React.FC = () => {
    const dailyGoal = 2000; // Mục tiêu uống nước mỗi ngày (2000ml)
    const [amount, setAmount] = useState(dailyGoal); // Số lượng nước đã uống (bắt đầu với mục tiêu)
    const [remaining, setRemaining] = useState(dailyGoal); // Số nước còn lại cần uống
    const [waterLevel] = useState(new Animated.Value(100)); // Animated value để hiển thị mức nước (ban đầu 100%)

    // Hàm trừ nước khi nhấn nút
    const subWater = (amountSub: number) => {
        const newAmount = amount - amountSub; // Tính lượng nước đã uống sau khi trừ đi amountSub
        const newRemaining = dailyGoal - newAmount; // Tính lượng nước còn lại cần uống

        // Cập nhật trạng thái
        setAmount(newAmount);
        setRemaining(newRemaining);

        // Cập nhật mức nước với animation
        Animated.timing(waterLevel, {
            toValue: (newAmount / dailyGoal) * 100, // Tính tỷ lệ phần trăm mức nước
            duration: 1500, // Thời gian animation
            useNativeDriver: false, // Không sử dụng native driver vì chúng ta đang thay đổi chiều cao
        }).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.bottleContainer}>
                <Icon name="glass" size={150} color="#008CBA" />

                <Animated.View
                    style={[
                        styles.water,
                        {
                            height: waterLevel.interpolate({
                                inputRange: [0, 100],
                                outputRange: ['0%', '100%'], // Thay đổi chiều cao theo phần trăm
                            }),
                        },
                    ]}
                />
            </View>

            {/* Nút để giảm nước */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => subWater(100)} // Trừ 100ml nước mỗi lần nhấn
            >
                <Text style={styles.buttonText}>Remove 100ml</Text>
            </TouchableOpacity>

            {/* Thông tin nước đã uống và nước còn lại */}
            <Text style={styles.infoText}>
                {`Water consumed: ${amount} ml\nRemaining: ${remaining} ml`}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
    },
    bottleContainer: {
        width: 150,
        height: 350, // Chiều cao chai nước
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderColor: '#000',
        borderWidth: 2,
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden',
    },
    water: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#00bfff',
        borderRadius: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    infoText: {
        fontSize: 18,
        marginTop: 20,
    },
});

export default test2;
