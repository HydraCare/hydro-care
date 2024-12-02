import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Header from '../header';

type ChartData = {
    labels: string[];
    datasets: {
        data: number[];
    }[];
};

type Summary = {
    total: number;
    average: number;
};

type ChartDataMap = {
    day: ChartData;
    week: ChartData;
    month: ChartData;
    year: ChartData;
};

const WaterIntakeHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month' | 'year'>('day'); //初期：day

    // 仮のデータ
    const chartData: ChartDataMap = {
        day: {
            labels: ['00:00', '06:00', '12:00', '18:00', '24:00'],
            datasets: [
                {
                    data: [500, 1200, 1500, 1800, 2000],
                },
            ],
        },
        week: {
            labels: ['月', '火', '水', '木', '金', '土', '日'],
            datasets: [
                {
                    data: [1000, 1500, 1200, 1800, 2000, 1500, 1700],
                },
            ],
        },
        month: {
            labels: ['10/01', '10/05', '10/10', '10/15', '10/20'],
            datasets: [
                {
                    data: [2000, 2500, 2200, 2100, 2400],
                },
            ],
        },
        year: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [
                {
                    data: [2500, 2800, 2000, 2200, 2300, 2100, 2400, 2500, 2600, 2400, 2700, 2900],
                },
            ],
        },
    };

    // Dữ liệu tổng kết
    const summary: Record<'week' | 'month' | 'year', Summary> = {
        week: {
            total: 4000,
            average: 1000,
        },
        month: {
            total: 10000,
            average: 1000,
        },
        year: {
            total: 120000,
            average: 10000,
        },
    };

    const handleTabChange = (tab: 'day' | 'week' | 'month' | 'year') => {
        setActiveTab(tab);
    };

    const chartConfig = {
        backgroundColor: '#E6F2F9',
        backgroundGradientFrom: '#E6F2F9',
        backgroundGradientTo: '#E6F2F9',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 100, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 10,
        },
    };
    // Dữ liệu log nước
    const waterLogs = [
        { time: '14:00', amount: 400, type: 'お冷' },
        { time: '16:00', amount: 500, type: 'お冷' },
        { time: '18:00', amount: 300, type: 'お冷' },
    ];
    const dataToDisplay = chartData[activeTab];

    return (
        <View style={styles.container}>
            <Header title="履歴" back='' />
            {/* Tab Navigation */}
            <ScrollView>
                <View style={styles.tabContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'day' && styles.activeTab]}
                        onPress={() => handleTabChange('day')}
                    >
                        <Text style={styles.tabText}>日</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'week' && styles.activeTab]}
                        onPress={() => handleTabChange('week')}
                    >
                        <Text style={styles.tabText}>週</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'month' && styles.activeTab]}
                        onPress={() => handleTabChange('month')}
                    >
                        <Text style={styles.tabText}>月</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'year' && styles.activeTab]}
                        onPress={() => handleTabChange('year')}
                    >
                        <Text style={styles.tabText}>年</Text>
                    </TouchableOpacity>
                </View>

                {/* Biểu đồ */}
                <Text style={styles.chartTitle}>
                    {activeTab === 'day'
                        ? '今日'
                        : activeTab === 'week'
                            ? '2024/10/13~2024/10/20'
                            : activeTab === 'month'
                                ? '2024年10月'
                                : '2024年'}
                </Text>
                <BarChart
                    data={dataToDisplay}
                    width={Dimensions.get('window').width - 50}
                    height={250}
                    chartConfig={chartConfig}
                    withHorizontalLabels={true}
                    showValuesOnTopOfBars={false}  //value top
                    yAxisLabel=""
                    yAxisSuffix="ml"
                />

                {/* Tổng kết */}
                <View style={styles.summaryContainer}>
                    <Text style={styles.summaryText}>
                        合計 : {summary[activeTab as 'week' | 'month' | 'year']?.total}ml
                    </Text>
                    <Text style={styles.summaryText}>
                        平均 : {summary[activeTab as 'week' | 'month' | 'year']?.average}ml
                    </Text>


                </View>

                {/* Log Nước */}
                <View style={styles.logsContainer}>
                    <Text style={styles.logsTitle}>今日のログ</Text>
                    <ScrollView style={styles.logsContainer}>
                        {waterLogs.map((log, index) => (
                            <View key={index} style={styles.logItem}>
                                <Text>{log.time} - {log.type} {log.amount}ml</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                <Button title="ログ表示" onPress={() => alert('ログ表示ボタンがクリックされました')} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
        // padding: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        padding: 20,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#B0C4DE',
        borderRadius: 10,
    },
    activeTab: {
        backgroundColor: '#ADD8E6',
    },
    tabText: {
        fontSize: 18,
        color: 'white',
    },
    chartTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    summaryContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    summaryText: {
        fontSize: 18,
        marginBottom: 10,
    },
    logsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    logsTitle: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    scrollView: {
        marginTop: 10,
    },
    logItem: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
    },
});

export default WaterIntakeHistory;
