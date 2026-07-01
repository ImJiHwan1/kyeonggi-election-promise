import React, { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@components/Header.tsx';
import MemberDetailModal from '@components/MemberDetailModal.tsx';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBox from '../components/SearchBox';
import { useAllMembers, useElectionDistricts } from '../hooks/useDataQuery';

const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const { data: allMembers, isLoading, isError } = useAllMembers();
  const { data: gyDistricts } = useElectionDistricts('gyeonggi');
  const { data: icDistricts } = useElectionDistricts('incheon');

  const districtAreaMap = useMemo(() => {
    const map: Record<string, string> = {};
    const normalize = (s: string) => (s || '').replace(/\s/g, '').replace(/\(.*\)/, '');
    [...(gyDistricts || []), ...(icDistricts || [])].forEach((d) => {
      const key = normalize(d.election_district);
      map[key] = d.election_area;
    });
    return map;
  }, [gyDistricts, icDistricts]);

  const filteredMembers = useMemo(() => {
    if (!allMembers || !query) return [];
    const searchLower = query.toLowerCase().replace(/\s/g, '');

    return allMembers.filter((m) => {
      if (!m || !m.member) return false;
      const memberName = m.member.toLowerCase().replace(/\s/g, '');
      const districtName = (m.election_district || '').toLowerCase().replace(/\s/g, '');
      const areaKey = (m.election_district || '').replace(/\s/g, '').replace(/\(.*\)/, '');
      const areaName = (districtAreaMap[areaKey] || '').toLowerCase().replace(/\s/g, '');

      return memberName.includes(searchLower) || districtName.includes(searchLower) || areaName.includes(searchLower);
    });
  }, [allMembers, query, districtAreaMap]);

  return (
    <>
      <div className="wrapper pledge_contents">
        <Header />

        <div className="pledge_contents_container">
          <div className="pledge_location_tab" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ width: '400px' }}>
                <SearchBox initialValue={query} />
              </div>
            </div>
          </div>

          <div className="location_pledge_cotainer">
            <div className="pledge_loc_title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={() => navigate('/')}>
                <ArrowBackOutlinedIcon />
                <span>홈으로 돌아가기</span>
              </div>
              <p>
                "{query}" 검색 결과 ({filteredMembers.length}건)
              </p>
              <div></div>
            </div>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
              </Box>
            ) : isError ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '50px', color: 'red' }}>
                데이터를 불러오는 중 오류가 발생했습니다.
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lawmaker_list_container active"
                style={{ marginTop: '30px' }}
              >
                <div className="lawmaker_card_flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                  <AnimatePresence mode="popLayout">
                    {filteredMembers.map((member: any, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="lawmaker_card"
                        key={`${member.member}-${member.election_district}-${idx}`}
                        style={{ width: 'calc(25% - 15px)', minWidth: '255px', flex: '0 0 calc(25% - 15px)' }}
                      >
                        <div className="card_location">
                          <p style={{ fontSize: '0.85rem', color: '#1976d2', fontWeight: 'bold', marginBottom: '4px' }}>
                            {member.category}
                          </p>
                          <p>{member.election_district || ''}</p>
                          {districtAreaMap[(member.election_district || '').replace(/\s/g, '').replace(/\(.*\)/, '')] && (
                            <span style={{ fontSize: '0.8rem', color: '#777', display: 'block', marginTop: '4px' }}>
                              ({districtAreaMap[(member.election_district || '').replace(/\s/g, '').replace(/\(.*\)/, '')]})
                            </span>
                          )}
                        </div>
                        <div className="media lawmaker_profile">
                          <div className="profile_thumb">
                            <img src={member.member_image || '/images/etc/no_img_vertical.png'} alt={member.member} />
                          </div>
                          <div className="profile_txt">
                            <div className="profile_con">
                              <p className="p_name">{member.member} 의원</p>
                              <span
                                className="p_span"
                                style={{
                                  color:
                                    member.party_name === '더불어민주당'
                                      ? '#0288d1'
                                      : member.party_name === '국민의힘'
                                        ? '#d32f2f'
                                        : 'inherit',
                                }}
                              >
                                {member.party_name}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="btn btn_w_view"
                              onClick={() => {
                                const district = member.election_district || '';
                                const params = new URLSearchParams(searchParams);
                                params.set('member', member.member);
                                params.set('district', district);
                                params.set('region', member.categoryId);
                                params.set('electionArea', districtAreaMap[district.replace(/\s/g, '').replace(/\(.*\)/, '')] || '');
                                navigate(`/search?${params.toString()}`, { replace: true });
                              }}
                            >
                              공약사항
                              <ArrowForwardIosOutlinedIcon style={{ fontSize: 16 }} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {filteredMembers.length === 0 && (
                    <div style={{ width: '100%', textAlign: 'center', padding: '100px 0' }}>
                      <p style={{ fontSize: '1.2rem', color: '#666' }}>검색 결과가 없습니다.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
      <MemberDetailModal />
    </>
  );
};

export default SearchPage;
