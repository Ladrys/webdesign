/*
 * Original AI-generated fictional performer photography for Prague Rocks Festival.
 * Each image is a regular 4 × 4 contact sheet; CSS selects one complete cell.
 * The mapping uses the XML performer ID so searching or sorting never changes it.
 * See images/performers/README.md for provenance and verification details.
 */
(function (global) {
  'use strict';

  const positions = ['0%', '33.333333333333%', '66.666666666667%', '100%'];
  const portraits = Object.create(null);

  for (let index = 0; index < 60; index += 1) {
    const cell = index % 16;
    portraits['i' + (index + 1)] = Object.freeze({
      image: 'images/performers/sheet-' + (Math.floor(index / 16) + 1) + '.webp',
      position: positions[cell % 4] + ' ' + positions[Math.floor(cell / 4)],
      size: '400% 400%'
    });
  }

  Object.freeze(portraits);

  global.PerformerArt = Object.freeze({
    get: function (id) {
      return typeof id === 'string' && Object.prototype.hasOwnProperty.call(portraits, id)
        ? portraits[id]
        : null;
    },
    style: function (id) {
      const portrait = this.get(id);
      return portrait
        ? 'background-image:url("' + portrait.image + '");background-position:' + portrait.position + ';background-size:' + portrait.size + ';background-repeat:no-repeat;'
        : '';
    },
    ids: Object.freeze(Object.keys(portraits))
  });
}(window));
