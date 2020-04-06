import * as fs from "fs";
import * as path from "path";
import { convertContacts, CsvCrmAdapter, parseCsv } from "../CsvAdapter";
import { Contact, PhoneNumberLabel } from "@clinq/bridge";

const MOCK_CSV_DATA = fs.readFileSync(path.resolve(__dirname, "MOCK_DATA.csv"), "utf8");

test("Mock file to contain CSV data", () => {
	expect(MOCK_CSV_DATA).toBe(
		"id,name,email,phoneNumber\n1,Abagael Tesh,atesh0@sitemeter.com,787-467-5160\n2,Reinhold Messner,messner@derbergruft.de,4915790000000"
	);
});

test("Parsed CSV data to contain user", async () => {
	const parsedCsv = await parseCsv(MOCK_CSV_DATA);
	expect(parsedCsv).toEqual([
		{
			id: "1",
			name: "Abagael Tesh",
			email: "atesh0@sitemeter.com",
			phoneNumber: "787-467-5160",
		},
		{
			id: "2",
			name: "Reinhold Messner",
			email: "messner@derbergruft.de",
			phoneNumber: "4915790000000",
		},
	]);
});

test("Converted contact to have valid schema", async () => {
	const parsedCsv = await parseCsv(MOCK_CSV_DATA);
	const convertedContacts = convertContacts(parsedCsv);
	const expectedContacts: Contact[] = [
		{
			id: "1",
			name: "Abagael Tesh",
			phoneNumbers: [
				{
					label: PhoneNumberLabel.WORK,
					phoneNumber: "+7874675160",
				},
			],
			email: "atesh0@sitemeter.com",
			firstName: null,
			lastName: null,
			organization: null,
			contactUrl: null,
			avatarUrl: null,
		},
		{
			id: "2",
			name: "Reinhold Messner",
			phoneNumbers: [
				{
					label: PhoneNumberLabel.WORK,
					phoneNumber: "+4915790000000",
				},
			],
			email: "messner@derbergruft.de",
			firstName: null,
			lastName: null,
			organization: null,
			contactUrl: null,
			avatarUrl: null,
		},
	];
	expect(convertedContacts).toEqual(expectedContacts);
});
