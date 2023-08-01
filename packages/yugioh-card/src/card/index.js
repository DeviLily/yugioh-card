import cloneDeep from 'lodash/cloneDeep';
import { Leafer } from 'leafer-ui';
import { loadCSS } from '../utils';

export class Card {
  constructor(data = {}) {
    this.leafer = null;
    this.cardWidth = 100;
    this.cardHeight = 100;
    this.key = 0;
    this.data = {};
    this.defaultData = {};

    this.view = data.view;
    this.resourcePath = data.resourcePath;

    loadCSS(`${this.resourcePath}/yugioh/font/ygo-font.css`);
    loadCSS(`${this.resourcePath}/yugioh/custom-font/ygo-custom-font.css`);
    loadCSS(`${this.resourcePath}/rush-duel/font/rd-font.css`);
  }

  setData(data = {}) {
    data = cloneDeep(data);
    let needDraw = false;
    let needLoadFont = false;
    Object.keys(data).forEach(key => {
      const value = data[key] ?? this.defaultData[key];
      if (JSON.stringify(this.data[key]) !== JSON.stringify(value)) {
        this.data[key] = value;
        if (['language', 'font'].includes(key)) {
          needLoadFont = true;
        }
        needDraw = true;
      }
    });
    if (needDraw) {
      this.initDraw();
    }
    // 先触发绘制，再触发字体加载
    if (needLoadFont) {
      this.loadFont();
    }
  }

  loadFont() {
    document.fonts.ready.finally(() => {
      this.key++;
      this.initDraw();
    });
  }

  initData(data = {}) {
    data = cloneDeep(data);
    Object.keys(this.defaultData).forEach(key => {
      this.data[key] = data.data[key] ?? this.defaultData[key];
    });
  }

  initLeafer() {
    this.leafer = new Leafer({
      view: this.view,
      width: this.cardWidth,
      height: this.cardHeight,
      usePartRender: false,
      type: 'user',
      wheel: {
        preventDefault: false,
      },
    });
  }

  initDraw() {
    // 需要重写Override
  }

  updateScale() {
    this.leafer.width = this.cardWidth * this.data.scale / devicePixelRatio;
    this.leafer.height = this.cardHeight * this.data.scale / devicePixelRatio;
    this.leafer.scaleX = this.data.scale / devicePixelRatio;
    this.leafer.scaleY = this.data.scale / devicePixelRatio;
  }
}
