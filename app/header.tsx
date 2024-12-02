import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Water_Intake from './frontend/water_intake';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
interface HeaderProps {
    title: string;
    back?: string;
    onBackPress?: () => void;
}
const Header: React.FC<HeaderProps> = ({ title, back, onBackPress }) => {

    const navigation = useNavigation();
    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            console.log("ない")

        }
    };
    return (
        <View style={styles.header}>
            {/* Nút Back */}
            <TouchableOpacity style={styles.backButton} onPress={() => handleBackPress()}>
                <Text style={styles.backText}>{back}</Text>
            </TouchableOpacity>

            {/* Text ở giữa */}
            <Text style={styles.headerText}>{title}</Text>

            {/* Trống bên phải để căn giữa */}
            <View style={styles.rightSpacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',       // Sắp xếp ngang
        justifyContent: 'center',  // Căn giữa các phần tử
        alignItems: 'center',      // Căn giữa theo chiều dọc
        height: 60,
        backgroundColor: '#E6F2F9',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        fontFamily: 'UD Digi Kyokasho NP-R'
    },
    backButton: {
        position: 'absolute',   // Để nút back nằm ở bên trái
        left: 20,
    },
    backText: {
        fontSize: 18,
        color: '#007BFF',
    },
    headerText: {
        fontSize: 27,
        fontWeight: 'bold',
        fontFamily: 'UD Digi Kyokasho NP-R'
    },
    rightSpacer: {
        position: 'absolute',
        right: 20,
    }
});

export default Header;
