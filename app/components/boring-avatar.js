/*
=====
MIT License

Copyright (c) 2021 boringdesigners

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
====

The following is an Ember port of:
https://github.com/boringdesigners/boring-avatars
from React to Ember.

Additionally, it only ports the code necessary to support the AvatarBeam avatar
variant, which is all we need for the DAM project
 */

import Component from '@glimmer/component';
import { action } from '@ember/object';

const SIZE = 36;
const COLORS = ['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90'];

export default class Avatar extends Component {
  get props() {
    return {
      colors: this.args.colors || COLORS,
      name: this.args.name || 'Clara Barton',
      square: false,
      title: false,
      size: this.args.size || 40,
    };
  }

  get data() {
    return this.generateData(this.props.name, this.props.colors);
  }

  get viewBox() {
    return `0 0 ${SIZE} ${SIZE}`;
  }

  get rectRx() {
    return this.props.square ? undefined : SIZE * 2;
  }

  get circleRx() {
    return this.data.isCircle ? SIZE : SIZE / 6;
  }

  get avatarSize() {
    return SIZE;
  }

  get wrapperTransform() {
    return `translate(${this.data.wrapperTranslateX} ${
      this.data.wrapperTranslateY
    }) rotate(${this.data.wrapperRotate} ${SIZE / 2} ${SIZE / 2}) scale(${
      this.data.wrapperScale
    })`;
  }

  get faceTransform() {
    return `translate(${this.data.faceTranslateX} ${
      this.data.faceTranslateY
    }) rotate(${this.data.faceRotate} ${SIZE / 2} ${SIZE / 2})`;
  }

  get pathDFace() {
    return this.data.isMouthOpen
      ? `M15 ${19 + this.data.mouthSpread}c2 1 4 1 6 0`
      : `M13,${19 + this.data.mouthSpread} a1,0.75 0 0,0 10,0`;
  }

  get eyeSpreadFrom14() {
    return 14 - this.data.eyeSpread;
  }

  get eyeSpreadPlus20() {
    return this.data.eyeSpread + 20;
  }

  @action generateData(name, colors) {
    const numFromName = hashCode(name);
    const range = colors && colors.length;
    const wrapperColor = getRandomColor(numFromName, colors, range);
    const preTranslateX = getUnit(numFromName, 10, 1);
    const wrapperTranslateX =
      preTranslateX < 5 ? preTranslateX + SIZE / 9 : preTranslateX;
    const preTranslateY = getUnit(numFromName, 10, 2);
    const wrapperTranslateY =
      preTranslateY < 5 ? preTranslateY + SIZE / 9 : preTranslateY;

    return {
      wrapperColor,
      faceColor: getContrast(wrapperColor),
      backgroundColor: getRandomColor(numFromName + 13, colors, range),
      wrapperTranslateX,
      wrapperTranslateY,
      wrapperRotate: getUnit(numFromName, 360),
      wrapperScale: 1 + getUnit(numFromName, SIZE / 12) / 10,
      isMouthOpen: getBoolean(numFromName, 2),
      isCircle: getBoolean(numFromName, 1),
      eyeSpread: getUnit(numFromName, 5),
      mouthSpread: getUnit(numFromName, 3),
      faceRotate: getUnit(numFromName, 10, 3),
      faceTranslateX:
        wrapperTranslateX > SIZE / 6
          ? wrapperTranslateX / 2
          : getUnit(numFromName, 8, 1),
      faceTranslateY:
        wrapperTranslateY > SIZE / 6
          ? wrapperTranslateY / 2
          : getUnit(numFromName, 7, 2),
    };
  }
}

function hashCode(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    let character = name.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function getModulus(num, max) {
  return num % max;
}

function getDigit(number, ntn) {
  return Math.floor((number / Math.pow(10, ntn)) % 10);
}

function getBoolean(number, ntn) {
  return !(getDigit(number, ntn) % 2);
}

function getAngle(x, y) {
  return (Math.atan2(y, x) * 180) / Math.PI;
}

function getUnit(number, range, index) {
  let value = number % range;

  if (index && getDigit(number, index) % 2 === 0) {
    return -value;
  } else {
    return value;
  }
}

function getRandomColor(number, colors, range) {
  return colors[number % range];
}

function getContrast(hexcolor) {
  // If a leading # is provided, remove it
  if (hexcolor.slice(0, 1) === '#') {
    hexcolor = hexcolor.slice(1);
  }

  // Convert to RGB value
  let r = parseInt(hexcolor.substr(0, 2), 16);
  let g = parseInt(hexcolor.substr(2, 2), 16);
  let b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  let yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? '#000000' : '#FFFFFF';
}
