'use client';

import { FC, useState } from 'react';
import { useDispatch } from 'react-redux';

import styles from './SideBar.module.scss';
import SearchSideBar, { TSearchType } from './search-side-bar/SearchSideBar';
import Chats from './search-side-bar/chats/Chats';
import { useChatsData } from './search-side-bar/chats/useChatsItemQuery';
import Settings from './settings/Settings';
import TopSideBar from './top-sidebar/TopSideBar';

const SideBar: FC = () => {
  const [isSettings, setIsSettings] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSearch, setIsSearch] = useState(false);
  const [searchType, setSearchType] = useState<TSearchType>('Пользователи');

  const [data, setData] = useState([]);
  console.log('sidebar render')
  return (
    <div className={styles.sideBarWrapper}>
      <TopSideBar
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        isSettings={isSettings}
        setIsSettings={setIsSettings}
        setIsSearch={setIsSearch}
        searchType={searchType}
        setData={setData}
      />

      {isSettings ? (
        <div className={styles.settings}>
          <Settings isEdit={isEdit} setIsEdit={setIsEdit} />
        </div>
      ) : isSearch ? (
        <SearchSideBar
          data={data}
          setIsSearch={setIsSearch}
          searchType={searchType}
          setSearchType={setSearchType}
        />
      ) : (
        <div className={styles.chats}>
          <Chats />
        </div>
      )}
    </div>
  );
};

export default SideBar;
