import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Header from '../header';

const Challenge: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <Header title="バッジ、チャレンジ" back="" />

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statTitle}>総ログイン日数</Text>
                    <Text style={styles.statValue}>日</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statTitle}>総水分摂取量</Text>
                    <Text style={styles.statValue}>ml</Text>
                </View>
            </View>

            {/* Các badge (challenges) */}
            <View style={styles.badgesContainer}>
                <View style={styles.badgeItem}>
                    <Image source={require('@/assets/images/badge.png')} style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>初めての記録</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image source={require('@/assets/images/badge.png')} style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>1日の目標達成</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image source={require('@/assets/images/badge.png')} style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>3種類の飲み物</Text>
                </View>
                <View style={styles.badgeItem}>
                    <Image source={require('@/assets/images/badge.png')} style={styles.badgeIcon} />
                    <Text style={styles.badgeText}>1か月の目標達成</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    statItem: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        width: '45%',
        alignItems: 'center',
    },
    statTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    statValue: {
        fontSize: 20,
        color: '#4CAF50',
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginTop: 30,
    },
    badgeItem: {
        alignItems: 'center',
        width: '40%',
        marginBottom: 20,
    },
    badgeIcon: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    badgeText: {
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Challenge;
