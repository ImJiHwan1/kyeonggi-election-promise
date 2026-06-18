import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useAllMembers } from '@/hooks/useDataQuery';
import { CouncilMember } from '@/types/data';

const MobileSearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') as 'string' | null;

  const { data: allMembers } = useAllMembers();

  const filteredMembers = useMemo(() => {
    if (!allMembers || !query) return [];
    const searchLower = query.toLowerCase().replace(/\s/g, '');

    return allMembers.filter(
      (m) => m.member.replace(/\s/g, '').includes(searchLower) || m.election_district.replace(/\s/g, '').includes(searchLower),
    );
  }, [allMembers, query]);

  return (
    <div className="district_wrap">
      <Link to="/" className="back_btn">
        <ArrowBackOutlinedIcon />
        홈으로 돌아가기
      </Link>

      <h2 className="region_title">
        "{query}" 검색 결과 ({filteredMembers.length}건)
      </h2>
      <div className="member_list">
        {filteredMembers.map((member: CouncilMember) => (
          <div key={member.member} className="member_card">
            <div className="member_thumb">
              <img src={member.member_image || '/images/etc/ansan_mayer.png'} alt="" />
            </div>
            <div className="member_info">
              <strong>{member.member} 의원</strong>
              <span className={cn({ party_blue: member.party_name === '더불어민주당', party_red: member.party_name === '국민의힘' })}>
                {member.party_name}
              </span>
              {member.etc ? (
                <p style={{ marginTop: 28 }}>{member.etc}</p>
              ) : (
                <Link to={`/member/${member.member}/pledges?region=${member.categoryId}`} className="pledge_btn">
                  공약사항 보기
                  <em>›</em>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileSearchPage;
