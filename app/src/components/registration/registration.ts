
import { createElement, createButton, createInput, createParagraph } from '../helpers/helpers';
import Router from '../router';
import Controller from '../../controller';

export const createRegistrationContainer = () => {
  const header = document.querySelector('.header') as HTMLDivElement;
  const container = createElement('div', 'registration-container') as HTMLDivElement;
  if (document.cookie.includes('user=')) {
    const div = createElement('div','user-logged');
    const p = document.createElement('p');
    p.innerText = `LOGIN AS ${document.cookie.split(';').filter(value => {return value.includes('user=');})[0].replace('user=', '')}`;
    const button = createButton('button', 'button', 'sign out');
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
    const registrationBtn = createButton('btn-reg', 'button', 'registration');
    const loginBtn = createButton('btn-log', 'button', 'login');
    container.append(registrationBtn, loginBtn);
  }

  header.prepend(container);
};

export const createRegOrLogWindow = (method: string) => {
  const main = document.querySelector('.main') as HTMLDivElement;
  const form = createElement('form', `${method}-window`) as HTMLDivElement;
  const nameBlock = createElement('div', `${method}-name-block`) as HTMLDivElement;
  const passwordBlock = createElement('div', `${method}-password-block`) as HTMLDivElement;

  const nameTitle = createParagraph(`${method}-name-title`, 'Edit your nickname');
  const inputName = createInput(`input-${method}-name`, 'text', '[5 - 10 letters]');
  inputName.pattern = '[A-Za-z]{5,10}';
  inputName.maxLength = 10;
  inputName.oninput = () => inputName.value = inputName.value.replace(/[^а-яa-zА-ЯA-Z]/g, '');

  const passwordTitle = createParagraph(`${method}-password-title`, 'Edit your password');
  const inputPassword = createInput(`input-${method}-password`, 'password', '[5 numbers]');
  inputPassword.pattern = '[0-9]{5}';
  inputPassword.maxLength = 5;
  inputPassword.oninput = () => inputPassword.value = inputPassword.value.replace(/[^0-9]/g, '');

  const cross = createButton('btn-cross', 'button', 'x');
  const submit = createButton(`btn-submit-${method}`, 'submit', `${method}`);
  if (method === 'reg') {
    submit.addEventListener('click', async (ev) => {
      ev.preventDefault();
      const name = (document.querySelector('.input-reg-name') as HTMLInputElement).value;
      const pass = (document.querySelector('.input-reg-password') as HTMLInputElement).value;
      const mail = (document.querySelector('.input-mail') as HTMLInputElement).value;
      const data = { userName: name, password: pass, email: mail } as { userName: string, password: string, email: string };
      const fetchOptions = {
        method: 'post',
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
            const cookie = document.cookie.split(';').filter(value => {return value.includes('user=');});
            Controller.webSocket.send(JSON.stringify({ action: 'UPDATE_NAME', data: cookie[0].replace('user=', '') }));
            Router.setState('home');
            Router.checkPage();
            // eslint-disable-next-line no-alert
            alert(`You signed in as ${cookie[0].replace('user=', '')}`);
          } else {
            // eslint-disable-next-line no-alert
            alert('Wrong name or password');
          }
        }).catch();
    });
  }

  nameBlock.append(nameTitle, inputName);
  passwordBlock.append(passwordTitle, inputPassword);
  form.append(nameBlock, passwordBlock, cross, submit);
  const mailBlock = createElement('div', 'mail-block') as HTMLDivElement;
  if (method === 'reg') {
    const mailTitle = createParagraph('mail-title', 'Edit your Email');
    const mail = createInput('input-mail', 'mail', 'ivanovivan@mail.ru') as HTMLDivElement;
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
    createRegOrLogWindow('reg');
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
    createRegOrLogWindow('log');
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
