import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Portal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import { useCouncilMembers } from '../hooks/useDataQuery';
import ScrollBarProvider from './ScrollBarProvider';

const MemberDetailModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const memberName = searchParams.get('member');
  const districtName = searchParams.get('district');
  const region = searchParams.get('region') as any;
  const electionArea = searchParams.get('electionArea');

  const isOpen = !!memberName && !!districtName && !!region;

  const { data: members, isLoading } = useCouncilMembers(region);

  const member = members?.find((m) => m.member === memberName && m.election_district === districtName);

  const handleClose = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('member');
    newParams.delete('district');
    newParams.delete('electionArea');
    // We might want to keep region if it's used by the main page
    // For now let's just delete the ones that trigger the modal
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Extract pledges
  const pledges = member
    ? Object.entries(member)
        .filter(([key]) => key.startsWith('pledge'))
        .map(([_, value]) => value)
        .filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <Portal>
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
              p: 2,
            }}
          >
            <Box
              component={motion.div}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                maxWidth: 'md',
                width: '100%',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                boxShadow: 24,
              }}
            >
              <Box
                sx={{
                  p: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="h6" fontWeight="bold">
                  의원 상세 정보
                </Typography>
                <IconButton onClick={handleClose}>
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>

              <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
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
                        src={member.member_image || '/images/etc/no_img_vertical.png'}
                        sx={{
                          width: 200,
                          height: 260,
                          objectFit: 'cover',
                          borderRadius: 2,
                          boxShadow: 2,
                        }}
                      />
                      <Box sx={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                          <Chip
                            label={member.party_name}
                            color={member.party_name === '더불어민주당' ? 'info' : 'error'}
                            sx={{ fontSize: 16 }}
                          />
                          <span style={{ fontSize: 24, fontWeight: 'bold' }}>{member.member} 의원</span>
                        </div>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableBody>
                              <TableRow>
                                <TableCell variant="head" sx={{ backgroundColor: '#f5f5f5', width: '100px', fontWeight: 'bold' }}>
                                  선거구
                                </TableCell>
                                <TableCell>{member.election_district}</TableCell>
                              </TableRow>
                              {electionArea && (
                                <TableRow>
                                  <TableCell variant="head" sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                                    포함 지역
                                  </TableCell>
                                  <TableCell>{electionArea}</TableCell>
                                </TableRow>
                              )}
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
                                        <Typography component="span" variant="body1" fontWeight="bold" sx={{ mr: 1, minWidth: '24px' }}>
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
                        ) : (
                          <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>등록된 공약 정보가 없습니다.</Box>
                        )}
                      </ScrollBarProvider>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default MemberDetailModal;
