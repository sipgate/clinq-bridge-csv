import axios, { AxiosResponse } from "axios";
import { Adapter, Config, Contact, PhoneNumberLabel } from "@clinq/bridge";
import { CsvContact } from "./model";
import * as csv from "csvtojson";

export const parseCsv = async (data: string): Promise<CsvContact[]> => {
	const parsed: CsvContact[] = await csv().fromString(data);
	return parsed;
};

export const convertContacts = (csvContacts: CsvContact[]): Contact[] => {
	return csvContacts.map(csvContact => ({
		id: csvContact.id,
		name: csvContact.name,
		firstName: null,
		lastName: null,
		phoneNumbers: [
			{
				label: PhoneNumberLabel.WORK,
				phoneNumber: csvContact.phoneNumber
			}
		],
		email: csvContact.email,
		organization: null,
		contactUrl: null,
		avatarUrl: null
	}));
};

export class CsvCrmAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const csvResponse: AxiosResponse = await axios.get(config.apiUrl);
		const parsedCsv = await parseCsv(csvResponse.data);
		return convertContacts(parsedCsv);
	}
}
