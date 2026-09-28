export default function Avatar({ user, size = 64 }) {
  const style = { width: size, height: size, fontSize: size / 2.4 };
  return user.avatar
    ? <img className="avatar" style={style} src={user.avatar} alt="" />
    : <span className="avatar" style={style}>{user.username[0].toUpperCase()}</span>;
}
