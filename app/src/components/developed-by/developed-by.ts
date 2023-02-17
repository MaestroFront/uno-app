import { langData } from '../data';
import { createElement, createParagraph, createImage, createButton, createLink, hideDevelopedByBlock } from '../helpers/helpers';

const createFooterLinksContainer = (lang: string) => {
  const container = createElement('div', 'links-container');
  const linkKirill = createLink('kirill-link', 'https://github.com/kirilldemyanenko', langData[lang]['dev-kir']);
  const ghKirill = createImage('kirill', '../assets/img/github-logo.svg', 'kirill');
  linkKirill.append(ghKirill);
  const linkAnneli = createLink('kirill-link', 'https://github.com/Anneli-sf', langData[lang]['dev-an']);
  const ghAnneli = createImage('anneli', '../assets/img/github-logo.svg', 'anneli');
  linkAnneli.append(ghAnneli);
  const linkAlex = createLink('kirill-link', 'https://github.com/MaestroFront', langData[lang]['dev-al']);
  const ghAlex = createImage('alex', '../assets/img/github-logo.svg', 'alex');
  linkAlex.append(ghAlex);
  container.append(linkKirill, linkAnneli, linkAlex);
  return container;
};

export const createDevelopedByContainer = (lang: string) => {
  const container = createElement('div', 'developed-by');
  const hide = createElement('div', 'opacity');
  const title = createParagraph('developed-title', langData[lang]['dev-by']);
  const logo = createImage('team-logo', '../assets/img/team.png', 'team-logo');
  const version = createElement('span', langData[lang]['dev-version']);
  version.textContent = 'ver 1.01';
  const cross = createButton('btn-cross', 'button', 'х');

  container.append(title, logo, createFooterLinksContainer(lang), version, cross);
  hide.append(container);
  return hide;
};

document.addEventListener('click', (e) => {
  const element = e.target as HTMLButtonElement;
  if (element.closest('.developed-by .btn-cross')) hideDevelopedByBlock();
});
