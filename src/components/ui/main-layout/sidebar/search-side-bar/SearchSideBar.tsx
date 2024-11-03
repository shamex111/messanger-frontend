'use client';

import clsx from 'clsx';
import { FC } from 'react';

import SearchSideBarItem from './searchSideBarItem/SearchSideBarItem';

interface ISearchSideBar {
  setSearchType: any;
  searchType: TSearchType;
  data: any;
  setIsSearch: any;
}

export type TSearchType = 'Пользователи' | 'Группы' | 'Каналы';
const SearchSideBar: FC<ISearchSideBar> = ({
  searchType,
  setSearchType,
  data,
  setIsSearch
}) => {
  return (
    <div>
      <div className="flex justify-between w-full lg:text-xs pt-3 text-gray text-xs  xl:text-sm font-medium border-b-border border-b-[2px] select-none">
        <div
          className={clsx(
            'w-[33.33%] cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Пользователи' &&
              'text-accent border-b-2 border-b-accent'
          )}
          onClick={() => setSearchType('Пользователи')}
        >
          <p className="mx-auto w-fit">Пользователи</p>
        </div>
        <div
          className={clsx(
            'w-[33.33%] cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Группы' && 'text-accent border-b-2 border-b-accent'
          )}
          onClick={() => setSearchType('Группы')}
        >
          <p className="mx-auto w-fit">Группы</p>
        </div>
        <div
          className={clsx(
            'w-[33.33%] cursor-pointer pb-2 pt-3 hover:bg-gray hover:bg-opacity-10 rounded-t-md',
            searchType === 'Каналы' && 'text-accent border-b-2 border-b-accent'
          )}
          onClick={() => setSearchType('Каналы')}
        >
          <p className="mx-auto w-fit">Каналы</p>
        </div>
      </div>
      <div
        className="flex flex-col gap-[7px] pt-[20px] overflow-y-auto "
        style={{
          height: 'calc(100vh - 127px)'
        }}
      >
        {data.length ? (
          data.map((i: any) => (
            <SearchSideBarItem
              smthId={i.id}
              name={i.name}
              avatar={i.avatar}
              lastOnline={
                i?.lastOnline ? (i.isOnline ? 'В сети' : i?.lastOnline) : null
              }
              key={i.id}
              qtyUsers={i?.qtyUsers ? i?.qtyUsers : null}
              type={searchType}
              setIsSearch={setIsSearch}
            />
          ))
        ) : (
          <div className="mx-auto mt-[2%] mb-2 px-2 py-1 bg-slate-700 bg-opacity-45 text-white font-medium text-sm rounded-md w-fit">
            Ничего не найдено
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchSideBar;
