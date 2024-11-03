import { useStores } from '../chatStoreProvider';
import { observer } from 'mobx-react-lite';
import { FC, PropsWithChildren } from 'react';

import styles from './MainLayout.module.scss';
import Sidebar from './sidebar/SideBar';

const MainLayout: FC<PropsWithChildren<unknown>> = ({ children }) => {

  console.log('Main Layout rerender');
  
  return (
    
    <div className="flex overflow-hidden">
      <div className="flex">
        <div className="">
          <Sidebar />
        </div>
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
};

export default MainLayout;
