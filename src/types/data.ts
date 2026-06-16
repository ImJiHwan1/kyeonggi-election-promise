export interface ElectionDistrict {
  parent_council_id: string;
  council_name: string;
  council_type: string;
  city_name: string;
  election_district: string;
  election_area: string;
}

export interface CouncilMember {
  election_district: string;
  party_name: string;
  member: string;
  member_image: string;
  etc?: string;
  [key: string]: string | undefined; // For pledges (pledge1, pledge2, etc.)
}

export interface IndexTab {
  tab_name: string;
  content: string;
}
