const UserCard = ({ userInfo }) => {
  return (
    <div className="user-card p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">

          <div>
            <p className="text-sm font-medium">{userInfo?.FullName}</p>
            <p className="text-xs text-gray-500">{userInfo?.PhoneNumber}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end gap-3 mt-5 overflow-hidden">
        <StatCard
          label="Role"
          role={userInfo?.Role}
        />
        <StatCard
          label="Organization"
          role={userInfo?.Organization}
        />
      </div>
    </div>
  );
};

export default UserCard;

const StatCard = ({ label , role }) => {


  return (
    <div
      className={`flex-1 text-[10px] font-medium text-violet-500 bg-gray-50 px-4 py-0.5 rounded`}
    >
      <span className="text-sm font-semibold">{label} </span> <br /> {role}
    </div>
  );
};
