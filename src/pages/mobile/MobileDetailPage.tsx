import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import cn from 'classnames';
import { useElectionDistricts } from '@hooks/useDataQuery.ts';
import { tabs } from '@/consts';

const MobileDetailPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region') || 'gyeonggi-do';

  const currentTab = tabs.find((t) => t.id === region) || tabs[0];

  const { data: districtsData } = useElectionDistricts(region.startsWith('gyeonggi') ? 'gyeonggi' : 'incheon');

  const cities = useMemo(() => {
    if (!districtsData) return [];
    const uniqueCities = Array.from(new Set(districtsData.map((d) => d.city_name)));
    return uniqueCities.sort();
  }, [districtsData]);

  const getMapImg = () => {
    if (region.startsWith('gyeonggi')) return '/images/etc/ky01_map.png';
    return '/images/etc/ic01_map.png';
  };

  const handleRegionTab = (newRegion: string) => {
    navigate(`/detail?region=${newRegion}`);
  };

  return (
    <div className="content_container">
      <a href="#" className="top_move_02" id="move" style={{ display: 'block' }}>
        <img src="/images/ico/top_ico.png" alt="위로가기 버튼" className="" />
      </a>
      <div className="pledge_region list_container">
        <div className="region_tab_wrap">
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn('region_tab_item', { active: region === item.id })}
              onClick={() => handleRegionTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="region_content">
          <h2 className="region_title">{currentTab.label} 공약</h2>
          <p className="region_desc">
            {currentTab.label} 의원들의 공약을
            <br />
            지역별로 확인해보세요.
          </p>

          <div className="region_map">
            <img src={getMapImg()} alt={`${currentTab.label} 지도`} />
          </div>

          <div className="region_list">
            {cities &&
              cities.map((item) => (
                <Link key={item} to={`/city/member/${item}?region=${region}`} className="region_btn">
                  {item}
                </Link>
              ))}
            <Link key="비례대표" to={`/city/member/비례대표?region=${region}`} className="region_btn">
              비례대표
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDetailPage;
