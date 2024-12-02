import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../header';
const Notification: React.FC = () => {
    const route = useRoute();
    const { onGoBack } = route.params as { onGoBack: () => void };

    return (
        <View  >

            <Header title="通知" back='Back' onBackPress={onGoBack} />
            <Text>
                通知
            </Text>
        </View >
    )


};

//css in js
const styles = StyleSheet.create({

});
export default Notification;