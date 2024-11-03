export const userEndFormat = (
  qty: number,
  type?: 'channel' | 'group' | undefined,
  withoutCount?:boolean
) => {
  if(withoutCount){
    if (!qty)
      return `Нет ${type ? (type === 'group' ? 'участников' : 'подписчиков') : 'участников'}`;
    if (qty % 10 === 1 && qty % 100 !== 11)
      return `${type ? (type === 'group' ? 'участник' : 'подписчик') : 'участник'}`;
    if (
      (qty % 10 === 2 || qty % 10 === 3 || qty % 10 === 4) &&
      qty % 100 !== 12 &&
      qty % 100 !== 13 &&
      qty % 100 !== 14
    )
      return `${type ? (type === 'group' ? 'участника' : 'подписчика') : 'участника'}`;
    return `${type ? (type === 'group' ? 'участников' : 'подписчиков') : 'участников'}`;
  }
  if (!qty)
    return `Нет ${type ? (type === 'group' ? 'участников' : 'подписчиков') : 'участников'}`;
  if (qty % 10 === 1 && qty % 100 !== 11)
    return ` ${qty}  ${type ? (type === 'group' ? 'участник' : 'подписчик') : 'участник'}`;
  if (
    (qty % 10 === 2 || qty % 10 === 3 || qty % 10 === 4) &&
    qty % 100 !== 12 &&
    qty % 100 !== 13 &&
    qty % 100 !== 14
  )
    return `${qty}  ${type ? (type === 'group' ? 'участника' : 'подписчика') : 'участника'}`;
  return `${qty} ${type ? (type === 'group' ? 'участников' : 'подписчиков') : 'участников'}`;
};
