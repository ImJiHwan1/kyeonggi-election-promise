import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import MemberDetailModal from '@components/MemberDetailModal.tsx';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Box, CircularProgress } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { tabs } from '@/consts';
import SearchBox from '../components/SearchBox';
import { useCouncilMembers, useElectionDistricts } from '../hooks/useDataQuery';

const DetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') || 'gyeonggi-do';
  const search = searchParams.get('search');

  const { data: districtsData, isError: districtsError } = useElectionDistricts(region.startsWith('gyeonggi') ? 'gyeonggi' : 'incheon');
  const { data: members, isLoading: membersLoading, isError: membersError } = useCouncilMembers(region as any);
  const [selectedCity, setSelectedCity] = useState<string>('전체');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('전체');
  const scrollRef = useRef<HTMLDivElement>(null);

  const cities = useMemo(() => {
    if (!districtsData) return [];
    const uniqueCities = Array.from(new Set(districtsData.map((d) => d.city_name)));
    return uniqueCities.sort();
  }, [districtsData]);

  const districtAreaMap = useMemo(() => {
    if (!districtsData) return {};
    const map: Record<string, string> = {};
    const normalize = (s: string) => s.replace(/\s/g, '').replace(/\(.*\)/, '');
    districtsData.forEach((d) => {
      const key = normalize(d.election_district);
      map[key] = d.election_area;
    });
    return map;
  }, [districtsData]);

  const districts = useMemo(() => {
    if (!members || selectedCity === '전체') return [];

    const cityMembers = members.filter((m) => {
      if (selectedCity === '비례대표') {
        return m.election_district.includes('비례대표');
      }
      return m.election_district.replace(/\s/g, '').startsWith(selectedCity.replace(/\s/g, ''));
    });

    const uniqueDistricts = Array.from(new Set(cityMembers.map((m) => m.election_district)));

    return uniqueDistricts.sort((a, b) => {
      const matchA = a.match(/제(\d+)선거구/);
      const matchB = b.match(/제(\d+)선거구/);

      const numA = matchA ? Number(matchA[1]) : 0;
      const numB = matchB ? Number(matchB[1]) : 0;
      return numA - numB;
    });
  }, [members, selectedCity]);

  useEffect(() => {
    setSelectedDistrict('전체');
  }, [selectedCity]);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    let result = members;
    if (selectedCity && selectedCity !== '전체') {
      result = result.filter((m) => {
        if (selectedCity === '비례대표') {
          return m.election_district.includes('비례대표');
        }
        return m.election_district.replace(/\s/g, '').startsWith(selectedCity.replace(/\s/g, ''));
      });
    }

    if (selectedDistrict && selectedDistrict !== '전체') {
      result = result.filter((m) => m.election_district === selectedDistrict);
    }

    if (search) {
      const searchLower = search.toLowerCase().replace(/\s/g, '');
      result = result.filter(
        (m) =>
          (m.member || '').replace(/\s/g, '').includes(searchLower) || (m.election_district || '').replace(/\s/g, '').includes(searchLower),
      );
    }
    return result;
  }, [members, selectedCity, selectedDistrict, search]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleRegionTab = (newRegion: string) => {
    navigate(`/detail?region=${newRegion}`);
    setSelectedCity('전체');
  };

  const currentTab = tabs.find((t) => t.id === region) || tabs[0];

  useEffect(() => {
    if (search && filteredMembers.length > 0) {
      const element = document.querySelector('.location_pledge_cotainer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [search, filteredMembers.length]);

  const getMapImg = () => {
    if (region.startsWith('gyeonggi')) return '/images/etc/ky01_map.png';
    return '/images/etc/ic01_map.png';
  };

  return (
    <>
      <div className="wrapper pledge_contents">
        <div className="pledge_head_container">
          <img style={{ cursor: 'pointer' }} src="/images/etc/h_left_logo.png" alt="공약추적단 이미지" onClick={() => navigate('/')} />
          <Link to="https://www.kyeonggi.com/" target="_blank">
            <img src="/images/etc/h_right_logo.png" alt="경기일보로고" />
          </Link>
        </div>
        {/* //헤더 */}

        {/* 콘텐츠 */}
        <div className="pledge_contents_container">
          {/* 탭메뉴 */}
          <div className="pledge_location_tab">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              {tabs.map((tab) => (
                <li className="nav-item" key={tab.id}>
                  <a
                    className={`nav-link ${region === tab.id ? 'active' : ''}`}
                    onClick={() => handleRegionTab(tab.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    {tab.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* 검색창 */}
            <SearchBox initialValue={search || ''} region={region} />
          </div>

          <div className="pledge_detail_container">
            <AnimatePresence mode="wait">
              <motion.div
                key={region}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="tab-content"
              >
                <div className="tab-pane fade show active">
                  <div className="detail_page_title">
                    <h1>{currentTab.label} 공약</h1>
                    <p>{currentTab.label}들의 공약을 지역별로 확인해보세요.</p>
                  </div>

                  <div className="pledge_detail_contents">
                    <div className="location_map">
                      <img src={getMapImg()} alt="지역 맵" loading="lazy" style={{ width: 500, height: 510 }} />
                    </div>

                    <div className="location_select">
                      <div className="location_select_title">
                        <p>{currentTab.label}들의 공약을</p>
                        <p>지역별로 확인해 보세요.</p>
                        <p>시군을 클릭하시면 해당 지역 의원의 공약을 보실 수 있습니다.</p>
                      </div>

                      <div
                        className="location_btn_container"
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '7px' }}
                      >
                        <button
                          type="button"
                          className={`btn btn_location ${!selectedCity || selectedCity === '전체' ? 'active' : ''}`}
                          onClick={() => setSelectedCity('전체')}
                          style={{ width: '100%', margin: 0 }}
                        >
                          전체
                        </button>
                        {cities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            className={`btn btn_location ${selectedCity === city ? 'active' : ''}`}
                            onClick={() => setSelectedCity(city)}
                            style={{ margin: 0 }}
                          >
                            {city}
                          </button>
                        ))}
                        <button
                          type="button"
                          className={`btn btn_location ${selectedCity === '비례대표' ? 'active' : ''}`}
                          onClick={() => setSelectedCity('비례대표')}
                          style={{ width: '100%', margin: 0 }}
                        >
                          비례대표
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="location_pledge_line"></div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* 의원 리스트 영역 */}
            <div className="location_pledge_cotainer" style={{ marginTop: '40px' }}>
              <div className="pledge_loc_title">
                <p>{selectedCity === '전체' ? currentTab.label : selectedCity}</p>
              </div>

              {selectedCity !== '전체' && districts.length > 0 && (
                <div className="district_tab_wrapper" style={{ marginTop: '20px' }}>
                  <button type="button" className="btn_tab_arrow prev" onClick={() => handleScroll('left')}>
                    <ChevronLeftIcon />
                  </button>

                  <div className="district_tab_scroll" ref={scrollRef}>
                    <ul className="district_tab_list">
                      <li>
                        <button
                          type="button"
                          className={`btn_d_tab ${selectedDistrict === '전체' ? 'active' : ''}`}
                          onClick={() => setSelectedDistrict('전체')}
                        >
                          전체
                        </button>
                      </li>
                      {districts.map((dist) => {
                        // Extract only the district part if it starts with the city name, and remove bracketed info like (장안구)
                        let label = dist.startsWith(selectedCity) ? dist.replace(selectedCity, '').trim() : dist;

                        // Remove everything in parentheses for the tab label (e.g., "제1선거구(장안구)" -> "제1선거구")
                        label = label.replace(/\(.*\)/, '').trim();

                        return (
                          <li key={dist}>
                            <button
                              type="button"
                              className={`btn_d_tab ${selectedDistrict === dist ? 'active' : ''}`}
                              onClick={() => setSelectedDistrict(dist)}
                            >
                              {label || dist}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>

                  <button type="button" className="btn_tab_arrow next" onClick={() => handleScroll('right')}>
                    <ChevronRightIcon />
                  </button>
                </div>
              )}

              {membersLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                  <CircularProgress />
                </Box>
              ) : membersError || districtsError ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '50px', color: 'red' }}>
                  데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="lawmaker_list_container active"
                >
                  <div className="lawmaker_card_flex" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                    <AnimatePresence mode="popLayout">
                      {filteredMembers.map((member, idx) => (
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
                            <p>{member.election_district}</p>
                            {districtAreaMap[member.election_district.replace(/\s/g, '').replace(/\(.*\)/, '')] && (
                              <span style={{ fontSize: '0.8rem', color: '#777', display: 'block', marginTop: '4px' }}>
                                ({districtAreaMap[member.election_district.replace(/\s/g, '').replace(/\(.*\)/, '')]})
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
                                disabled={member.election_district.includes('비례대표')}
                                onClick={() => {
                                  const params = new URLSearchParams();

                                  params.set('member', member.member);
                                  params.set('district', member.election_district);
                                  params.set('region', region);
                                  params.set(
                                    'electionArea',
                                    districtAreaMap[member.election_district.replace(/\s/g, '').replace(/\(.*\)/, '')] || '',
                                  );

                                  navigate(`${window.location.pathname}?${params.toString()}`, { replace: true });
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
                      <div style={{ width: '100%', textAlign: 'center', padding: '50px' }}>검색 결과가 없습니다.</div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
      <MemberDetailModal />
    </>
  );
};

export default DetailPage;
