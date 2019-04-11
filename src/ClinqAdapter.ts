import { Adapter, Config, Contact, PhoneNumberLabel } from "@clinq/bridge";
import axios, { AxiosResponse } from "axios";
import { ApiContact } from "./model";

const apiClient = (token: string) =>
	axios.create({
		headers: {
			Authorization: `Bearer ${token}`,
			"X-Admin": true
		}
	});

export class ClinqAdapter implements Adapter {

	public async getContacts(config: Config): Promise<Contact[]> {
		const url = `https://api.clinq.com/admin/bridge/contacts`;
		const organizations: AxiosResponse = await apiClient(config.apiKey).get<ApiContact[]>(url);
		const mapped = organizations.data.map(o => ({
			id: o.id,
			name: o.name,
			contactUrl: `https://admin.clinq.com/organization/${o.id}`,
			avatarUrl: "",
			firstName: "",
			lastName: "",
			email: "",
			organization: o.name,
			phoneNumbers: o.phoneNumbers.map(p => ({phoneNumber: p, label: PhoneNumberLabel.WORK}))
		}))
		return mapped
	}

	public async getOAuth2RedirectUrl() {
		return "https://www.clinq.app/settings/clinq-admin-bridge"
	}
}
