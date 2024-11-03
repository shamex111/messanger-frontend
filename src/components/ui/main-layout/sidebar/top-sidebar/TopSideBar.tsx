import { FC, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineModeEdit } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";

import styles from "./TopSideBar.module.scss";
import Search from "./search/Search";
import { TSearchType } from "../search-side-bar/SearchSideBar";

interface ITopSideBar {
  setIsSettings: any;
  isSettings: boolean;
  isEdit: boolean;
  setIsEdit: any;
  setIsSearch: any;
  searchType: TSearchType;
  setData: any;
}

const TopSideBar: FC<ITopSideBar> = ({
  setIsSettings,
  isSettings,
  isEdit,
  setIsEdit,
  setIsSearch,
  searchType,
  setData,
}) => {
  const [isRotated, setIsRotated] = useState(false);
  const handleClickMenu = () => {
    setIsSettings(!isSettings);
    setIsRotated(!isRotated);
  };
  const handleClickEdit = () => {
    setIsEdit(!isEdit);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.burgerMenu}>
        {isEdit ? (
          <IoArrowBack
            className="text-[#666666] text-2xl cursor-pointer"
            onClick={() => handleClickEdit()}
          />
        ) : (
          <RxHamburgerMenu
            className={
              isRotated
                ? "rotate-90 duration-300 text-3xl  text-[#666666] cursor-pointer"
                : "text-[#666666] duration-300 text-3xl cursor-pointer"
            }
            onClick={() => handleClickMenu()}
          />
        )}
      </div>
      {isSettings && !isEdit ? (
        <div className={styles.topSideBarSettings}>
          <h2>Настройки</h2>
          <div>
            <MdOutlineModeEdit
              className="text-[#666666] text-2xl text-[27px] cursor-pointer"
              onClick={() => handleClickEdit()}
            />
          </div>
        </div>
      ) : isEdit ? (
        <div className={styles.topSideBarEdit}>
          <h2>Изменить профиль</h2>
        </div>
      ) : (
        <Search
          setData={setData}
          setIsSearch={setIsSearch}
          searchType={searchType}
        />
      )}
    </div>
  );
};

export default TopSideBar;
