import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useCouncilMembers, useElectionDistricts } from '@/hooks/useDataQuery';
import { CouncilMember, ElectionDistrict } from '@/types/data';

const MobileCityMemberListPage = () => {
  const { cityName } = useParams();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') as 'gyeonggi-si' | 'gyeonggi-do' | 'incheon-si' | 'incheon-gu' | null;

  const { data: districtsData } = useElectionDistricts(region?.startsWith('gyeonggi') ? 'gyeonggi' : 'incheon');
  const { data: membersData } = useCouncilMembers(region || 'gyeonggi-do');

  const cityDistricts = useMemo(() => {
    if (!districtsData) return [];
    return districtsData.filter((d) => d.city_name === cityName);
  }, [districtsData, cityName]);

  const [selectedDistrict, setSelectedDistrict] = useState<ElectionDistrict | null>(null);

  useEffect(() => {
    if (cityDistricts.length > 0) {
      setSelectedDistrict(cityDistricts[0]);
    } else {
      setSelectedDistrict({
        parent_council_id: '',
        council_name: '',
        council_type: '',
        city_name: '',
        election_district: cityName || '',
        election_area: '',
      });
    }
  }, [cityDistricts]);

  const districtMembers = useMemo(() => {
    console.log(membersData, selectedDistrict);

    if (!membersData) return [];
    return membersData.filter((item) => item.election_district === selectedDistrict?.election_district);
  }, [membersData, selectedDistrict]);

  if (!districtsData || !membersData) {
    return <div>Loading...</div>;
  }

  console.log(districtMembers);

  return (
    <div className="district_wrap">
      <Link to={`/detail?region=${region}`} className="back_btn">
        <ArrowBackOutlinedIcon />
        {cityName}
      </Link>

      <h2 className="region_title">{cityName} 선거구</h2>
      <p className="region_desc">
        선거구를 선택하시면 해당 의원의
        <br />
        공약을 확인할 수 있습니다.
      </p>

      <div className="district_list">
        {cityDistricts.map((district) => (
          <a
            style={{ whiteSpace: 'pre-wrap' }}
            key={district.election_district}
            href="#"
            className={cn('district_btn', { active: selectedDistrict?.election_district === district.election_district })}
            onClick={(e) => {
              e.preventDefault();
              setSelectedDistrict(district);
            }}
          >
            {district.election_district.replace('(', ' \n(')}
          </a>
        ))}
      </div>

      {selectedDistrict && (
        <div className="district_info">
          <h3 className="district_name">
            {selectedDistrict.election_district} <span>{selectedDistrict.city_name ? `(${selectedDistrict.city_name})` : ''}</span>
          </h3>
          <p className="district_area">{selectedDistrict.council_name}</p>
          <p className="district_count">정수 : {districtMembers.length}명</p>
        </div>
      )}

      <div className="member_list">
        {districtMembers.map((member: CouncilMember) => (
          <div key={member.member} className="member_card">
            <div className="member_thumb">
              <img src={member.member_image || '/images/etc/ansan_mayer.png'} alt="" />
            </div>
            <div className="member_info">
              <strong>{member.member} 의원</strong>
              <span className={cn({ party_blue: member.party_name === '더불어민주당', party_red: member.party_name === '국민의힘' })}>
                {member.party_name}
              </span>
              <Link
                to={`/member/${member.member}/pledges?region=${region}&electionArea=${selectedDistrict?.election_area}`}
                className="pledge_btn"
              >
                공약사항 보기
                <em>›</em>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileCityMemberListPage;
