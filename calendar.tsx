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
	/* const isDateDisabled = (date: Date) => {
		if (disablePast && isBefore(date, today)) return true;
		if (disableFuture && isAfter(date, today)) return true;
		if (range.start && isBefore(date, range.start)) return true; // Deshabilita fechas anteriores a la seleccionada
		return false;
	};
 */
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

			<div className="w-full flex flex-col">
				{/* Encabezado de días de la semana */}
				<div className="flex">
					{['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day) => (
						<div
							key={day}
							className="flex-1 text-center text-sm font-medium py-2"
						>
							{day}
						</div>
					))}
				</div>

				{/* Días del mes */}
				{Array.from({length: Math.ceil(days.length / 7)}).map((_, rowIndex) => (
					<div
						key={rowIndex}
						className="flex"
					>
						{days.slice(rowIndex * 7, rowIndex * 7 + 7).map((day, colIndex, rowArray) => {
							const isDisabled = isDateDisabled(day);
							const isSelectedStart = isSameDay(day, range.start);
							const isSelectedEnd = isSameDay(day, range.end);
							const isInRange = range.start && range.end && isWithinInterval(day, {start: range.start, end: range.end});

							// Bordes redondeados para los extremos de cada fila
							const isFirstInRow = colIndex === 0;
							const isLastInRow = colIndex === rowArray.length - 1;
							const roundedClass =
								isSelectedStart || isSelectedEnd
									? 'rounded-full'
									: isInRange
									? `${isFirstInRow ? 'rounded-l-full' : ''} ${isLastInRow ? 'rounded-r-full' : ''}`
									: '';

							return (
								<div
									key={day.toString()}
									className="flex-1 flex items-center justify-center"
								>
									<button
										onClick={() => handleDateClick(day)}
										disabled={isDisabled}
										className={`w-10 h-10 text-sm transition-all duration-300 
                ${isDisabled ? 'text-gray-400 cursor-not-allowed' : ''}
                ${roundedClass}
                ${isInRange ? 'bg-indigo-300 text-white' : ''}
                ${isSelectedStart || isSelectedEnd ? 'bg-indigo-600 text-white' : ''}
                ${!isSameMonth(day, currentMonth) ? 'text-gray-400' : 'text-gray-900 hover:bg-indigo-100 hover:text-indigo-600'}`}
									>
										{format(day, 'd')}
									</button>
								</div>
							);
						})}
					</div>
				))}
			</div>

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
