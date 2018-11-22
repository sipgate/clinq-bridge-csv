
import axios, { AxiosResponse } from "axios";
import { Adapter, Config, Contact, start } from "@clinq/bridge";
import csv = require("csvtojson");
import { CsvContact } from "./model";

export class CsvCrmAdapter implements Adapter {

	public async parseCsv (data: string): Promise<CsvContact[]> {
		return new Promise<CsvContact[]>((resolve, reject) => {
			const parsed: CsvContact[] = [];
			csv()
				.fromString(data)
				.on("json", row => {
					parsed.push(row);
				})
				.on("done", error => {
					if(error) {
						reject(error);
						return;
					}
					resolve(parsed);
				})
				.on("error", error => {
					reject(error);
				});
		});
	}

	public convertContacts (csvContacts: CsvContact[]): Contact[] {
		return csvContacts.map(csvContact => {
			const contact: Contact = {
				id: csvContact.id,
				name: csvContact.name,
				phoneNumbers: [{
					label: null,
					phoneNumber: csvContact.phoneNumber
				}],
				email: csvContact.email,
				company: null,
				contactUrl: null,
				avatarUrl: null
			};
			return contact;
		});
	}

	public async getContacts(config: Config): Promise<Contact[]> {
		const csvResponse: AxiosResponse = await axios.get(config.apiUrl);
		const parsedCsv: CsvContact[]= await this.parseCsv(csvResponse.data);
		return this.convertContacts(parsedCsv);
	}
}