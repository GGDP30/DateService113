'use client';
import React, {useState, useEffect} from 'react';
import {
	format,
	addMonths,
	subMonths,
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isSameDay,
	isWithinInterval,
	setYear,
	isBefore,
	isAfter,
} from 'date-fns';
import {es} from 'date-fns/locale';

const years = Array.from({length: 2025 - 1999 + 1}, (_, i) => 1999 + i);

interface DatePickerCalendarProps {
	disablePast?: boolean;
	disableFuture?: boolean;
	initialRange?: {start: Date | null; end: Date | null}; // ✅ Nueva prop
	onClose: () => void;
	onSelectRange: (range: {start: Date | null; end: Date | null}) => void;
}

const DatePickerCalendar: React.FC<DatePickerCalendarProps> = ({
	disablePast = false,
	disableFuture = false,
	initialRange,
	onClose,
	onSelectRange,
}) => {
	const today = new Date();
	const [currentMonth, setCurrentMonth] = useState(new Date());
	const [selectedYear, setSelectedYear] = useState(currentMonth.getFullYear());
	const [range, setRange] = useState<{start: Date | null; end: Date | null}>({start: null, end: null});

	useEffect(() => {
		if (initialRange?.start || initialRange?.end) {
			setRange(initialRange); // ✅ Recupera el rango seleccionado
		}
	}, [initialRange]);

	const updateYear = (year: number) => {
		setSelectedYear(year);
		setCurrentMonth(setYear(currentMonth, year));
	};

	const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
	const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

	const days = eachDayOfInterval({
		start: startOfWeek(startOfMonth(currentMonth)),
		end: endOfWeek(endOfMonth(currentMonth)),
	});

	const isDateDisabled = (date: Date) => {
		if (disablePast && isBefore(date, today)) return true;
		if (disableFuture && isAfter(date, today)) return true;
		return false;
	};

	const handleDateClick = (day: Date) => {
		if (isDateDisabled(day)) return;

		if (!range.start || (range.start && range.end)) {
			setRange({start: day, end: null});
		} else {
			setRange({start: range.start, end: day});
		}
	};

	const handleAccept = () => {
		onSelectRange(range);
		onClose();
	};

	const handleCancel = () => {
		setRange(initialRange || {start: null, end: null}); // ✅ No pierde la selección
		onClose();
	};

	return (
		<div className="absolute left-0 z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-[320px]">
			<div className="flex justify-between items-center mb-3">
				<button
					onClick={prevMonth}
					className="p-2 rounded-md hover:bg-gray-200"
				>
					⬅
				</button>
				<span className="font-semibold">{format(currentMonth, 'MMMM', {locale: es})}</span>

				<select
					value={selectedYear}
					onChange={(e) => updateYear(Number(e.target.value))}
					className="p-1 border rounded-md text-sm"
				>
					{years.map((year) => (
						<option
							key={year}
							value={year}
						>
							{year}
						</option>
					))}
				</select>

				<button
					onClick={nextMonth}
					className="p-2 rounded-md hover:bg-gray-200"
				>
					➡
				</button>
			</div>

			<table className="w-full">
				<thead>
					<tr>
						{['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day) => (
							<th
								key={day}
								className="w-10 h-8 text-sm font-medium"
							>
								{day}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{Array.from({length: Math.ceil(days.length / 7)}).map((_, rowIndex) => (
						<tr
							key={rowIndex}
							className="text-center"
						>
							{days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day) => {
								const isDisabled = isDateDisabled(day);
								const isSelectedStart = isSameDay(day, range.start);
								const isSelectedEnd = isSameDay(day, range.end);
								const isInRange = range.start && range.end && isWithinInterval(day, {start: range.start, end: range.end});

								return (
									<td
										key={day.toString()}
										className="w-10 h-10"
									>
										<button
											onClick={() => handleDateClick(day)}
											disabled={isDisabled}
											className={`w-full h-full text-sm rounded-full transition-all duration-300 
                        ${isDisabled ? 'text-gray-400 cursor-not-allowed' : ''}
                        ${isSelectedStart ? 'bg-indigo-600 text-white' : ''}
                        ${isSelectedEnd ? 'bg-indigo-300 text-white' : ''}
                        ${isInRange ? 'bg-indigo-200 text-indigo-900' : ''}
                        ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-900 hover:bg-indigo-100 hover:text-indigo-600'}
                      `}
										>
											{format(day, 'd')}
										</button>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>

			<div className="flex justify-between mt-3">
				<button
					onClick={handleCancel}
					className="py-1.5 px-3 text-sm border rounded-md hover:bg-gray-100"
				>
					Cancelar
				</button>
				<button
					onClick={handleAccept}
					className="py-1.5 px-3 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
				>
					Aceptar
				</button>
			</div>
		</div>
	);
};

export default DatePickerCalendar;
