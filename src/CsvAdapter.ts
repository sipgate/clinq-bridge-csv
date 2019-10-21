import axios, { AxiosResponse } from "axios";
import { Adapter, Config, Contact, PhoneNumberLabel } from "@clinq/bridge";
import { CsvContact } from "./model";
import * as csv from "csvtojson";
import { parsePhoneNumber } from "./util/phone-number";

export const parseCsv = async (data: string): Promise<CsvContact[]> => {
	const parsed: CsvContact[] = await csv().fromString(data);
	return parsed;
};

export const convertContacts = (csvContacts: CsvContact[]): Contact[] => {
	return csvContacts.map(csvContact => {
		const parsedPhoneNumber = parsePhoneNumber(csvContact.phoneNumber);
		return {
			id: csvContact.id,
			name: csvContact.name,
			firstName: null,
			lastName: null,
			phoneNumbers: [
				{
					label: PhoneNumberLabel.WORK,
					phoneNumber: parsedPhoneNumber.e164
				}
			],
			email: csvContact.email,
			organization: null,
			contactUrl: null,
			avatarUrl: null
		}
	});
};

export class CsvCrmAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const csvResponse: AxiosResponse = await axios.get(config.apiUrl);
		const parsedCsv = await parseCsv(csvResponse.data);
		return convertContacts(parsedCsv);
	}
}
