import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCouncilMembers, useElectionDistricts } from '../hooks/useDataQuery';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Container,
  Button,
  Paper,
} from '@mui/material';
import { useState, useMemo } from 'react';

// Landing View Component
const LandingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper pledge_contents">
      {/* 헤더 */}
      <div className="pledge_head_container">
        <img src="/images/etc/h_left_logo.png" alt="공약추적단 이미지" />
        <a href="https://www.kyeonggi.com/">
          <img src="/images/etc/h_right_logo.png" alt="경기일보로고" />
        </a>
      </div>
      {/* //헤더 */}
      {/* 콘텐츠 */}
      <div className="pledge_contents_container">
        {/* 상단 대시보드 */}
        <div className="top_dash">
          {/* 좌측 콘텐츠 */}
          <div className="left_dash_txt">
            <div className="top_title">
              <h1>지방의원 공약 추적단</h1>
              <p>경기도·인천광역시 지방의원 공약을 한눈에 확인하세요</p>
            </div>
            <div className="bottom_title">
              <div className="sub_title_line">
                <img src="/images/ico/quote_ico.png" alt="인용아이콘" />
                <span>약속은 선거에서 끝나지 않습니다.</span>
              </div>
              <div className="sub_txt_line_01">
                <p>경기일보는 광주일보·영남일보·충청투데이와 함께</p>
                <p>지방의원 공약을 수집·공개하고 공약 이행 현황을</p>
                <p>지속적으로 점검하기 위해 “지방의원 공약 추적단”을 운영합니다.</p>
              </div>
              <div className="sub_txt_line_02">
                <p>경기도와 인천광역시 지방의원들이 유권자에게 약속한 공약을</p>
                <p>쉽고 편리하게 확인해보세요.</p>
              </div>
            </div>
          </div>
          {/* //좌측 콘텐츠 */}
          {/* 우측 콘텐츠 */}
          <div className="right_dash_con">
            <div className="dash_input_box">
              <img src="/images/ico/search_ico.png" alt="검색아이콘" />
              <input
                type="text"
                className="form-control right_input"
                placeholder="의원 이름과 지역을 검색해 보세요."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value) {
                      navigate(`/?region=all&search=${encodeURIComponent(value)}`);
                    }
                  }
                }}
              />
              <button
                type="button"
                className="btn_dash_search"
                onClick={(e) => {
                  const input = (e.currentTarget.previousSibling as HTMLInputElement);
                  if (input.value) {
                    navigate(`/?region=all&search=${encodeURIComponent(input.value)}`);
                  }
                }}
              >
                검색
              </button>
            </div>
          </div>
          {/* //우측 콘텐츠 */}
        </div>
        {/* //상단 대시보드 */}
        {/* 하단 메뉴영역 */}
        <div className="under_menu_container">
          {/* 경기도 의원공약보기 */}
          <div className="pledge_menu_box ky01">
            <img src="/images/etc/menu_01_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_01.png" alt="메뉴아이콘" />
              </div>
              <span>경기도 의원 공약</span>
            </div>
            {/* //타이틀 */}
            {/* 내용 */}
            <p>
              경기도의회 의원들의<br />
              공약을 확인하세요.
            </p>
            {/* //내용 */}
            {/* 버튼 */}
            <button type="button" className="btn btn_view01" onClick={() => navigate('/?region=gyeonggi-do')}>
              바로가기
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
            {/* //버튼 */}
          </div>
          {/* //경기도 의원공약보기 */}
          {/* 인천광역시 의원공약보기 */}
          <div className="pledge_menu_box ic01">
            <img src="/images/etc/menu_02_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_02.png" alt="메뉴아이콘" />
              </div>
              <span>인천광역시 의원 공약</span>
            </div>
            {/* //타이틀 */}
            {/* 내용 */}
            <p>
              인천광역시의회 의원들의<br />
              공약을 확인하세요.
            </p>
            {/* //내용 */}
            {/* 버튼 */}
            <button type="button" className="btn btn_view01" onClick={() => navigate('/?region=incheon-si')}>
              바로가기
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
            {/* //버튼 */}
          </div>
          {/* //인천광역시 의원공약보기 */}
          {/* 경기도시군의회 공약보기 */}
          <div className="pledge_menu_box ky02">
            <img src="/images/etc/menu_03_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_03.png" alt="메뉴아이콘" />
              </div>
              <span>경기도 31개 시군의원 공약</span>
            </div>
            {/* //타이틀 */}
            {/* 내용 */}
            <p>
              경기도 31개 시·군의회 의원들의<br />
              공약을 확인하세요.
            </p>
            {/* //내용 */}
            {/* 버튼 */}
            <button type="button" className="btn btn_view01" onClick={() => navigate('/?region=gyeonggi-si')}>
              바로가기
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
            {/* //버튼 */}
          </div>
          {/* //경기도시군의회 공약보기 */}
          {/* 인천광역시 구군의원 공약보기 */}
          <div className="pledge_menu_box ic02">
            <img src="/images/etc/menu_04_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_03.png" alt="메뉴아이콘" />
              </div>
              <span>인천광역시 11개 구군의원 공약</span>
            </div>
            {/* //타이틀 */}
            {/* 내용 */}
            <p>
              인천광역시 11개 구·군 의원들의<br />
              공약을 확인하세요.
            </p>
            {/* //내용 */}
            {/* 버튼 */}
            <button type="button" className="btn btn_view01" onClick={() => navigate('/?region=incheon-gu')}>
              바로가기
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
            {/* //버튼 */}
          </div>
          {/* //인천광역시 구군의원 공약보기 */}
        </div>
        {/* //하단 메뉴영역 */}
      </div>
      {/* //콘텐츠 */}
    </div>
  );
};

// Category View Component
const CategoryView: React.FC<{ region: string }> = ({ region }) => {
  const navigate = useNavigate();
  const { data: members, isLoading: membersLoading } = useCouncilMembers(region as any);
  const { data: districtsData } = useElectionDistricts(region.startsWith('gyeonggi') ? 'gyeonggi' : 'incheon');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const cities = useMemo(() => {
    if (!districtsData) return [];
    const uniqueCities = Array.from(new Set(districtsData.map((d) => d.city_name)));
    return uniqueCities.sort();
  }, [districtsData]);

  const filteredMembers = useMemo(() => {
    if (!members) return [];
    if (!selectedCity) return members;
    return members.filter((m) => m.election_district.includes(selectedCity));
  }, [members, selectedCity]);

  const getTitle = () => {
    switch (region) {
      case 'gyeonggi-do': return '경기도의원 공약';
      case 'incheon-si': return '인천광역시의원 공약';
      case 'gyeonggi-si': return '경기도 시·군의원 공약';
      case 'incheon-gu': return '인천광역시 구·군의원 공약';
      default: return '공약 추적단';
    }
  };

  const handleCardClick = (member: string, district: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('member', member);
    currentParams.set('district', district);
    currentParams.set('region', region);
    navigate(`${window.location.pathname}?${currentParams.toString()}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          {getTitle()}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {getTitle()}을 지역별로 확인해보세요.
        </Typography>
      </Box>

      <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eee', mb: 6 }}>
        <Grid container spacing={4}>
          {/* Map Placeholder */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Box
              sx={{
                width: '100%',
                height: '400px',
                backgroundColor: '#e3f2fd',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #bbdefb',
                position: 'relative',
              }}
            >
              <Box
                component="svg"
                viewBox="0 0 100 120"
                sx={{ width: '80%', height: '80%', color: '#90caf9', opacity: 0.5 }}
              >
                <path
                  fill="currentColor"
                  d="M50,10 L70,20 L80,40 L75,70 L50,110 L25,70 L20,40 L30,20 Z"
                />
                <text x="50" y="60" fontSize="5" textAnchor="middle" fill="#1976d2" fontWeight="bold">
                  {region.includes('gyeonggi') ? '경기도 지도' : '인천 지도'}
                </text>
              </Box>
            </Box>
          </Grid>

          {/* City Grid */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Box>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {getTitle()}을 <br />
                <Box component="span" color="primary.main">지역별로 확인해보세요.</Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                시·군을 클릭하시면 해당 지역 의원의 공약을 보실 수 있습니다.
              </Typography>
              
              <Grid container spacing={1}>
                <Grid size={{ xs: 4, sm: 3, md: 2.4 }}>
                  <Button
                    fullWidth
                    variant={selectedCity === null ? 'contained' : 'outlined'}
                    onClick={() => setSelectedCity(null)}
                    sx={{ py: 1 }}
                  >
                    전체
                  </Button>
                </Grid>
                {cities.map((city) => (
                  <Grid key={city} size={{ xs: 4, sm: 3, md: 2.4 }}>
                    <Button
                      fullWidth
                      variant={selectedCity === city ? 'contained' : 'outlined'}
                      onClick={() => setSelectedCity(city)}
                      sx={{ py: 1, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                    >
                      {city}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Members List */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold">
          {selectedCity || '전체'} 의원 목록 ({filteredMembers.length}명)
        </Typography>
      </Box>

      {membersLoading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMembers.map((item, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'translateY(-4px)',
                    transition: '0.3s',
                  },
                }}
              >
                <CardActionArea
                  onClick={() => handleCardClick(item.member || '', item.election_district || '')}
                  sx={{ flexGrow: 1 }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.member_image || 'https://via.placeholder.com/150'}
                    alt={item.member}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap fontWeight="bold">
                      {item.member}
                    </Typography>
                    <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
                      {item.party_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.election_district}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {filteredMembers.length === 0 && (
            <Grid size={{ xs: 12 }}>
              <Box sx={{ py: 10, textAlign: 'center', backgroundColor: '#fff', borderRadius: 2 }}>
                <Typography color="text.secondary">등록된 의원 정보가 없습니다.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

const MainPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');

  if (!region) {
    return <LandingView />;
  }

  return <CategoryView region={region} />;
};

export default MainPage;
