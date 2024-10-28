import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const App = () => {
    const [data, setData] = useState("");

    const fetchData = async () => {
        try {
            const response = await fetch("http://10.200.4.237/"); // ArduinoのIPアドレス
            const text = await response.text();
            setData(text);
            window.alert("通過");
        } catch (error) {
            console.error("Error fetching data:", error);
            window.alert("Error fetching data:");
        }
    };

    return (
        <View>
            <Text>{data}</Text>

            <Button title="Fetch Data from Arduino" onPress={fetchData} />
        </View>
    );
};

export default App;
