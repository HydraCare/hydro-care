import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import Header from '../header';
const AddFriend: React.FC<{ onGoBack: () => void }> = ({ onGoBack }) => {
    const [id, setId] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const follow = [
        { Name: 'tomo-tin', id: '1001', water: '2500 ', image: require('@/assets/images/image.jpg') },
        { Name: 'Trang', id: '1002', water: '2600 ', image: require('@/assets/images/dittrau.png') },
        { Name: 'Fukuda-tin', id: '1003', water: '2700 ', image: require('@/assets/images/dittrau.png') },
    ];
    const handleBack = () => {
        console.log("aa")
        onGoBack()
    }
    useEffect(() => {
        if (id.trim() === '') {
            setSearchResults([]);
            return;
        }
        const results = follow.filter((log) =>
            log.id.includes(id) || log.Name.toLowerCase().includes(id.toLowerCase())
        );

        setSearchResults(results); // Cập nhật danh sách kết quả tìm kiếm
    }, [id]); // Tự động tìm kiếm khi id thay đổi

    return (

        <View style={styles.container}>
            <Header title="検索" back='Back' onBackPress={handleBack} />
            <Text style={styles.text}>IDで検索</Text>
            {/* Wrapper cho TextInput */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={id}
                    onChangeText={(text) => setId(text)}
                    placeholder=" 検索"
                />
            </View>
            <View style={styles.hr} />
            <ScrollView style={styles.logsContainer}>
                {/* Hiển thị các kết quả tìm kiếm */}
                {searchResults.length > 0 ? (
                    searchResults.map((log, index) => (
                        <View key={index} style={styles.logItem}>
                            <View style={styles.infoContainer}>
                                <Image source={log.image} style={styles.icon} />
                                <View style={styles.textContainer}>
                                    <Text>Name : {log.Name}</Text>
                                    <Text>ID : {log.id}</Text>
                                </View>
                            </View>
                            <TouchableOpacity style={styles.add_button}>
                                <Text style={styles.buttonText}>追加</Text>
                            </TouchableOpacity>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noResultText}>該当する結果がありません</Text>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F2F9',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        paddingLeft: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 5,
        paddingHorizontal: 10,
        width: '100%',
        paddingLeft: 20,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderWidth: 1,
        fontSize: 18,
        paddingLeft: 10,
        marginRight: 10,
        borderRadius: 8,
    },
    hr: {
        width: '90%',
        height: 2,
        backgroundColor: '#4CAEE8',
        marginTop: 30,
        marginLeft: 15,
    },
    logsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#E6F2F9',
        borderRadius: 10,
    },
    logItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginRight: 10,
    },
    textContainer: {
        flexDirection: 'column',
    },
    add_button: {
        backgroundColor: '#ADD8E6',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noResultText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#ADD8E6',
        borderRadius: 8,
    },
});

export default AddFriend;
