import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="pledge_head_container">
      <img
        style={{ cursor: 'pointer', height: 80 }}
        src="/images/etc/h_left_logo.png"
        alt="공약추적단 이미지"
        onClick={() => navigate('/')}
      />
      <Link to="https://www.kyeonggi.com/" target="_blank">
        <img style={{ width: 135, height: 30 }} src="/images/etc/h_right_logo.png" alt="경기일보로고" />
      </Link>
    </div>
  );
};

export default Header;
