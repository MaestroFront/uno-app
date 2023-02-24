// import { showReverseAnimation } from '../animated-items/animated-items';
import { createButton, createElement, createImage } from '../helpers/helpers';
import { chatSound } from '../sounds';
import Controller from '../../controller';

const openChat = () => {
  (document.querySelector('.chat') as HTMLDivElement).classList.add('open');
  void chatSound.play();
};

const scrollChat = () => {
  const element = document.querySelector('.scroll-container') as HTMLDivElement;
  if (!element) return ; 
  
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
  });
  console.log(element);
};

export const renderChat = () => {
  const chat = createElement('div', 'chat') as HTMLDivElement;
  const header = createElement('div', 'chat-header');
  const headerBtn = createButton('btn-cross', 'button', 'x');
  headerBtn.classList.add('chat-close-btn');
  header.textContent = 'Chat';

  const chatWindow = createElement('div', 'chat-window');
  const messageList = createElement('ul', 'message-list');
  const bottomScrollContainer = createElement('div', 'scroll-container');
  const chatInput = createElement('div', 'chat-input');
  const messageInput = createElement('input', 'message-input') as HTMLInputElement;
  messageInput.type = 'text';
  messageInput.maxLength = 25;

  const button = createButton('btn-send', 'button', 'Send');

  button.addEventListener('click', () => {
    // const block = document.querySelector('.chat-window') as HTMLDivElement;
    // block.scrollTop = block.clientHeight;
    Controller.webSocket.send(JSON.stringify(
      { action: 'CHAT_MESSAGE',
        data: (document.querySelector('.message-input') as HTMLInputElement).value }));
    (document.querySelector('.message-input') as HTMLInputElement).value = '';
    scrollChat();
  });

  messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' && (document.querySelector('.message-input') as HTMLInputElement).value.length > 0) {
      button.click();
    }
  });

  chatInput.append(messageInput, button);
  chatWindow.append(messageList, bottomScrollContainer);
  header.append(headerBtn);
  chat.append(header, chatWindow, chatInput );

  headerBtn.addEventListener('click', () => {
    chat.classList.remove('open');
  });
  return chat;
};

export const renderChatButton = (): HTMLButtonElement => {
  const chatBtn = createButton('chat-btn', 'button', '');
  const chatLogo = createImage('chat-logo', '../../assets/img/chat.png', 'chat-logo');
  chatBtn.append(chatLogo);

  chatBtn.addEventListener('click', openChat);
  // chatBtn.addEventListener('click', showRandomColor);
  // chatBtn.addEventListener('click', () => {
  //   showReverseAnimation(false);
  // });

  return chatBtn;
};
