'use client';
import React, {useState} from 'react';
import {format} from 'date-fns';
import DatePickerCalendar from './DatePickerCalendar';

interface DatePickerInputProps {
	disablePast?: boolean;
	disableFuture?: boolean;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({disablePast = false, disableFuture = false}) => {
	const [showCalendar, setShowCalendar] = useState(false);
	const [selectedRange, setSelectedRange] = useState<{start: Date | null; end: Date | null}>({start: null, end: null});

	return (
		<div className="relative w-full max-w-[280px]">
			<input
				type="text"
				placeholder="DD/MM/YYYY"
				readOnly
				onClick={() => setShowCalendar(true)}
				value={
					selectedRange.start && selectedRange.end ? `${format(selectedRange.start, 'dd/MM/yyyy')} - ${format(selectedRange.end, 'dd/MM/yyyy')}` : ''
				}
				className="w-full py-2 px-3 border border-gray-300 rounded-md text-sm cursor-pointer focus:ring-2 focus:ring-indigo-500"
			/>

			{showCalendar && (
				<DatePickerCalendar
					disablePast={disablePast}
					disableFuture={disableFuture}
					initialRange={selectedRange} // ✅ Mantiene la selección anterior
					onClose={() => setShowCalendar(false)}
					onSelectRange={(range) => {
						const {start, end} = range;
						// Asegurar que la fecha inicial siempre sea menor que la final
						if (start && end) {
							const orderedRange = start < end ? {start, end} : {start: end, end: start};
							setSelectedRange(orderedRange);
						} else {
							setSelectedRange(range);
						}
					}}
				/>
			)}
		</div>
	);
};

export default DatePickerInput;
