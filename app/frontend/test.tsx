import { View, Text, StyleSheet } from 'react-native';

export default function Test() {
    return (
        <View style={[styles.container, { backgroundColor: 'white' }]}>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
