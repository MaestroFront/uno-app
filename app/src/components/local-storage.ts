

window.addEventListener('beforeunload', () => {
  console.log('fjfjkfjfjkfjk');
});

export const setBtnText = (el: HTMLButtonElement, name: string, defaultName: string): void => {
  if (localStorage.getItem(name)) {
    el.textContent = localStorage.getItem(name);
  } else {
    el.textContent = defaultName;
    localStorage.setItem(name, el.textContent);
  }
};



