import { Frame } from "scenejs";

function isString(value) {
  return typeof value === "string";
}

function getOrderIndex(frame, functionName) {
  const orders = frame.getOrders(["transform"]) || [];
  return orders.indexOf(functionName);
}

export default class MoveableHelper {
  static create(options) {
    return new MoveableHelper(options);
  }
  options;
  constructor(options = {}) {
    this.options = {
      useBeforeRender: false,
      useRender: false,
      createAuto: true,
      ...options,
    };
  }
  map = new Map();
  render(target, frame = this.getFrame(target)) {
    target.style.cssText += frame.toCSS();
  }
  clear() {
    this.map.clear();
  }
  getTargets() {
    return this.map.keys();
  }
  getFrames() {
    return this.map.values();
  }
  getFrame(el) {
    return this.map.get(el);
  }
  setFrame(el, frame) {
    return this.map.set(el, frame);
  }
  removeFrame(el) {
    this.map.delete(el);
  }

  createFrame(el, properites = {}) {
    const frame = new Frame({
      transform: {
        translate: "0px, 0px",
        rotate: "0deg",
        scale: "1, 1",
      },
    });

    frame.set(properites);

    this.map.set(el, frame);
    return frame;
  }
  setElements(selector) {
    const elements = isString(selector)
      ? (document.querySelectorAll < HTMLElement) | (SVGElement > selector)
      : selector;
    const length = elements.length;
    const map = this.map;

    for (let i = 0; i < length; ++i) {
      const el = elements[i];
      if (map.has(el)) {
        continue;
      }
      this.createFrame(el);
    }
  }
  onBeforeRenderStart = (e) => {
    const frame = this.testFrame(e);

    e.setTransform(frame.toCSSObject().transform || "");
  };
  onBeforeRenderGroupStart = (e) => {
    e.events.forEach((ev) => {
      this.onBeforeRenderStart(ev);
    });
  };
  onDragStart = (e) => {
    const frame = this.testFrame(e);

    if (!frame) {
      return false;
    }
    this.setTranasform(e, frame, "translate");
  };
  onDrag = (e) => {
    this.testDrag(e);
    this.testRender(e.target);
  };
  onDragGroupStart = (e) => {
    e.events.forEach((ev) => {
      this.onDragStart(ev);
    });
  };
  onDragGroup = (e) => {
    e.events.forEach((ev) => {
      this.onDrag(ev);
    });
  };
  onResizeStart = (e) => {
    e.dragStart && this.onDragStart(e.dragStart);
    e.setOrigin(["%", "%"]);
  };
  onResize = (e) => {
    this.testResize(e);
    this.testRender(e.target);
  };
  onResizeGroupStart = (e) => {
    e.events.forEach((ev) => {
      this.onResizeStart(ev);
    });
  };
  onResizeGroup = (e) => {
    e.events.forEach((ev) => {
      this.onResize(ev);
    });
  };
  onScaleStart = (e) => {
    const frame = this.testFrame(e);

    if (!frame) {
      return false;
    }

    this.setTranasform(e, frame, "scale");
    e.dragStart && this.onDragStart(e.dragStart);
  };
  onScale = (e) => {
    this.testScale(e);
    this.testRender(e.target);
  };
  onScaleGroupStart = (e) => {
    e.events.forEach((ev) => {
      this.onScaleStart(ev);
    });
  };
  onScaleGroup = (e) => {
    e.events.forEach((ev) => {
      this.onScale(ev);
    });
  };
  onRotateStart = (e) => {
    const frame = this.testFrame(e);

    if (!frame) {
      return false;
    }

    this.setTranasform(e, frame, "rotate");
    e.dragStart && this.onDragStart(e.dragStart);
  };
  onRotate = (e) => {
    this.testRotate(e);
    this.testRender(e.target);
  };
  onRotateGroupStart = (e) => {
    e.events.forEach((ev) => {
      this.onRotateStart(ev);
    });
  };
  onRotateGroup = (e) => {
    e.events.forEach((ev) => {
      this.onRotate(ev);
    });
  };
  onClip = (e) => {
    const frame = this.testFrame(e);
    if (e.clipType === "rect") {
      frame.set("clip", e.clipStyle);
    } else {
      frame.set("clip-path", e.clipStyle);
    }
    this.testRender(e.target);
  };
  onDragOriginStart = (e) => {
    e.dragStart && this.onDragStart(e.dragStart);
  };
  onDragOrigin = (e) => {
    const frame = this.testFrame(e);

    frame.set("transform-origin", e.transformOrigin);
    this.testDrag(e.drag);
    this.testRender(e.target);
  };
  onRound = (e) => {
    const frame = this.testFrame(e);

    frame.set("border-radius", e.borderRadius);
    this.testRender(e.target);
  };
  onWarpStart = (e) => {
    const frame = this.testFrame(e);

    if (!frame) {
      return false;
    }
    this.setTranasform(e, frame, "matrix3d");
  };
  onWarp = (e) => {
    const frame = this.testFrame(e);

    frame.set("transform", "matrix3d", e.matrix.join(", "));
    this.testRender(e.target);
  };
  onRender = (e) => {
    const target = e.target;
    const frame = this.getFrame(target);

    if (!target || !frame) {
      return;
    }
    this.render(target, frame);
  };
  testFrame(e) {
    const target = e.target;
    const frame = this.getFrame(target);

    if (frame) {
      return frame;
    }
    if (!this.options.createAuto) {
      if (e.stop) {
        e.stop();
        return;
      }
    }
    return this.createFrame(target);
  }
  testDrag(e) {
    const target = e.target;
    const translate = e.translate;

    const frame = this.getFrame(target);
    const tx = `${translate[0]}px`;
    const ty = `${translate[1]}px`;

    if (frame.has("transform", "translate")) {
      frame.set("transform", "translate", `${tx},${ty}`);
    } else {
      frame.set("transform", "translateX", tx);
      frame.set("transform", "translateY", ty);
    }
  }
  testResize(e) {
    const target = e.target;
    const frame = this.getFrame(target);

    frame.set("width", `${e.width}px`);
    frame.set("height", `${e.height}px`);

    this.testDrag(e.drag);
  }
  testScale(e) {
    const frame = this.testFrame(e);
    const scale = e.scale;

    this.testDrag(e.drag);
    frame.set("transform", "scale", `${scale[0]},${scale[1]}`);
  }
  testRotate(e) {
    const frame = this.testFrame(e);
    const rotate = e.rotate;

    this.testDrag(e.drag);
    frame.set("transform", "rotate", `${rotate}deg`);
  }
  testRender(target, frame = this.getFrame(target)) {
    if (!this.options.useRender) {
      this.render(target, frame);
    }
  }
  setTranasform(e, frame, functionName) {
    const orderIndex = getOrderIndex(frame, functionName);
    if (this.options.useBeforeRender) {
      e.setTransformIndex(orderIndex);
    } else {
      e.setTransform(frame.toCSSObject().transform || [], orderIndex);
    }
  }
}
