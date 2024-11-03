import { FC } from "react";

const notFound: FC = () => {
  return (
    <div className="w-full h-full border-t-2 border-t-red-700">
      <div className="m-auto w-fit h-fit mx-auto  mt-[20%]  mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md">
        Страница не найдена
      </div>
      <div className="m-auto w-fit h-fit  text-white mb-2 px-2 py-1 bg-red-800 bg-opacity-75  font-medium text-sm rounded-md">
        404
      </div>
    </div>
  );
};

export default notFound;
