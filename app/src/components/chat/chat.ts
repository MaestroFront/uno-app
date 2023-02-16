import { createButton, createElement, createImage } from '../helpers/helpers';
import { chatSound } from '../sounds';
import Controller from '../../controller';

const openChat = () => {
  (document.querySelector('.chat') as HTMLDivElement).classList.add('open');
  void chatSound.play();
};

export const renderChat = () => {
  const chat = createElement('div', 'chat') as HTMLDivElement;
  const header = createElement('div', 'chat-header');
  const headerBtn = createButton('btn-cross', 'button', 'x');
  headerBtn.classList.add('chat-close-btn');
  header.textContent = 'Chat';
  const chatWindow = createElement('div', 'chat-window');
  const messageList = createElement('ul', 'message-list');
  const chatInput = createElement('div', 'chat-input');
  const messageInput = createElement('input', 'message-input') as HTMLInputElement;
  messageInput.type = 'text';
  const button = createButton('chat-send-btn', 'button', 'Send');
  button.addEventListener('click', () => {
    Controller.webSocket.send(JSON.stringify(
      { action: 'CHAT_MESSAGE',
        data: (document.querySelector('.message-input') as HTMLInputElement).value }));
    (document.querySelector('.message-input') as HTMLInputElement).value = '';
  });

  chatInput.append(messageInput, button);
  chatWindow.append(messageList);
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
  return chatBtn;
};
