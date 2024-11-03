'use client';

import { TSearchType } from '../../search-side-bar/SearchSideBar';
import { useSearchBarQuery } from '../../search-side-bar/useSearchBarMutation';
import { FC, useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { CgClose } from 'react-icons/cg';
import { IoIosSearch } from 'react-icons/io';

import { useStores } from '@/components/ui/chatStoreProvider';

interface ISearch {
  setIsSearch: (isSearch: boolean) => void;
  searchType: TSearchType;
  setData: (data: any) => void;
}

const Search: FC<ISearch> = ({ setIsSearch, searchType, setData }) => {
  const [value, setValue] = useState('');
  const { data, isLoading, error, refetch } = useSearchBarQuery(
    searchType,
    value
  );
  const { userStore } = useStores();
  if (error) toast.error(error.message);
  useEffect(() => {
    if (value) {
      refetch();
    }
  }, [value, refetch, searchType]);

  useEffect(() => {
    if (!isLoading && data) {
      if (searchType === 'Пользователи') {
        setData(data.filter((i: any) => i.id !== userStore.user?.id))
        return
      }
      setData(data);
    }
  }, [data, isLoading, setData]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | string) => {
      const newValue = typeof e === 'string' ? e : e.target.value;
      setValue(newValue);
      setIsSearch(newValue !== '');
    },
    []
  );

  return (
    <div className="w-full flex justify-center">
      <div className="xl:w-[270px] lg:w-[220px] w-[200px] h-[44px] my-auto bg-secondary rounded-[30px] pl-3 flex">
        <IoIosSearch className="my-auto w-[22px] h-[22px] mr-2 text-gray" />
        <input
          placeholder="Поиск"
          type="text"
          className="outline-none my-auto lg:w-[145px] xl:w-[190px] w-[110px] border-none bg-transparent"
          onChange={handleChange}
          value={value}
        />
        {value ? (
          <CgClose
            className="my-auto text-[23px]  text-gray cursor-pointer"
            onClick={() => handleChange('')}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Search;
