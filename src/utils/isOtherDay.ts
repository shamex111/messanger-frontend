export const isOtherDayFn = (before: Date | null | undefined, after: Date): string => {
  // Проверяем, является ли before пустым
  if (!before) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return after.toLocaleDateString('ru-RU', options); // Возвращаем отформатированную дату after
  }

  const isDifferentDay =
    before.getDate() !== after.getDate() ||
    before.getMonth() !== after.getMonth() ||
    before.getFullYear() !== after.getFullYear();

  if (isDifferentDay) {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = after.toLocaleDateString('ru-RU', options);

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (after.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (after.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }

    return formattedDate;
  }

  return '';
};
