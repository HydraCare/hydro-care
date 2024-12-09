import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Header from '../header';
import { useNavigation } from 'expo-router';
import { useRoute } from '@react-navigation/native';

// const Profile: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {

const Public_Profile = ({ navigation }: any) => {
    // const { profile } = route.params;
    const handleBack = () => {
        console.log("aa")
        navigation.goBack()
    }

    return (
        <View style={styles.container}>
            <Header title="フォロー中" back='Back' onBackPress={handleBack} />
            <ScrollView style={styles.scrollContainer}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={require('@/assets/images/dittrau.png')}
                        style={styles.icon}
                    />
                    <View style={styles.profileDetails}>
                        <Text style={styles.profileText}>Name</Text>
                    </View>
                    <Image source={require('@/assets/images/angle-right.png')} style={styles.angle_right} />
                </View>

                {/* 自分の紹介 Section */}
                <View style={styles.section}>
                    <View style={styles.settingItem}>
                        <Text style={styles.sectionTitle}>自分の紹介</Text>

                    </View>

                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>ID:</Text>
                        <Text style={styles.infoText}>ABT12345</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>性別:</Text>
                        <Text style={styles.infoText}>男性</Text>
                    </View>
                    {/* <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>生年月日:</Text>
                        <Text style={styles.infoText}>1990/01/01</Text>
                    </View> */}
                    <View style={styles.infoItem}>
                        <Text style={styles.infoLabel}>趣味:</Text>
                        <Text style={styles.infoText}>読書</Text>
                    </View>
                </View>

                {/* 毎日の目標 Section */}
                <View style={styles.section}>
                    <View style={styles.settingItem}>
                        <Text style={styles.sectionTitle}>毎日の目標:</Text>

                    </View>
                    <Image
                        source={require('@/assets/images/water.png')} // Chỉnh đường dẫn hình ảnh nếu cần
                        style={styles.goalIcon}
                    />
                </View>

                {/* 取得したバッジ Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>取得したバッジ:</Text>
                    <View style={styles.badgeContainer}>
                        <Image
                            source={require('@/assets/images/plus.png')} // Chỉnh đường dẫn hình ảnh nếu cần
                            style={styles.badgeIcon}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',

    },
    scrollContainer: {
        flex: 1,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        margin: 10,
        borderRadius: 10,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    angle_right: {
        width: 20,
        height: 20,
    },
    profileDetails: {
        flexDirection: 'column',
    },
    profileText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    section: {
        backgroundColor: '#fff',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        margin: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    infoLabel: {
        fontSize: 16,
        color: '#555',
        flex: 1,
    },
    infoText: {
        fontSize: 16,
        color: '#333',
        flex: 2,
    },
    goalIcon: {
        width: 40,
        height: 40,
        marginTop: 10,
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    badgeIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
});

export default Public_Profile;