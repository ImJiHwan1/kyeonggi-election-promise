import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { useCouncilMembers } from '@/hooks/useDataQuery';
import { CouncilMember } from '@/types/data';

const MobileMemberPledgePage = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') as 'gyeonggi-si' | 'gyeonggi-do' | 'incheon-si' | 'incheon-gu' | null;
  const district = searchParams.get('district');
  const electionArea = searchParams.get('electionArea');

  const { data: membersData } = useCouncilMembers(region || 'gyeonggi-do');

  const member: CouncilMember | undefined = membersData?.find((m) => {
    if (district) {
      return m.member === memberId && m.election_district === district;
    }
    return m.member === memberId;
  });

  if (!member) {
    return <div>Loading...</div>;
  }

  const pledges = member
    ? Object.entries(member)
        .filter(([key]) => key.startsWith('pledge'))
        .map(([_, value]) => value)
        .filter(Boolean)
    : [];

  return (
    <div className="p_modal_wrap" style={{ display: 'block' }}>
      <div className="pledge_modal">
        <div className="modal_close" onClick={() => navigate(-1)}>
          ✕
        </div>

        <div className="district_info">
          <h3 className="district_name">{member.election_district}</h3>
          <p className="district_area">{electionArea}</p>
        </div>

        <div className="member_card">
          <div className="member_thumb">
            <img src={member.member_image || '/images/etc/no_img_vertical.png'} alt="" />
          </div>
          <div className="member_info">
            <strong>{member.member} 의원</strong>
            <span className={cn({ party_blue: member.party_name === '더불어민주당', party_red: member.party_name === '국민의힘' })}>
              {member.party_name}
            </span>
          </div>
        </div>

        <div className="pledge_content">
          <div className="pledge_head">
            <strong>공약사항</strong>
          </div>
          {member.etc && (
            <div
              className="etc_pledge_notice"
              style={{
                padding: '20px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9',
                marginBottom: '10px',
                borderRadius: '8px',
                color: '#222',
                fontWeight: 'bold',
                wordBreak: 'keep-all',
              }}
            >
              {member.etc}
            </div>
          )}
          <ul className="pledge_list">
            {pledges?.map((pledge, index) => (
              <li key={index}>
                <span className="pledge_num">{index + 1}</span>
                <p>{pledge}</p>
              </li>
            ))}
          </ul>
          <p className="pledge_notice" style={{ paddingBottom: 16 }}>
            * 공약내용은 후보자가 제출한 자료를 기반으로 작성되었습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileMemberPledgePage;
