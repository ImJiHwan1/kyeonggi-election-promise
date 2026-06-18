import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import SearchBox from '@components/SearchBox.tsx';
import '@styles/layout.css';
import { tabs } from '@/consts';

const MobileMainPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const region = searchParams.get('region') || 'gyeonggi-do';

  return (
    <div className="content_container">
      {/* 검색인풋 */}
      <div className="search-bar" id="m_search_box_02" style={{ display: 'none' }}>
        <form action="">
          <input type="search" className="input-stand-01" placeholder="검색어를 입력하세요" />
        </form>
      </div>
      {/* //검색인풋 */}

      <div className="top_title_back pledges_tit">
        <p className="sub-title">제9회 전국동시지방선거 당선자</p>
        <h1>우리동네 의원 공약은?</h1>
      </div>

      <div className="pledges_wrap">
        <div className="search-box">
          <SearchBox initialValue="" region={region} type="mobile" />
        </div>
        <div className="pledge-list">
          {tabs.map((item) => (
            <Link key={item.id} to={`/detail?region=${item.id}`} className="pledge-item">
              <div className="icon">🏛</div>
              <div className="txt">
                <strong>{item.label} 공약</strong>
                <span>바로가기 &gt;</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MobileMainPage;
