import type { Record } from "@prisma/client";
export interface DayRecord {
	date: Date;
	averagePing: number;
	requestCount: number;
	color: Color;
}

export class StatusHelper {
	public static weekAvg(records: Record[]): DayRecord[] {
		const week = [];

		for (let i = 0; i < 7; i++) {
			const day = new Date();
			day.setDate(day.getDate() - i);
			const dayRecords = records.filter((record) => {
				return record.createdAt.toDateString() === day.toDateString();
			});
			const dayPing = dayRecords.reduce((acc, record) => {
				return acc + record.ping;
			}, 0);
			week.push({
				date: day,
				averagePing: Number.isNaN(dayPing / dayRecords.length)
					? 0
					: Math.round(dayPing / dayRecords.length),
				requestCount: dayRecords.length,
				color: this.getPingColor(
					Number.isNaN(dayPing / dayRecords.length) ? 0 : dayPing / dayRecords.length
				)
			});
		}
		return week.reverse();
	}

	public static getPingColor(ping: number): Color {
		const min = 100;
		const max = 600;
		const range = max - min;

		// normalize the ping value to a range of 0 to 1
		const normalizedPing = 1 - (ping - min) / range;

		// calculate the color values based on the normalized ping value
		const red = Math.floor(11 + (189 - 11) * normalizedPing);
		const green = Math.floor(48 + (231 - 48) * normalizedPing);
		const blue = Math.floor(70 + (250 - 70) * normalizedPing);

		return new Color(red, green, blue);
	}
}

class Color {
	red: number;
	green: number;
	blue: number;

	constructor(red: number, green: number, blue: number) {
		this.red = red;
		this.green = green;
		this.blue = blue;
	}

	getRGB(): string {
		return `rgb(${this.red}, ${this.green}, ${this.blue})`;
	}
}
