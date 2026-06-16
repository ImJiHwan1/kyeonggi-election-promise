import React, { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAllMembers, useElectionDistricts } from '../hooks/useDataQuery';
import { CircularProgress, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import SearchBox from '../components/SearchBox';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  
  const { data: allMembers, isLoading, isError } = useAllMembers();
  
  // We might need district info for inclusion areas, but useAllMembers doesn't have it easily.
  // For search page, maybe we skip inclusion area or fetch all districts too.
  // Let's fetch both regions' districts for more info.
  const { data: gyDistricts } = useElectionDistricts('gyeonggi');
  const { data: icDistricts } = useElectionDistricts('incheon');

  const districtAreaMap = useMemo(() => {
    const map: Record<string, string> = {};
    [...(gyDistricts || []), ...(icDistricts || [])].forEach((d) => {
      const key = d.election_district.replace(/\s/g, '');
      map[key] = d.election_area;
    });
    return map;
  }, [gyDistricts, icDistricts]);

  const filteredMembers = useMemo(() => {
    if (!allMembers || !query) return [];
    const searchLower = query.toLowerCase().replace(/\s/g, '');
    
    return allMembers.filter(m =>
      m.member.replace(/\s/g, '').includes(searchLower) ||
      m.election_district.replace(/\s/g, '').includes(searchLower)
    );
  }, [allMembers, query]);

  return (
    <div className="wrapper pledge_contents">
      {/* 헤더 */}
      <div className="pledge_head_container">
        <img src="/images/etc/h_left_logo.png" alt="공약추적단 이미지" />
        <a href="https://www.kyeonggi.com/">
          <img src="/images/etc/h_right_logo.png" alt="경기일보로고" />
        </a>
      </div>
      
      <div className="pledge_contents_container">
        <div className="pledge_location_tab" style={{ marginBottom: '40px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ width: '400px' }}>
              <SearchBox initialValue={query} />
            </div>
          </div>
        </div>

        <div className="location_pledge_cotainer">

          <div className="pledge_loc_title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
              <ArrowBackOutlinedIcon />
              <span>뒤로 가기</span>
            </div>
            <p>"{query}" 검색 결과 ({filteredMembers.length}건)</p>
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
                         <p>{member.election_district}</p>
                         {districtAreaMap[member.election_district.replace(/\s/g, '')] && (
                           <span style={{ fontSize: '0.8rem', color: '#777', display: 'block', marginTop: '4px' }}>
                             ({districtAreaMap[member.election_district.replace(/\s/g, '')]})
                           </span>
                         )}
                       </div>
                       <div className="media lawmaker_profile">
                         <div className="profile_thumb">
                           <img src={member.member_image || "/images/etc/lawmaker_img_01.jpg"} alt={member.member} />
                         </div>
                         <div className="profile_txt">
                           <div className="profile_con">
                             <p className="p_name">{member.member} 의원</p>
                             <span className="p_span">{member.party_name}</span>
                           </div>
                           <button
                             type="button"
                             className="btn btn_w_view"
                             onClick={() => {
                               const params = new URLSearchParams(searchParams);
                               params.set('member', member.member);
                               params.set('district', member.election_district);
                               params.set('region', member.categoryId);
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
  );
};

export default SearchPage;
