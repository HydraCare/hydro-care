import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { format } from 'date-fns';

type CalendarPickerProps = {
    onDateChange: (date: string) => void;
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({ onDateChange }) => {
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [date, setDate] = useState<string>('');

    const showDatePicker = () => {
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisible(false);
    };

    const handleConfirm = (selectedDate: Date) => {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd HH:mm');
        setDate(formattedDate);
        onDateChange(formattedDate);
        hideDatePicker();
    };

    return (
        <View>
            <Text onPress={showDatePicker} style={styles.dateText}>
                {date || 'select time '}
            </Text>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dateText: {
        fontSize: 18,
        color: '#4CAF50',
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default CalendarPicker;
