import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Friend from './frontend/friend'; // Màn hình Friend
import Setting from './frontend/setting';
import AddFriendScreen from './frontend/addfriend'; // Màn hình AddFriend
import notification from './frontend/notification';
const Stack = createStackNavigator();

const App: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Friend">
                <Stack.Screen name="Friend" component={Friend} />
                {/* <Stack.Screen name="AddFriend" component={AddFriendScreen} /> */}
                <Stack.Screen name="Setting" component={Setting} />
                <Stack.Screen name="/frontend/Notification" component={notification} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
