import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAllMembers, useElectionDistricts } from '../hooks/useDataQuery';
import { useRecentSearches } from '../hooks/useRecentSearches';

interface SearchBoxProps {
  initialValue?: string;
  region?: string;
  type?: 'mobile' | undefined;
}

const SearchBox: React.FC<SearchBoxProps> = ({ initialValue = '', region = 'gyeonggi-do', type }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: allMembers } = useAllMembers();
  // We might want to show which district corresponds to which administrative area
  const { data: gyeonggiDistricts } = useElectionDistricts('gyeonggi');
  const { data: incheonDistricts } = useElectionDistricts('incheon');

  const { recentSearches, addSearch, removeSearch, clearAll } = useRecentSearches();

  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  const districts = [...(gyeonggiDistricts || []), ...(incheonDistricts || [])];
  const districtAreaMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    districts.forEach((d) => {
      map[d.election_district.replace(/\s/g, '')] = d.election_area;
    });
    return map;
  }, [districts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (term: string) => {
    if (term.trim()) {
      addSearch(term.trim());
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      setIsDropdownOpen(false);
    }
  };

  const filteredResults = React.useMemo(() => {
    if (!searchValue.trim() || !allMembers) return [];
    const searchLower = searchValue.toLowerCase().replace(/\s/g, '');
    return allMembers
      .filter(
        (m) =>
          m.member.toLowerCase().replace(/\s/g, '').includes(searchLower) ||
          m.election_district.toLowerCase().replace(/\s/g, '').includes(searchLower),
      )
      .slice(0, 10);
  }, [searchValue, allMembers]);

  return (
    <div
      className={`dash_input_box ${isDropdownOpen ? 'active' : ''}`}
      ref={dropdownRef}
      style={type === 'mobile' ? { margin: 0, width: '100%' } : {}}
    >
      <img
        src="/images/ico/search_ico.png"
        alt="검색아이콘"
        style={type === 'mobile' ? { position: 'absolute', left: 'auto', right: 10, top: 6 } : {}}
        onClick={() => handleSearch(searchValue)}
      />
      <input
        type="text"
        className="form-control right_input"
        placeholder="의원 이름과 지역을 검색해 보세요."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onFocus={() => setIsDropdownOpen(true)}
        // onBlur={() => setIsDropdownOpen(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(searchValue);
          }
        }}
      />
      {!type && (
        <button type="button" className="btn_dash_search" onClick={() => handleSearch(searchValue)}>
          검색
        </button>
      )}

      {/* 검색 드롭다운 */}
      {isDropdownOpen && (
        <div className="search_dropdown" style={{ display: 'block' }}>
          {recentSearches.length > 0 && !searchValue && (
            <div className="recent_search">
              <div className="dropdown_head">
                <strong>최근 검색어</strong>
                <button type="button" onClick={clearAll}>
                  전체 삭제
                </button>
              </div>

              <div className="keyword_list">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    type="button"
                    className="keyword_tag"
                    onClick={() => {
                      setSearchValue(term);
                      handleSearch(term);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {term}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSearch(term);
                      }}
                    >
                      ✕
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {searchValue && (
            <div className="search_result">
              <div className="result_title">검색 결과</div>
              {filteredResults.length > 0 ? (
                filteredResults.map((member, idx) => {
                  const area = districtAreaMap[member.election_district.replace(/\s/g, '')];
                  return (
                    <div
                      key={`${member.member}-${member.election_district}-${idx}`}
                      className="result_item"
                      onClick={() => {
                        if (type === 'mobile') {
                          console.log('mobile');
                          navigate(`/member/${member.member}/pledges?region=${(member as any).categoryId || ''}`);
                        } else {
                          const params = new URLSearchParams();
                          params.set('member', member.member);
                          params.set('district', member.election_district);
                          params.set('region', (member as any).categoryId || region);
                          navigate(`/detail?${params.toString()}`);
                        }
                        addSearch(member.member);
                        setIsDropdownOpen(false);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="result_info">
                        <strong>
                          {member.election_district}
                          <br />
                          {area && <span>({area})</span>}
                        </strong>
                        <em>{member.member} 의원</em>
                      </div>
                      <span className="arrow">›</span>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '15px', textAlign: 'center', color: '#888' }}>검색 결과가 없습니다.</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
