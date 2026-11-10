'use strict';
/* AI-created music illustrations, deliberately not portraits of the named artists. */
(() => {
  const ids = Object.freeze(window.FESTIVAL_DATA.performers.map((artist) => artist.id));
  const art = Object.create(null);
  ids.forEach((id, index) => {
    const tile = index % 16;
    art[id] = Object.freeze({
      image: 'images/music-artwork-ai.webp',
      position: ((tile % 4) * 100) / 3 + '% ' + (Math.floor(tile / 4) * 100) / 3 + '%',
      size: '400% 400%',
      kind: 'ai-illustration',
    });
  });
  Object.freeze(art);
  window.PerformerArt = Object.freeze({
    ids,
    get(id) {
      return art[id] || null;
    },
    style(id) {
      const item = art[id];
      return item
        ? 'background-image:url("' +
            item.image +
            '");background-position:' +
            item.position +
            ';background-size:' +
            item.size +
            ';background-repeat:no-repeat;'
        : '';
    },
  });
})();
