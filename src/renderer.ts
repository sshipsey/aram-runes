import { WebviewTag } from 'electron';
import './index.css';
import { load } from 'cheerio';

const el = (id: string) => document.getElementById(id);

el('wv').addEventListener('dom-ready', () => {
  el('runes').innerHTML = '';
  el('runes2').innerHTML = '';
  el('name').innerHTML = '';
  el('champImage').setAttribute('src', '');
  (el('wv') as WebviewTag)
    .executeJavaScript(
      `function gethtml () {
    return new Promise((resolve, reject) => { resolve(document.documentElement.innerHTML); });
    }
    gethtml();`
    )
    .then((html) => {
      const $ = load(html);
      $('.media-query_MOBILE_SMALL__MOBILE_MEDIUM').remove();
      el('champImage').setAttribute('src', $('.champion-image').attr('src'));
      el('name').innerHTML = $('.champion-name').html();
      el('path').innerHTML = $('.skill-priority-path').html();
      el('core').innerHTML = $('.core-items .item-row').html();
      el('loading').style.display = 'none';

      el('runes').innerHTML = $.html($('.primary-tree'));
      el('runes2').innerHTML = $.html($('.secondary-tree'));
    });
});

const getChamp = (e: Event) => {
  const champ = (el('champName') as HTMLInputElement).value.toLowerCase();
  el('runes').innerHTML = '';
  el('runes2').innerHTML = '';
  el('name').innerHTML = '';
  el('champImage').setAttribute('src', '');
  el('wv').setAttribute('src', `https://u.gg/lol/champions/aram/${champ}-aram`);
  e.preventDefault();
};

el('champSearch').addEventListener('submit', (event) => {
  el('loading').style.display = 'block';
  getChamp(event);
});
