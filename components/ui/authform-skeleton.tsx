import { ImSpinner9 } from "react-icons/im";

const authformSkeleton = () => {
  return (
    <div>
      <div className="h-[500px] w-96 border-[#ffffff22] bg-slate-950 border-2  rounded-[0.75rem] flex justify-center items-center">
        <ImSpinner9 className="size-15 animate-spin text-gray-500" />
      </div>
    </div>
  );
};

export default authformSkeleton;
