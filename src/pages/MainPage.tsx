import { useNavigate } from 'react-router-dom';
import SearchBox from '../components/SearchBox';

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
            <SearchBox />
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
            <button type="button" className="btn btn_view01" onClick={() => navigate('/detail?region=gyeonggi-do')}>
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
            <button type="button" className="btn btn_view01" onClick={() => navigate('/detail?region=incheon-si')}>
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
            <button type="button" className="btn btn_view01" onClick={() => navigate('/detail?region=gyeonggi-si')}>
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
            <button type="button" className="btn btn_view01" onClick={() => navigate('/detail?region=incheon-gu')}>
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

const MainPage: React.FC = () => {
  return <LandingView />;
};

export default MainPage;
