import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, InputBase, List, ListItemButton, ListItemText, Paper, Toolbar, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useAllMembers, useElectionDistricts } from '../hooks/useDataQuery';
import { useRecentSearches } from '../hooks/useRecentSearches';
import ScrollBarProvider from './ScrollBarProvider';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '20px',
  backgroundColor: '#fff',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.9),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  display: 'flex',
  alignItems: 'center',
  padding: '0 10px',
  border: '1px solid #ddd',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 1),
  height: '100%',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#666',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#333',
  width: '300px',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    fontSize: '14px',
  },
}));

const NavButton = styled(Button)(() => ({
  color: '#fff',
  fontWeight: 500,
  fontSize: '16px',
  margin: '0 10px',
  '&:hover': {
    backgroundColor: alpha('#fff', 0.1),
  },
  '&.active': {
    backgroundColor: '#1a237e',
    borderRadius: '4px',
  },
}));

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { data: allMembers } = useAllMembers();
  const { data: gyeonggiDistricts } = useElectionDistricts('gyeonggi');
  const { data: incheonDistricts } = useElectionDistricts('incheon');
  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();

  const districts = [...(gyeonggiDistricts || []), ...(incheonDistricts || [])];
  const districtAreaMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    districts.forEach((d) => {
      map[d.election_district.replace(/\s/g, '')] = d.election_area;
    });
    return map;
  }, [districts]);

  const queryParams = new URLSearchParams(location.search);
  const currentRegion = queryParams.get('region');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredMembers = searchQuery
    ? allMembers
        ?.filter(
          (m) =>
            (m.member || '').toLowerCase().replace(/\s/g, '').includes(searchQuery.toLowerCase().replace(/\s/g, '')) ||
            (m.election_district || '').toLowerCase().replace(/\s/g, '').includes(searchQuery.toLowerCase().replace(/\s/g, '')),
        )
        .slice(0, 10)
    : [];

  const handleNav = (region: string) => {
    navigate(`/detail?region=${region}`);
  };

  const handleMemberClick = (member: any) => {
    addSearch(member.member);
    const currentParams = new URLSearchParams();
    currentParams.set('member', member.member);
    currentParams.set('district', member.election_district);
    currentParams.set('region', member.categoryId);
    navigate(`/detail?${currentParams.toString()}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      addSearch(searchQuery.trim());
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#001529', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: '80px', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Box
              sx={{
                backgroundColor: '#795548',
                p: 0.5,
                borderRadius: '4px',
                mr: 1,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 'bold', lineHeight: 1 }}>
                지방의원
                <br />
                공약 추적단
              </Typography>
            </Box>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ color: '#fff', fontWeight: 'bold', display: { xs: 'none', sm: 'block' } }}
            >
              경기일보
            </Typography>
          </Box>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <NavButton className={currentRegion === 'gyeonggi-do' ? 'active' : ''} onClick={() => handleNav('gyeonggi-do')}>
              경기도의원
            </NavButton>
            <NavButton className={currentRegion === 'incheon-si' ? 'active' : ''} onClick={() => handleNav('incheon-si')}>
              인천광역시의원
            </NavButton>
            <NavButton className={currentRegion === 'gyeonggi-si' ? 'active' : ''} onClick={() => handleNav('gyeonggi-si')}>
              경기도 시·군의원
            </NavButton>
            <NavButton className={currentRegion === 'incheon-gu' ? 'active' : ''} onClick={() => handleNav('incheon-gu')}>
              인천광역시 구·군의원
            </NavButton>
          </Box>

          {/* Search */}
          <Box sx={{ position: 'relative' }} ref={searchRef}>
            <Search>
              <SearchIconWrapper>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="의원 이름과 지역을 검색해보세요."
                inputProps={{ 'aria-label': 'search' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  backgroundColor: '#002884',
                  borderRadius: '0 20px 20px 0',
                  height: '100%',
                  minWidth: '60px',
                  ml: 1,
                }}
              >
                검색
              </Button>
            </Search>

            {/* Search Results Dropdown */}
            {isSearchOpen && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '400px',
                  zIndex: 1000,
                  boxShadow: 3,
                  maxHeight: '500px',
                }}
              >
                <ScrollBarProvider style={{ maxHeight: '500px' }} noScrollX={true}>
                  <Box sx={{ p: 2 }}>
                    {recentSearches.length > 0 && !searchQuery && (
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            최근 검색어
                          </Typography>
                          <Button size="small" onClick={clearAll} sx={{ color: '#888' }}>
                            전체 삭제
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {recentSearches.map((term) => (
                            <Box
                              key={term}
                              onClick={() => {
                                setSearchQuery(term);
                                addSearch(term);
                                navigate(`/search?q=${encodeURIComponent(term)}`);
                                setIsSearchOpen(false);
                              }}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                backgroundColor: '#f0f0f0',
                                borderRadius: '4px',
                                px: 1,
                                py: 0.5,
                                cursor: 'pointer',
                                fontSize: '12px',
                              }}
                            >
                              {term}
                              <Box
                                component="span"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeSearch(term);
                                }}
                                sx={{ ml: 1, color: '#888' }}
                              >
                                ✕
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {searchQuery && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom fontWeight="bold">
                          검색 결과
                        </Typography>
                        <List dense>
                          {filteredMembers?.map((member, index) => {
                            const area = districtAreaMap[member.election_district.replace(/\s/g, '')];
                            return (
                              <ListItemButton key={index} onClick={() => handleMemberClick(member)} sx={{ borderRadius: 1, mb: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Box component="span" sx={{ fontWeight: 'bold' }}>
                                      {member.election_district}{' '}
                                      {area && (
                                        <Box component="span" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>
                                          ({area})
                                        </Box>
                                      )}
                                    </Box>
                                  }
                                  secondary={member.member}
                                />
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                              </ListItemButton>
                            );
                          })}
                          {filteredMembers?.length === 0 && (
                            <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
                              검색 결과가 없습니다.
                            </Typography>
                          )}
                        </List>
                      </>
                    )}
                  </Box>
                </ScrollBarProvider>
              </Paper>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
