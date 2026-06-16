import React, { useState, useRef, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  Button,
  Container,
  Paper,
  List,
  ListItemText,
  ListItemIcon,
  ListItemButton,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAllMembers } from '../hooks/useDataQuery';

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
    ? allMembers?.filter(
        (m) =>
          m.member.includes(searchQuery) ||
          m.election_district.includes(searchQuery) ||
          m.category.includes(searchQuery)
      ).slice(0, 10)
    : [];

  const handleNav = (region: string) => {
    navigate(`/?region=${region}`);
  };

  const handleMemberClick = (member: any) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('member', member.member);
    currentParams.set('district', member.election_district);
    currentParams.set('region', member.categoryId);
    navigate(`${window.location.pathname}?${currentParams.toString()}`);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#001529', boxShadow: 'none' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: '80px', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box
            sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
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
            <NavButton
              className={currentRegion === 'gyeonggi-do' ? 'active' : ''}
              onClick={() => handleNav('gyeonggi-do')}
            >
              경기도의원
            </NavButton>
            <NavButton
              className={currentRegion === 'incheon-si' ? 'active' : ''}
              onClick={() => handleNav('incheon-si')}
            >
              인천광역시의원
            </NavButton>
            <NavButton
              className={currentRegion === 'gyeonggi-si' ? 'active' : ''}
              onClick={() => handleNav('gyeonggi-si')}
            >
              경기도 시·군의원
            </NavButton>
            <NavButton
              className={currentRegion === 'incheon-gu' ? 'active' : ''}
              onClick={() => handleNav('incheon-gu')}
            >
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
              />
              <Button
                variant="contained"
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
            {isSearchOpen && (searchQuery || (filteredMembers && filteredMembers.length > 0)) && (
              <Paper
                sx={{
                  position: 'absolute',
                  top: '110%',
                  right: 0,
                  width: '400px',
                  zIndex: 1000,
                  boxShadow: 3,
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    검색 결과
                  </Typography>
                  <List dense>
                    {filteredMembers?.map((member, index) => (
                      <ListItemButton
                        key={index}
                        onClick={() => handleMemberClick(member)}
                        sx={{ borderRadius: 1, mb: 0.5 }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary={`${member.election_district} - ${member.member}`}
                          secondary={member.category}
                        />
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </ListItemButton>
                    ))}
                    {filteredMembers?.length === 0 && searchQuery && (
                      <Typography sx={{ p: 2, textAlign: 'center' }} color="text.secondary">
                        검색 결과가 없습니다.
                      </Typography>
                    )}
                  </List>
                </Box>
              </Paper>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
