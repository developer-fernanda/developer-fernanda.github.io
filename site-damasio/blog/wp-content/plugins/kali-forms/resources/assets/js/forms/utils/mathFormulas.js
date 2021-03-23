const { __ } = wp.i18n;
export default [
	{
		label: __('Sum of selected fields', 'kaliforms'),
		id: 'sum',
		args: -1,
		formula: '%s=sum(%s)',
	},
	{
		label: __('Subtract two fields', 'kaliforms'),
		id: 'subtract',
		args: 2,
		formula: '%s=subtract(%s)'
	},
	{
		label: __('Divide two fields', 'kaliforms'),
		id: 'divide',
		args: 2,
		formula: '%s=divide(%s)'
	},
	{
		label: __('Multiply selected fields', 'kaliforms'),
		id: 'multiply',
		args: -1,
		formula: '%s=multiply(%s)'
	},
	{
		label: __('Arithmetic average of fields', 'kaliforms'),
		id: 'arithmeticAverage',
		args: -1,
		formula: '%1s=sum(%3s)/%2s'
	},
	{
		label: __('BMI Formula (imperial)', 'kaliforms'),
		id: 'bmiImperial',
		args: 2,
		formula: '%1s=multiply(703,%2s)/pow(%3s, 2)',
		argsHelper: [
			__('Weight', 'kaliforms'),
			__('Height', 'kaliforms'),
		],
	},
	{
		label: __('BMI Formula (metric)', 'kaliforms'),
		id: 'bmiMetric',
		args: 2,
		formula: '%1s=%2s/pow(%3s/100, 2)',
		argsHelper: [
			__('Weight', 'kaliforms'),
			__('Height', 'kaliforms'),
		],
	},
	{
		label: __('Minutes to seconds', 'kaliforms'),
		id: 'minutesToSeconds',
		args: 1,
		formula: '%1s=%2s minute to seconds',
	},
	{
		label: __('Seconds to minutes', 'kaliforms'),
		id: 'secondsToMinute',
		args: 1,
		formula: '%1s=%2s seconds to minute',
	},
	{
		label: __('Seconds to hours', 'kaliforms'),
		id: 'secondsToHour',
		args: 1,
		formula: '%1s=%2s seconds to hour',
	},
	{
		label: __('Minutes to hours', 'kaliforms'),
		id: 'minutesToHours',
		args: 1,
		formula: '%1s=%2s minutes to hour',
	},
	{
		label: __('Hour:Minute:Seconds to seconds', 'kaliforms'),
		id: 'hourMinuteSeconds',
		args: 3,
		formula: '%1s=sum(%2s hour to seconds, %3s minute to seconds, %4s second to second) to seconds',
		argsHelper: [
			__('Hours', 'kaliforms'),
			__('Minutes', 'kaliforms'),
			__('Seconds', 'kaliforms'),
		],
	},
	{
		label: __('Speed', 'kaliforms'),
		id: 'speed',
		args: 2,
		formula: '%1s=%2s km/%3s hour',
		argsHelper: [
			__('Distance', 'kaliforms'),
			__('Time', 'kaliforms')
		],
	},
	{
		label: __('Running pace', 'kaliforms'),
		id: 'pace',
		args: 4,
		formula: '%1s=minuteConverter(sum(%2s hour to seconds, %3s minutes to seconds, %4s seconds to seconds)/%5s to minutes)',
		argsHelper: [
			__('Hours', 'kaliforms'),
			__('Minutes', 'kaliforms'),
			__('Seconds', 'kaliforms'),
			__('Distance', 'kaliforms')
		],
	},
	{
		label: __('Running time', 'kaliforms'),
		id: 'runningTime',
		args: 3,
		formula: '%1s=hourMinuteConverter(multiply(%2s, sum(%3s minutes to seconds, %4s seconds to seconds)) to minutes)',
		argsHelper: [
			__('Distance', 'kaliforms'),
			__('Minutes', 'kaliforms'),
			__('Seconds', 'kaliforms')
		],
	},
	{
		label: __('Running distance', 'kaliforms'),
		id: 'runningDistance',
		args: 5,
		formula: '%1s=sum(%2s hour to seconds, %3s minutes to seconds, %4s seconds to seconds)/sum(%5s minutes to seconds, %6s seconds to seconds)',
		argsHelper: [
			__('Hours', 'kaliforms'),
			__('Minutes', 'kaliforms'),
			__('Seconds', 'kaliforms'),
			__('Minutes', 'kaliforms'),
			__('Seconds', 'kaliforms')
		],
	},
	{
		label: __('Day difference between dates', 'kaliforms'),
		id: 'dayDifference',
		args: 2,
		formula: '%1s=differenceInDays(%2s, %3s)',
		argsHelper: [
			__('Start date', 'kaliforms'),
			__('End date', 'kaliforms')
		],
	}
]
