export default function formatSeconds(seconds: number) {
	const hours = Math.floor(seconds / (60 * 60));
	seconds -= hours * 60 * 60;

	const minutes = Math.floor(seconds / 60);
	seconds -= minutes * 60;

	let stringSecond = seconds.toString();
	let stringMinuts = minutes.toString();
	let stringHours = hours.toString();

	if (seconds < 10) stringSecond = `0${seconds}`;
	if (minutes < 10) stringMinuts = `0${minutes}`;
	if (hours < 10) stringHours = `0${hours}`;

	return `${stringHours}:${stringMinuts}:${stringSecond}`;
}
