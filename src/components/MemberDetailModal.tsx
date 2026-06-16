import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCouncilMembers } from '../hooks/useDataQuery';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import ScrollBarProvider from './ScrollBarProvider';

const MemberDetailModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const memberName = searchParams.get('member');
  const districtName = searchParams.get('district');
  const region = searchParams.get('region') as any;

  const isOpen = !!memberName && !!districtName && !!region;

  const { data: members, isLoading } = useCouncilMembers(region);

  const member = members?.find(
    (m) => m.member === memberName && m.election_district === districtName
  );

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('member');
    newParams.delete('district');
    // We might want to keep region if it's used by the main page
    // For now let's just delete the ones that trigger the modal
    setSearchParams(newParams);
  };

  if (!isOpen) return null;

  // Extract pledges
  const pledges = member
    ? Object.entries(member)
        .filter(([key]) => key.startsWith('pledge'))
        .map(([_, value]) => value)
        .filter(Boolean)
    : [];

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold">의원 상세 정보</Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : !member ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography>정보를 찾을 수 없습니다.</Typography>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                display: 'flex',
                gap: 4,
                mb: 4,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <Box
                component="img"
                alt={member.member}
                src={member.member_image || 'https://via.placeholder.com/150'}
                sx={{
                  width: 200,
                  height: 260,
                  objectFit: 'cover',
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              />
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                  {member.member} 의원
                </Typography>
                <Chip label={member.party_name} color="primary" sx={{ mb: 2 }} />

                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell variant="head" sx={{ backgroundColor: '#f5f5f5', width: '100px', fontWeight: 'bold' }}>
                          선거구
                        </TableCell>
                        <TableCell>{member.election_district}</TableCell>
                      </TableRow>
                      {member.etc && (
                        <TableRow>
                          <TableCell variant="head" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                            참고
                          </TableCell>
                          <TableCell>{member.etc}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>

            <Typography
              variant="h6"
              sx={{
                borderBottom: '2px solid #1976d2',
                pb: 1,
                mb: 2,
                fontWeight: 'bold',
              }}
            >
              핵심 공약 목록
            </Typography>

            <Box sx={{ height: 400 }}>
              <ScrollBarProvider>
                {pledges.length > 0 ? (
                  <List dense sx={{ pr: 2 }}>
                    {pledges.map((item, index) => (
                      <Box key={index}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex' }}>
                                <Typography
                                  component="span"
                                  variant="body1"
                                  fontWeight="bold"
                                  sx={{ mr: 1, minWidth: '24px' }}
                                >
                                  {index + 1}.
                                </Typography>
                                <Typography component="span" variant="body1">
                                  {item}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < pledges.length - 1 && <Divider variant="inset" component="li" sx={{ ml: 4 }} />}
                      </Box>
                    ))}
                  </List>
                ) :(
                  <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                    등록된 공약 정보가 없습니다.
                  </Box>
                )}
              </ScrollBarProvider>
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export default MemberDetailModal;
