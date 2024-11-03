import { forwardRef } from 'react';

import styles from './Field.module.scss';
import { IField } from './form-interface';
const Field = forwardRef<HTMLInputElement, IField>(
  ({ placeholder, error, style, autoComplete, title,...rest }, ref) => {
    return (
      <div className={styles.field}>
        <label>
          <div className={styles.inputInfo}>
            <span className='ml-3 text-[13px] mb-0 '>{title}</span>
            {error && <div className={styles.error}>{error.message}</div>}
          </div>
          <input
            autoComplete={autoComplete}
            ref={ref}
            placeholder={placeholder}
            {...rest}
            className={styles.input}
            style={style}

          />
        </label>
      </div>
    );
  }
);

Field.displayName = 'Field';
export default Field;
