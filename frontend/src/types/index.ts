export interface Subgroup {
  id?: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
  link: string;
  access: "all" | "me";
  reminder_delta?: number;
  comment: string;
  personal_note: string;
  organizers: Profile[];
  participants: Profile[];
  events: Event[];
}

export interface EventRecurring {
  id: number;
  createdAt: string;
  updatedAt: string;
  recurring_type: string;
  recurring_end?: string | null;
  monthly_day?: number | null;
  weekly_days?: string;
  yearly_interval?: number | null;
  custom_period?: string;
  event?: number;
}

export interface Recurring {
  id: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  recurring_type: "one-time" | "daily" | "weekly" | "monthly" | "yearly" | "custom";
  recurring_end: string | null; // ISO 8601 date string or null
  monthly_day: number | null;
  weekly_days: string; // e.g., "Monday, Wednesday"
  yearly_interval: number | null;
  custom_period: string; // e.g., "Every 10 days"
  event: number; // Event ID
}

export interface AddressSuggestion {
  value: string;
  unrestricted_value: string;
  data: AddressData;
}

interface AddressData {
  postal_code: string | null;
  country: string;
  country_iso_code: string;
  federal_district: string | null;
  region_fias_id: string;
  region_kladr_id: string;
  region_iso_code: string;
  region_with_type: string;
  region_type: string;
  region_type_full: string;
  region: string;
  area_fias_id: string | null;
  area_kladr_id: string | null;
  area_with_type: string | null;
  area_type: string | null;
  area_type_full: string | null;
  area: string | null;
  city_fias_id: string;
  city_kladr_id: string;
  city_with_type: string;
  city_type: string;
  city_type_full: string;
  city: string;
  city_area: string | null;
  city_district_fias_id: string | null;
  city_district_kladr_id: string | null;
  city_district_with_type: string | null;
  city_district_type: string | null;
  city_district_type_full: string | null;
  city_district: string | null;
  settlement_fias_id: string | null;
  settlement_kladr_id: string | null;
  settlement_with_type: string | null;
  settlement_type: string | null;
  settlement_type_full: string | null;
  settlement: string | null;
  street_fias_id: string | null;
  street_kladr_id: string | null;
  street_with_type: string | null;
  street_type: string | null;
  street_type_full: string | null;
  street: string | null;
  stead_fias_id: string | null;
  stead_cadnum: string | null;
  stead_type: string | null;
  stead_type_full: string | null;
  stead: string | null;
  house_fias_id: string | null;
  house_kladr_id: string | null;
  house_cadnum: string | null;
  house_flat_count: string | null;
  house_type: string | null;
  house_type_full: string | null;
  house: string | null;
  block_type: string | null;
  block_type_full: string | null;
  block: string | null;
  entrance: string | null;
  floor: string | null;
  flat_fias_id: string | null;
  flat_cadnum: string | null;
  flat_type: string | null;
  flat_type_full: string | null;
  flat: string | null;
  flat_area: string | null;
  square_meter_price: string | null;
  flat_price: string | null;
  postal_box: string | null;
  fias_id: string;
  fias_code: string | null;
  fias_level: string;
  fias_actuality_state: string;
  kladr_id: string;
  geoname_id: string | null;
  capital_marker: string;
  okato: string | null;
  oktmo: string | null;
  tax_office: string | null;
  tax_office_legal: string | null;
  timezone: string | null;
  geo_lat: string | null;
  geo_lon: string | null;
  beltway_hit: string | null;
  beltway_distance: string | null;
  metro: string | null;
  divisions: string | null;
  qc_geo: string | null;
  qc_complete: string | null;
  qc_house: string | null;
  history_values: string[] | null;
  unparsed_parts: string | null;
  source: string | null;
  qc: string | null;
}

export interface SuggestionsResponse {
  suggestions: AddressSuggestion[];
}

export interface EventSpecificDate {
  id: number;
  event: number;
  is_main: boolean;
  start_date: string;
  end_date: string;
  payment: number;
  reminder_date: string | null;
  organizers: Profile[];
  participants: Profile[];
  createdAt: string;
  updatedAt: string;
}
export interface Notification {
  id: number;
  title: string;
  recipient_type: "for organizer" | "for participant" | "for anyone";
  type_notification: "new contact" | "invitation" | "cancellation" | "reminder" | "system" | "other";
  message: string;
  is_read: boolean;
  is_archived: boolean;
  sender: Profile | null;
  recipient: Profile | null;
  createdAt: string;
  updatedAt: string;
  for_executor: { status: StatusApplication | null };
  for_organizer: { status: StatusApplication | null };
}

export interface NotificationForOrganizer {
  id: number;
  notification: Notification;
  status: StatusApplication | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationForExecutor {
  id: number;
  notification: Notification;
  status: StatusApplication | null;
  createdAt: string;
  updatedAt: string;
}

export interface StatusApplication {
  id: number;
  status: "accept" | "reject" | "confirmed" | "consideration" | "cancellation" | "delete";
  role: "organizer" | "participant";
  project: Project | null;
  specific_event: EventSpecificDate | null;
  is_organizer_to_participant: boolean;
  sender_application: Profile | null;
  recipient_application: Profile[];
  createdAt: string;
  updatedAt: string;
}

export interface AccessLevel {
  id: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  name: string;
  user: Profile;
}

export interface PersonalLink {
  url: string;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  link: string;
  user: Profile;
}

export interface Profile {
  id: number;
  user: User;
  access_level: any[];
  personal_links: any[];
  settings: Settings;
  contacts: Profile[];
  createdAt: string;
  updatedAt: string;
  name: string;
  surname: string | undefined;
  safety: "closed" | "open" | "partial";
  photo: string | undefined;
  telegram: string | undefined;
  telegram_chat_id: number | undefined;
  info: string;
  email: string;
  personal_link: string;
  blocked_contacts: Profile[];
}

interface User {
  username: string;
  phone: string | null;
}

interface Settings {
  id: number;
  notification_settings: NotificationSettings;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  is_dark_mode: boolean;
  is_search_by_nickname: boolean;
  is_warning_about_upcoming_events: boolean;
  is_name: boolean;
  is_about_me: boolean;
  is_phone: boolean;
  is_link_to_telegram: boolean;
  is_email: boolean;
  profile: number;
}

interface NotificationSettings {
  id: number;
  createdAt: string; // ISO 8601 date string
  updatedAt: string; // ISO 8601 date string
  is_from_app: boolean;
  is_reminder_about_event: boolean;
  is_user_confirmed_event: boolean;
  is_invite_to_schedule: boolean;
  is_invite_to_event: boolean;
  is_change_in_event: boolean;
  is_cancellation_event: boolean;
  is_new_open_event: boolean;
  is_new_application: boolean;
  is_project_change_in_event: boolean;
  is_user_refused_to_participate: boolean;
  is_user_left_project: boolean;
  is_user_joined_project: boolean;
  settings: number;
}

export interface EventData {
  id: number;
  event: Event;
  additional_detail: AdditionalDetail;
  createdAt: string;
  updatedAt: string;
  is_main: boolean;
  start_date: string;
  end_date: string;
  payment: number;
  personal_note: string;
  reminder_date: string;
  organizers: number[];
  participants: Profile[];
}

export interface Event {
  id: number;
  project: Project;
  color: string | null;
  subgroups: Subgroup[];
  recurring: Recurring;
  createdAt: string;
  updatedAt: string;
  is_personal: boolean;
  name: string;
  photo: string | null;
  event_type: string;
  is_owl_mode: boolean;
  address: string;
  is_open: boolean;
  comment: string;
  is_reminder: boolean;
  owner: any | null;
}

interface AdditionalDetail {
  participants: Profile[];
  number_of_participants: number;
  is_applications: boolean;
}

export interface Color {
  id: number;
  name: string;
}
