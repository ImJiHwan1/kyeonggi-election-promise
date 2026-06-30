import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@components/Header.tsx';
import SearchBox from '../components/SearchBox';

// Landing View Component
const LandingView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="wrapper pledge_contents">
      <Header />

      <div className="pledge_contents_container">
        <div className="top_dash">
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
          <div className="right_dash_con">
            <SearchBox />
          </div>
        </div>
        <div className="under_menu_container">
          {/* 경기도 의원공약보기 */}
          <div className="pledge_menu_box ky01">
            <img src="/images/etc/menu_01_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title f_a_j_c">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_01.png" alt="메뉴아이콘" />
              </div>
              <span>경기도 의원 공약</span>
            </div>
            <p>
              경기도의회 의원들의
              <br />
              공약을 확인하세요.
            </p>
            <button
              type="button"
              style={{ gap: 4 }}
              className="btn btn_view01 f_a_j_c"
              onClick={() => navigate('/detail?region=gyeonggi-do')}
            >
              <span>바로가기</span>
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
          </div>
          <div className="pledge_menu_box ic01">
            <img src="/images/etc/menu_02_top.png" alt="상단이미지" />
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_02.png" alt="메뉴아이콘" />
              </div>
              <span>인천광역시 의원 공약</span>
            </div>
            <p>
              인천광역시의회 의원들의
              <br />
              공약을 확인하세요.
            </p>
            <button
              type="button"
              style={{ gap: 4 }}
              className="btn btn_view01 f_a_j_c"
              onClick={() => navigate('/detail?region=incheon-si')}
            >
              <span>바로가기</span>
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
          </div>
          <div className="pledge_menu_box ky02">
            <img src="/images/etc/menu_03_top.png" alt="상단이미지" />
            {/* 타이틀 */}
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_03.png" alt="메뉴아이콘" />
              </div>
              <span>경기도 시군의원 공약</span>
            </div>
            <p>
              경기도 31개 시·군의회 의원들의
              <br />
              공약을 확인하세요.
            </p>
            <button
              type="button"
              style={{ gap: 4 }}
              className="btn btn_view01 f_a_j_c"
              onClick={() => navigate('/detail?region=gyeonggi-si')}
            >
              <span>바로가기</span>
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
          </div>
          <div className="pledge_menu_box ic02">
            <img src="/images/etc/menu_04_top.png" alt="상단이미지" />
            <div className="location_pledge_title">
              <div className="pledge_mark">
                <img src="/images/ico/menu_title_ico_03.png" alt="메뉴아이콘" />
              </div>
              <span>인천광역시 군구의원 공약</span>
            </div>
            <p>
              인천광역시 11개 군·구 의원들의
              <br />
              공약을 확인하세요.
            </p>
            <button
              type="button"
              style={{ gap: 4 }}
              className="btn btn_view01 f_a_j_c"
              onClick={() => navigate('/detail?region=incheon-gu')}
            >
              <span>바로가기</span>
              <img src="/images/ico/view_arrow.png" alt="바로가기 화살표" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MainPage: React.FC = () => {
  return <LandingView />;
};

export default MainPage;
