import moment from "moment";

const RecordsTable = ({ tableData }) => {
  
  return (
    <div className="overflow-x-auto p-0 rounded-lg mt-3">
      <table className="min-w-full">
        <thead>
          <tr className="text-left">
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              Full Name
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              Wilaya
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px]">
              City
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Birth Date
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Date of death
            </th>
            <th className="py-3 px-4 text-gray-800 font-medium text-[13px] hidden md:table-cell">
              Gender
            </th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((user) => (
            <tr key={user._id} className="border-t border-gray-200">
              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {user.LatinFullName}
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block "bg-gray-100 text-gray-500 border border-gray-200"`}
                >
                  {user.Wilaya}
                </span>
              </td>
              <td className="p-4">
                <span
                  className={`px-2 py-1 text-xs rounded inline-block "bg-gray-100 text-gray-500 border border-gray-200"`}
                >
                  {user.City}
                </span>
              </td>
              <td className="p-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {user.BirthDate
                  ? moment(user.BirthDate).format("Do MMM YYYY")
                  : "N/A"}
              </td>

              <td className="p-4 text-gray-700 text-[13px] text-nowrap hidden md:table-cell">
                {user.DateOfDeath
                  ? moment(user.DateOfDeath).format("Do MMM YYYY")
                  : "Alive"}
              </td>

              <td className="my-3 mx-4 text-gray-700 text-[13px] line-clamp-1 overflow-hidden">
                {user.Gender}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecordsTable;
