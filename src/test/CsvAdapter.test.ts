import * as fs from "fs";
import * as path from "path";
import { convertContacts, CsvCrmAdapter, parseCsv } from "../CsvAdapter";
import { Contact, PhoneNumberLabel } from "@clinq/bridge";

const MOCK_CSV_DATA = fs.readFileSync(path.resolve(__dirname, 'MOCK_DATA.csv'), 'utf8');

test("Mock file to contain CSV data", () => {
	expect(MOCK_CSV_DATA).toBe("id,name,email,phoneNumber\n1,Abagael Tesh,atesh0@sitemeter.com,787-467-5160");
});

test("Parsed CSV data to contain user", async () => {
	const parsedCsv = await parseCsv(MOCK_CSV_DATA);
	expect(parsedCsv).toEqual([
		{
			id: "1",
			name: "Abagael Tesh",
			email: "atesh0@sitemeter.com",
			phoneNumber: "787-467-5160",
		}
	]);
});

test("Converted contact to have valid schema", async () => {
	const parsedCsv = await parseCsv(MOCK_CSV_DATA);
	const convertedContacts = convertContacts(parsedCsv);
	const expectedContacts: Contact[] = [
		{
			id: "1",
			name: "Abagael Tesh",
			phoneNumbers: [{
				label: PhoneNumberLabel.WORK,
				phoneNumber: "787-467-5160"
			}],
			email: "atesh0@sitemeter.com",
			firstName: null,
			lastName: null,
			organization: null,
			contactUrl: null,
			avatarUrl: null
		}
	]
	expect(convertedContacts).toEqual(expectedContacts);
});
