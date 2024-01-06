import { WebviewTag } from 'electron';
import './index.css';
import { load } from 'cheerio';

const el = (id: string) => document.getElementById(id);

el('wv').addEventListener('dom-ready', () => {
  console.log('DOM READY!');
  let runes: { isActive: boolean; img: string }[] = [];
  let shards: { isActive: boolean; img: string }[] = [];

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
      el('champImage').setAttribute('src', $('.champion-image').attr('src'));
      el('name').innerHTML = $('.champion-name').html();
      el('loading').style.display = 'none';
      $('.perk').each((i, el) => {
        const isActive = $(el).hasClass('perk-active');
        const img = $(el).children()[0].attribs['src'];
        runes = runes.concat({ isActive, img });
      });
      $('.shard').each((i, el) => {
        const isActive = $(el).hasClass('shard-active');
        const img = $(el).children()[0].attribs['src'];
        shards = shards.concat({ isActive, img });
      });

      runes = runes.slice(0, 22);
      shards = shards.slice(0, 9);

      const runeEls = runes.map((rune) => {
        const img = document.createElement('img');
        img.src = rune.img;
        img.style.border = rune.isActive ? '4px solid green' : 'none';
        return img;
      });
      const shardEls = shards.map((shard) => {
        const img = document.createElement('img');
        img.src = shard.img;
        img.style.border = shard.isActive ? '4px solid green' : 'none';
        return img;
      });

      runeEls.forEach((runeEl, idx) => {
        if (idx < 13) {
          el('runes').appendChild(runeEl);
          if (idx === 3 || (idx > 3 && idx % 3 === 0)) {
            el('runes').appendChild(document.createElement('br'));
          }
        } else {
          el('runes2').appendChild(runeEl);
          if (idx > 3 && idx % 3 === 0) {
            el('runes2').appendChild(document.createElement('br'));
          }
        }
      });
      shardEls.forEach((shardEl, idx) => {
        el('runes2').appendChild(shardEl);
        if ((idx + 1) % 3 === 0) {
          el('runes2').appendChild(document.createElement('br'));
        }
      });
    });
});

const getChamp = (e: Event) => {
  const champ = (el('champName') as HTMLInputElement).value;
  el('wv').setAttribute('src', `https://u.gg/lol/champions/aram/${champ}-aram`);
  e.preventDefault();
};

el('champSearch').addEventListener('submit', (event) => {
  el('loading').style.display = 'block';
  getChamp(event);
});
