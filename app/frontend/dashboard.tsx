import React, { useState } from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Water_Intake from './water_intake';
const Dashboard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handlePress = (index: number, route: string) => {
    setActiveIndex(index);
    // navigation.navigate(route); 
  };
  return (
    <View style={styles.toolbar}>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIndex === 0 && styles.activeContainer,
        ]}
        onPress={() => handlePress(0, 'Water_Intake')}
      >
        <Image
          source={activeIndex === 0 ? require('@/assets/images/water2.png') : require('@/assets/images/water.png')}
          style={[
            styles.icon,

          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIndex === 1 && styles.activeContainer,
        ]}
        onPress={() => handlePress(1, 'Home')}
      >
        <Image
          source={activeIndex === 1 ? require('@/assets/images/history_color.png') : require('@/assets/images/history.png')}
          style={[
            styles.icon,
            // activeIndex === 1 && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIndex === 2 && styles.activeContainer,
        ]}
        onPress={() => handlePress(2, 'Profile')}
      >
        <Image
          source={activeIndex === 2 ? require('@/assets/images/friend_color.png') : require('@/assets/images/friend.png')}
          style={[
            styles.icon,
            // activeIndex === 2 && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIndex === 3 && styles.activeContainer,
        ]}
        onPress={() => handlePress(3, 'Settings')}
      >
        <Image
          source={activeIndex === 3 ? require('@/assets/images/challenge_color.png') : require('@/assets/images/challenge.png')}
          style={[
            styles.icon,
            // activeIndex === 3 && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconContainer,
          activeIndex === 4 && styles.activeContainer,
        ]}
        onPress={() => handlePress(4, 'Some Other Screen')}
      >
        <Image
          source={activeIndex === 4 ? require('@/assets/images/setting_color.png') : require('@/assets/images/setting.png')}
          style={[
            styles.icon,
            // activeIndex === 4 && styles.activeIcon,
          ]}
        />
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  iconContainer: {
    alignItems: 'center',
    padding: 10,
  },
  activeContainer: {
    borderTopWidth: 3,
    borderTopColor: '#ADD8E6',
    // backgroundColor: '#ADD8E6',
  },
  icon: {
    width: 50,
    height: 50,

  },

});

export default Dashboard;
