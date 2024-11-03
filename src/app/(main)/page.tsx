import { LuMessagesSquare } from 'react-icons/lu';

export default function Home() {
  return (
    <div
      className="flex flex-col w-[600px] lg:h-[400px] xl:h-[600px]   mx-auto lg:mt-36  xl:my-48 select-none "
      style={{
        maxHeight: '100vh'
      }}
    >
      <LuMessagesSquare className="xl:size-96 lg:size-48 size-20 mx-auto text-gray opacity-35 " />
      <div className="mx-auto font-medium text-gray opacity-65 mb-[20px]">
        Здесь пока ничего нет....
      </div>
      <div className="w-fit h-fit mx-auto rounded-md text-sm mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 ">
        Выберите, кому хотели бы написать
      </div>
    </div>
  );
}
