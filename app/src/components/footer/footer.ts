import { createButton } from '../helpers/helpers';

export const createFooter = () => {
  const footer = document.querySelector('.footer') as HTMLDivElement;
  const btnDevelopedBy = createButton(
    'btn-developed',
    'button',
    'developed by',
  );
  const btnShare = createButton('btn-share', 'button', 'share');
  btnShare.onclick = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Игра UNO',
          text: 'Тебе давно уже пора заняться чем-то по истинне крутым.',
          url: window.location.href,
        })
        .then(() => console.log('Удалось поделиться'))
        .catch((error) => console.log('Не удалось поделиться', error));
    }
  };
  footer.append(btnDevelopedBy, btnShare);
};
