
import { createElement, createButton, createInput, createParagraph } from '../helpers/helpers';
import Router from '../router';
import Controller from '../../controller';
import { langData } from '../data';
import { language } from '../local-storage';

export const createRegistrationContainer = (lang: string) => {
  const header = document.querySelector('.header') as HTMLDivElement;
  const container = createElement('div', 'registration-container') as HTMLDivElement;
  if (document.cookie.includes('user=')) {
    const div = createElement('div', 'user-logged');
    const p = document.createElement('p');
    p.innerText = `LOGIN AS ${document.cookie.split(';').filter(value => {return value.includes('user=');})[0].replace('user=', '')}`;
    const button = createButton('button', 'button', langData[lang]['btn-sign-out']);
    button.addEventListener('click', () => {
      document.cookie = document.cookie.split(';').map(value => {
        return value.includes('user=')
          ? value.concat(';max-age=-1;')
          : value;
      }).join('');
      Router.setState('home');
      Router.checkPage();
    });
    div.append(p, button);
    container.append(div);

  } else {
    const registrationBtn = createButton('btn-reg', 'button', langData[lang]['btn-registr']);
    const loginBtn = createButton('btn-log', 'button', langData[lang]['btn-login']);
    container.append(registrationBtn, loginBtn);
  }

  header.prepend(container);
};

export const createRegOrLogWindow = (method: string, lang: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const form = createElement('form', `${method}-window`) as HTMLDivElement;
  const nameBlock = createElement('div', `${method}-name-block`) as HTMLDivElement;
  const passwordBlock = createElement('div', `${method}-password-block`) as HTMLDivElement;

  const nameTitle = createParagraph(`${method}-name-title`, langData[lang]['reg-nickname']);
  const inputName = createInput(`input-${method}-name`, 'text', langData[lang]['reg-nickname-title']);
  inputName.pattern = '[A-Za-z]{5,10}';
  inputName.maxLength = 10;
  inputName.oninput = () => inputName.value = inputName.value.replace(/[^а-яa-zА-ЯA-Z]/g, '');

  const passwordTitle = createParagraph(`${method}-password-title`, langData[lang]['reg-pass']);
  const inputPassword = createInput(`input-${method}-password`, 'password', langData[lang]['reg-pass-title']);
  inputPassword.pattern = '[0-9]{5}';
  inputPassword.maxLength = 5;
  inputPassword.oninput = () => inputPassword.value = inputPassword.value.replace(/[^0-9]/g, '');

  const cross = createButton('btn-cross', 'button', 'x');
  const submit = createButton(`btn-submit-${method}`, 'submit', `${method}`);
  submit.textContent = langData[lang]['reg-btn'];
  /* server run on deploy */
  if (!Controller.webSocket.url.includes('localhost')) {
    if (method === 'reg') {
      submit.addEventListener('click', (ev) => {
        ev.preventDefault();
        const name = (document.querySelector('.input-reg-name') as HTMLInputElement).value;
        const pass = (document.querySelector('.input-reg-password') as HTMLInputElement).value;
        const mail = (document.querySelector('.input-mail') as HTMLInputElement).value;
        const data = { userName: name, password: pass, email: mail } as { userName: string, password: string, email: string };
        Controller.webSocket.send(JSON.stringify({ action: 'REGISTRATION', data: JSON.stringify(data) }));
      });
    } else {
      submit.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const name = (document.querySelector('.input-log-name') as HTMLInputElement).value;
        const pass = (document.querySelector('.input-log-password') as HTMLInputElement).value;
        const data = { userName: name, password: pass } as { userName: string, password: string };
        Controller.webSocket.send(JSON.stringify({ action: 'LOGIN', data: JSON.stringify(data) }));
      });
    }
  /* server run local */
  } else {
    if (method === 'reg') {
      submit.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const name = (document.querySelector('.input-reg-name') as HTMLInputElement).value;
        const pass = (document.querySelector('.input-reg-password') as HTMLInputElement).value;
        const mail = (document.querySelector('.input-mail') as HTMLInputElement).value;
        const data = { userName: name, password: pass, email: mail } as { userName: string, password: string, email: string };
        const fetchOptions = {
          method: 'post',
          //mode: 'no-cors' as RequestMode,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        await fetch('http://localhost:9002/registration', fetchOptions)
          .then(res=>res.json() as Promise<{ status: boolean }>)
          .then(obj => {
            if (obj.status) {
              // eslint-disable-next-line no-alert
              alert('registered!');
              Router.setState('home');
              Router.checkPage();
            } else {
              // eslint-disable-next-line no-alert
              alert('user with this nickname already exist!');
            }
          }).catch();
      });
    } else {
      submit.addEventListener('click', async (ev) => {
        ev.preventDefault();
        const name = (document.querySelector('.input-log-name') as HTMLInputElement).value;
        const pass = (document.querySelector('.input-log-password') as HTMLInputElement).value;
        const data = { userName: name, password: pass } as { userName: string, password: string };
        const fetchOptions = {
          method: 'post',
          //mode: 'no-cors' as RequestMode,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        };
        await fetch('http://localhost:9002/login', fetchOptions)
          .then(res => res.json() as Promise<{ status: boolean, data: string }>)
          .then(obj => {
            if (obj?.status) {
              document.cookie = obj.data;
              Controller.signAs();
            } else {
              // eslint-disable-next-line no-alert
              alert('Wrong name or password');
            }
          }).catch();
      });
    }
  }


  nameBlock.append(nameTitle, inputName);
  passwordBlock.append(passwordTitle, inputPassword);
  form.append(nameBlock, passwordBlock, cross, submit);
  const mailBlock = createElement('div', 'mail-block') as HTMLDivElement;
  if (method === 'reg') {
    const mailTitle = createParagraph('mail-title', langData[lang]['reg-email']);
    const mail = createInput('input-mail', 'mail', langData[lang]['reg-email-title']) as HTMLDivElement;
    mailBlock.append(mailTitle, mail);
    form.append(mailBlock);
  }

  main.append(form);
};

document.addEventListener('click', (e) => {
  const element = e.target as HTMLButtonElement;

  if (element.closest('.btn-reg')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.add(
      'show',
    );
    createRegOrLogWindow('reg', (language as { chosen: string }).chosen);
  }
  if (element.closest('.reg-window .btn-cross')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    document.querySelector('.reg-window')?.remove();
  }
  if (element.closest('.btn-log')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.add(
      'show',
    );
    createRegOrLogWindow('log', (language as { chosen: string }).chosen );
  }
  if (element.closest('.log-window .btn-cross')) {
    (document.querySelector('.opacity') as HTMLDivElement).classList.remove(
      'show',
    );
    document.querySelector('.log-window')?.remove();
  }
});

export const removeRegistrationContainer = () => {
  const container  = document.querySelector('.registration-container') as HTMLDivElement;
  container.remove();
};
