
export const setBtnText = (el: HTMLButtonElement, name: string, defaultName: string): void => {
  if (localStorage.getItem(name)) {
    el.textContent = localStorage.getItem(name);
  } else {
    el.textContent = defaultName;
    localStorage.setItem(name, el.textContent);
  }
};

export const language = {
  chosen: 'en',
};

window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('language')) {
    language.chosen = localStorage.getItem('language') as string;
  } else language.chosen = 'en';
  
  console.log(language.chosen);
});