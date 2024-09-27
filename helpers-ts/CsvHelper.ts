import * as fs from 'fs';
import * as path from 'path';
import * as csvParser from 'csv-parser';

interface CsvRow {
    [key: string]: string;
}

export function getDataFromCsv(csvFileName: string): Promise<CsvRow[]> {
    const data: CsvRow[] = [];
    const filePath = path.join('csvs', `${csvFileName}.csv`);

    return new Promise((resolve, reject) => {
        try {
            fs.createReadStream(filePath)
                .pipe(csvParser())
                .on('data', (row: CsvRow) => {
                    data.push(row);
                })
                .on('end', () => {
                    resolve(data);
                })
                .on('error', (error: Error) => {
                    reject(`Error reading the CSV file: ${error.message}`);
                });
        } catch (error) {
            reject(`File was not found in ${filePath}`);
        }
    });
}