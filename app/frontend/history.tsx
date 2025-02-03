import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Button, Alert, Image } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import Header from '../header';
import { getAuth } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, Timestamp, where } from 'firebase/firestore';
interface Log {
    id: string;
    waterDrunk: number;
    day: string;
    hour: number;
    minute: number;
    Genre: string;
}
// const WaterIntakeHistory: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
const WaterIntakeHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'day' | 'week' | 'month' | 'year'>('day');//初期：day
    //firebase関連コード
    const [userId, setUserId] = useState(""); // State for user ID
    const [results, setResults] = useState<Log[]>([]);
    const today = new Date().toISOString().split("T")[0];
    const [monthlyTotal, setMonthlyTotal] = useState(0);
    const [day_Data, setDay_Data] = useState<{
        labels: string[];
        datasets: { data: number[] }[];
    }>({
        labels: [],
        datasets: [{ data: [] }],
    });
    const [week_Data, setWeek_Data] = useState<{
        labels: string[];
        datasets: { data: number[] }[];
    }>({
        labels: [],
        datasets: [{ data: [] }],
    });
    const [mouth_Data, setMouth_Data] = useState<{
        labels: string[];
        datasets: { data: number[] }[];
    }>({
        labels: [],
        datasets: [{ data: [] }],
    });
    // const [year_Data, setYear_Data] = useState<{
    //     labels: string[];
    //     datasets: { data: number[] }[];
    // }>({
    //     labels: [],
    //     datasets: [{ data: [] }],
    // });
    const [graphData, setGraphData] = useState<{
        labels: string[];
        datasets: { data: number[] }[];
    }>({
        labels: [],
        datasets: [{ data: [] }],
    });
    const [hasTabChanged, setHasTabChanged] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                setUserId(user.uid);
                const db = getFirestore();
                const targetDateStart = new Date(today);
                targetDateStart.setHours(0, 0, 0, 0);
                const targetDateEnd = new Date(today);
                targetDateEnd.setHours(23, 59, 59, 999);

                const logsRef = collection(db, "users", user.uid, "oneDayLog");
                const targetDateStartTimestamp = Timestamp.fromDate(targetDateStart);
                const targetDateEndTimestamp = Timestamp.fromDate(targetDateEnd);

                const q = query(
                    logsRef,
                    where("drunkTime", ">=", targetDateStartTimestamp),
                    where("drunkTime", "<=", targetDateEndTimestamp)
                );

                // real time
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const fetchedResults: Log[] = querySnapshot.docs.map((doc) => {
                        const docData = doc.data();
                        return {
                            id: doc.id,
                            waterDrunk: docData.waterDrunk,
                            day: docData.day,
                            hour: docData.hour,
                            minute: docData.minute,
                            Genre: docData.Genre,
                        };
                    });

                    // Gọi các hàm xử lý sau khi dữ liệu thay đổi
                    setResults(fetchedResults);

                    day_update();
                    week_update();
                    month_update();
                });

                // Cleanup subscription khi component unmount
                return () => unsubscribe();
            } else {
                Alert.alert("Error", "User is not logged in.");
            }
        };

        fetchData();
    }, [today]);
    // console.log("total result", results)
    //week graph

    const day_update = async () => {
        const db = getFirestore();

        const { startDate } = getWeekDateRange();
        const dayData: number[] = [];
        const filteredData = processDataForTab(results, "day");
        // useEffect();
        setGraphData(filteredData);
        if (!hasTabChanged) {
            // handleTabChange("day");
            setHasTabChanged(true);
        }

    };
    const week_update = async () => {
        const db = getFirestore();
        const week = ["月", "火", "水", "木", "金", "土", "日"];
        const { startDate } = getWeekDateRange();
        const weekData: number[] = [];

        try {
            for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                const formattedDate = formatDateToDocument(currentDate);
                const docRef = doc(db, "users", userId, "oneDayAmount", formattedDate);
                const docSnap = await getDoc(docRef);

                weekData.push(docSnap.exists() ? docSnap.data()?.AmountWaterDrunk : 0);
            }
            setWeek_Data({ labels: week, datasets: [{ data: weekData }] });
            console.log("Weekly data:", weekData);
        } catch (error) {
            console.log("Error fetching weekly logs from Firestore:", error);
            setWeek_Data({ labels: week, datasets: [{ data: new Array(7).fill(0) }] });
        }
    };

    const month_update = async () => {
        const db = getFirestore();
        const { startDate, endDate } = getWeekDateRange();
        const month = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

        if (!userId) {
            console.log("Error: userId is not defined desu");
            return;
        }

        try {
            const totalDaysInMonth = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0).getDate();
            let monthlyTotal = 0;
            const monthData: number[] = [];

            for (let i = 1; i <= totalDaysInMonth; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(i);
                const formattedDate = formatDateToDocument(currentDate);

                const docRef = doc(db, "users", userId, "oneDayAmount", formattedDate);
                const docSnap = await getDoc(docRef);

                const dailyAmount = docSnap.exists() ? docSnap.data()?.AmountWaterDrunk ?? 0 : 0;
                monthlyTotal += dailyAmount;
                monthData.push(dailyAmount);
            }

            setMouth_Data({ labels: month, datasets: [{ data: [monthlyTotal] }] });
            setMonthlyTotal(monthlyTotal);
            console.log("Total month amount:", monthlyTotal);
        } catch (error) {
            console.error("Error fetching logs from Firestore2:", error);

            setMouth_Data({ labels: month, datasets: [{ data: [0] }] });
        }
    };

    // 今日のデータ
    // console.log("results", results)
    const TotalWaterDrunk_Day = (logs: any[]) => {
        if (!logs || logs.length === 0) return 0;
        const total = logs.reduce((acc, log) => {
            const waterDrunk = parseInt(log.waterDrunk, 10);
            return acc + (isNaN(waterDrunk) ? 0 : waterDrunk);
        }, 0);
        return total;
    };
    const totalDay = TotalWaterDrunk_Day(results);
    console.log(`Total water drunk: ${totalDay}㎖`);
    const processChartData = (logs: Log[]) => {
        if (!logs || logs.length === 0) {
            return {
                labels: ['No Data'],
                datasets: [{ data: [0] }],
            };
        }
        const labels: string[] = [];
        const data: number[] = [];

        logs.forEach((log) => {
            const time = `${log.hour}:${log.minute < 10 ? `0${log.minute}` : log.minute}`;
            labels.push(time);
            data.push(log.waterDrunk);
        });
        return {
            labels,
            datasets: [{ data }],
        };
    };

    const formatDateToDocument = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}年${month}月${day}日`;
    };
    //グラフ処理
    const handleTabChange = async (tab: 'day' | 'week' | 'month') => {
        if (tab == 'day') {
            setActiveTab(tab);
            day_update();
        }

        if (tab == 'week') {
            setActiveTab(tab);
            setGraphData(week_Data);
            week_update();

        } else if (tab == 'month') {
            setActiveTab(tab);
            month_update();
            setGraphData(mouth_Data);
        } else {
            setActiveTab(tab);
        }
    }
    const chartConfig = {
        backgroundColor: '#E6F2F9',
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#E6F2F9',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 100, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        barPercentage: 0.4,
        style: {
            borderRadius: 5,
        },
    };

    const processDataForTab = (logs: Log[], tab: 'day' | 'week' | 'month') => {
        switch (tab) {
            case 'day':
                return processChartData(logs);
            case 'week':

            case 'month':

            // const monthData = logs.reduce((acc, log) => {
            //     const date = log.day;
            //     acc[date] = (acc[date] || 0) + log.waterDrunk;
            //     return acc;
            // }, {} as Record<string, number>);
            // return {
            //     labels: Object.keys(monthData),
            //     datasets: [{ data: Object.values(monthData) }],
            // };
            // case 'year':
            //     const yearData = logs.reduce((acc, log) => {
            //         const month = new Date(log.day).getMonth() + 1;
            //         acc[month] = (acc[month] || 0) + log.waterDrunk;
            //         return acc;
            //     }, {} as Record<number, number>);
            //     return {
            //         labels: Object.keys(yearData).map((m) => `月 ${m}`),
            //         datasets: [{ data: Object.values(yearData) }],
            //     };
            default:
                return processChartData(logs);
        }

    };
    console.log("graph", graphData)
    //week to
    const total_week = week_Data.datasets.reduce((total, dataset) => {
        return total + dataset.data.reduce((sum, value) => sum + value, 0);
    }, 0);
    //週、月、年を取得処理
    const getWeekDateRange = () => {
        const today = new Date();
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? -6 : 1 - currentDay;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + diff);
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + diff + 6);

        return { startDate, endDate };
    };
    // const dataToDisplay = chartData[activeTab];
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
                    {/* <TouchableOpacity
                        style={[styles.tab, activeTab === 'year' && styles.activeTab]}
                        onPress={() => handleTabChange('year')}
                    >
                        <Text style={styles.tabText}>年</Text>
                    </TouchableOpacity> */}
                </View>
                <Text style={styles.chartTitle}>
                    {activeTab === 'day'
                        ? '今日'
                        : activeTab === 'week'
                            ? (() => {
                                const { startDate, endDate } = getWeekDateRange(); // Lấy ngày bắt đầu và kết thúc tuần
                                const formatDate = (date: Date) => {
                                    const year = date.getFullYear();
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const day = String(date.getDate()).padStart(2, '0');
                                    return `${year}/${month}/${day}`;
                                };
                                return `${formatDate(startDate)}~${formatDate(endDate)}`;
                            })()
                            : activeTab === 'month'
                                ? `${new Date().getFullYear()}年${new Date().getMonth() + 1}月`
                                : `${new Date().getFullYear()}年`}
                </Text>
                <BarChart
                    data={graphData}
                    width={Dimensions.get('window').width}
                    height={260}
                    chartConfig={chartConfig}
                    withHorizontalLabels={true}
                    showBarTops={true}
                    showValuesOnTopOfBars={true}
                    yAxisLabel=""
                    yAxisSuffix="ml"
                    segments={4}
                />

                {/* 合計 */}
                <View style={styles.summaryContainer}>

                    {activeTab === 'week' ? (() => {
                        return (
                            <Text style={styles.summaryText}>
                                今週の合計：{total_week} ml
                            </Text>
                        );
                    })() : null}
                    {activeTab === 'month' ? (() => {
                        return (
                            <Text style={styles.summaryText}>
                                今月の合計：{monthlyTotal} ml
                            </Text>
                        );
                    })() : null}
                    <Text style={styles.summaryText}>
                        本日の合計 : {totalDay} ml
                    </Text>
                    {/* <Text style={styles.summaryText}> */}
                    {/* 平均 : {summary[activeTab as 'week' | 'month' | 'year']?.average}ml */}
                    {/* 平均 : ml */}
                    {/* </Text> */}
                </View>
                <View>
                    <Text style={styles.logsTitle}>今日のログ</Text>
                    <View style={styles.logsContainer}>
                        {results.map((log) => (
                            <View key={log.id} style={styles.logItem}>
                                <Image source={require('@/assets/images/water3.png')} style={styles.icon} />
                                <View style={styles.infoContainer}>
                                    <Text style={styles.genreText}>{log.Genre}</Text>
                                    <Text style={styles.waterDrunkText}>{log.waterDrunk}㎖</Text>
                                </View>
                                <View style={styles.timeContainer}>
                                    <Text style={styles.timeText}>{`${log.hour}:${log.minute < 10 ? `0${log.minute}` : log.minute}`}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
                {/* <Button title="ログ表示" onPress={() => alert('ログ表示ボタンがクリックされました')} /> */}
            </ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',

    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        // marginBottom: 10,
        padding: 20,
    },
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#B0C4DE',
        borderRadius: 8,
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
        textAlign: 'center'
        // backgroundColor: '#fff'
    },
    summaryContainer: {
        marginTop: 10,
        padding: 10,
        // backgroundColor: '#fff',
        // borderRadius: 10,
    },
    summaryText: {
        fontSize: 18,
        marginBottom: 10,
    },
    logsTitle: {
        flex: 1,
        fontSize: 20,
        marginLeft: 10,
        fontWeight: 'bold',
    },
    logsContainer: {
        // flex: 1,
        padding: 10,
        paddingHorizontal: 10,
    },
    logItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: 10,
        marginVertical: 8,
        borderRadius: 8,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: 'column',
    },
    genreText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
    },
    waterDrunkText: {
        fontSize: 14,
        color: '#000',
    },
    timeContainer: {
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    timeText: {
        fontSize: 16,
        color: '#000',
        fontWeight: 'bold',
    },
});
export default WaterIntakeHistory;
