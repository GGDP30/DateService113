'use client';
import React, {useState} from 'react';
import {format} from 'date-fns';
import DatePickerSingleCalendar from './DatePickerSingleCalendar';

interface DatePickerSingleInputProps {
	disablePast?: boolean;
	disableFuture?: boolean;
}

const DatePickerSingleInput: React.FC<DatePickerSingleInputProps> = ({disablePast = false, disableFuture = false}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Date | null>(null);

	return (
		<div className="relative w-full max-w-[280px]">
			<input
				type="text"
				placeholder="DD/MM/YYYY"
				readOnly
				onClick={() => setShowCalendar(true)}
				value={selectedDate ? format(selectedDate, 'dd/MM/yyyy') : ''}
				className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500"
			/>

			{showCalendar && (
				<DatePickerSingleCalendar
					disablePast={disablePast}
					disableFuture={disableFuture}
					initialDate={selectedDate} // ✅ Mantiene la fecha seleccionada
					onClose={() => setShowCalendar(false)}
					onSelectDate={(date) => setSelectedDate(date)}
				/>
			)}
		</div>
	);
};

export default DatePickerSingleInput;
