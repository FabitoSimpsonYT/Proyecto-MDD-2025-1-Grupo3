import "@styles/profile.css";
import profilePic from "@assets/profilePic.jpg";
import profilePicAdmin from "@assets/profilePicAdmin.jpg";

const ProfileCard = ({ user }) => {
  console.log('User role:', user.role); // Para verificar el rol
  return (
    <div className="profile-card">
      <h1 className="profile-header">Perfil de {user.username}</h1>
      <div className="profile-content">
        <div className="profile-image">
          <img 
            src={user.role?.toLowerCase() === 'administrador' ? profilePicAdmin : profilePic} 
            alt={`${user.username}'s profile`} 
          />
        </div>
        <div className="profile-info">
          <p>
            <strong>Nombre:</strong> {user.username}
          </p>
          <p>
            <strong>Correo:</strong> {user.email}
          </p>
          <p>
            <strong>Rol:</strong> {user.role}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
