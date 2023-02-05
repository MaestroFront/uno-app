import { createElement, createParagraph, createImage, createButton, createLink } from '../helpers/helpers';

const createFooterLinksContainer = () => {
  const container = createElement('div', 'links-container');
  const linkKirill = createLink('kirill-link', 'https://github.com/kirilldemyanenko', 'Team Lead Kirill');
  const ghKirill = createImage('kirill', '../assets/img/github-logo.svg', 'kirill');
  linkKirill.append(ghKirill);
  const linkAnneli = createLink('kirill-link', 'https://github.com/Anneli-sf', 'Anneli');
  const ghAnneli = createImage('anneli', '../assets/img/github-logo.svg', 'anneli');
  linkAnneli.append(ghAnneli);
  const linkAlex = createLink('kirill-link', 'https://github.com/MaestroFront', 'Alex');
  const ghAlex = createImage('alex', '../assets/img/github-logo.svg', 'alex');
  linkAlex.append(ghAlex);
  container.append(linkKirill, linkAnneli, linkAlex);
  return container;
};

export const createDevelopedByContainer = () => {
  const container = createElement('div', 'developed-by');
  const hide = createElement('div', 'opacity');
  const title = createParagraph('developed-title', 'Developed by');
  const logo = createImage('team-logo', '../assets/img/team.png', 'team-logo');
  const version = createElement('span', 'version');
  version.textContent = 'ver 1.01';
  const cross = createButton('btn-cross', 'button', 'х');

  container.append(title, logo, createFooterLinksContainer(), version, cross);
  hide.append(container);
  return hide;
};
