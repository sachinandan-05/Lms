import { Document, Model } from "mongoose";

interface MonthData {
    month: string;
    count: number;
}

export async function generateLast12MonthData<T extends Document>(
    model: Model<T>
): Promise<{ last12Months: MonthData[] }> {
    const last12Months: MonthData[] = [];
    const currentDate = new Date();
    currentDate.setDate(1); // Set to the first day of the current month

    for (let i = 11; i >= 0; i--) {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        
        const monthYear = startDate.toLocaleDateString('default', {
            year: 'numeric',
            month: 'short',
        });

        // console.log(`Counting documents from ${startDate} to ${endDate}`);
        
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        console.log(`Found ${count} documents for ${monthYear}`);

        last12Months.push({
            month: monthYear,
            count,
        });
    }

    return { last12Months };
}
