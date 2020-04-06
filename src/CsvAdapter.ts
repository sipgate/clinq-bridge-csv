import { Adapter, Config, Contact, PhoneNumberLabel } from "@clinq/bridge";
import axios from "axios";
import * as eol from "eol";
import * as csv from "csvtojson";
import { CsvContact } from "./model";
import { parsePhoneNumber } from "./util/phone-number";

export const parseCsv = async (data: string): Promise<CsvContact[]> => {
	const parsed: CsvContact[] = await csv().fromString(data);
	return parsed;
};

export const convertContacts = (csvContacts: CsvContact[]): Contact[] => {
	return csvContacts.map((csvContact) => {
		const parsedPhoneNumber = parsePhoneNumber(csvContact.phoneNumber);
		return {
			id: csvContact.id,
			name: csvContact.name,
			firstName: null,
			lastName: null,
			phoneNumbers: [
				{
					label: PhoneNumberLabel.WORK,
					phoneNumber: parsedPhoneNumber.e164,
				},
			],
			email: csvContact.email || null,
			organization: null,
			contactUrl: null,
			avatarUrl: null,
		};
	});
};

export class CsvCrmAdapter implements Adapter {
	public async getContacts(config: Config): Promise<Contact[]> {
		const csvResponse = await axios.get(config.apiUrl);
		const parsedCsv = await parseCsv(eol.auto(csvResponse.data));
		return convertContacts(parsedCsv);
	}
}
