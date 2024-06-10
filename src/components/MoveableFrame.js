export default class MoveableFrame {
  map = new Map();

  render(target, frame = this.getFrame(target)) {
    target.style.cssText += `transform: translate(${frame.transform.translate[0]}px,${frame.transform.translate[1]}px) rotate(${frame.transform.rotate}deg);`;
    target.style.cssText += `height: ${frame.dimensions.height}px;`;
    target.style.cssText += `width: ${frame.dimensions.width}px;`;
  }

  getFrame(el) {
    return this.map.get(el);
  }

  getTranslate(el) {
    const frame = this.map.get(el);
    return {
      x: frame.transform.translate[0],
      y: frame.transform.translate[1],
    };
  }
  createFrame(el) {
    const frame = {
      transform: {
        translate: [0, 0],
        rotate: 0,
      },
      dimensions: {
        width: 200,
        height: 100,
      },
    };
    this.map.set(el, frame);
    return frame;
  }

  onDragStart = (e) => {
    const frame = this.getFrame(e.target);
    this.setTransform(e, frame, "translate");
  };

  onDrag = (e) => {
    this.testDrag(e);
    this.render(e.target, this.getFrame(e.target));
  };

  onResizeStart = (e) => {
    e.dragStart && this.onDragStart(e.dragStart);
    e.setOrigin(["%", "%"]);
  };

  onResize = (e) => {
    this.testResize(e);
    this.render(e.target, this.getFrame(e.target));
  };

  onRotateStart = (e) => {
    const frame = this.getFrame(e.target);

    if (!frame) {
      return false;
    }

    this.setTransform(e, frame, "rotate");
    e.dragStart && this.onDragStart(e.dragStart);
  };

  onRotate = (e) => {
    this.testRotate(e);
    this.render(e.target, this.getFrame(e.target));
  };

  testDrag(e) {
    const target = e.target;
    const translate = e.translate;

    const frame = this.getFrame(target);
    frame.transform.translate = [translate[0], translate[1]];
  }

  testResize(e) {
    const frame = this.getFrame(e.target);
    frame.dimensions.width = e.width;
    frame.dimensions.height = e.height;
    this.testDrag(e.drag);
  }

  testRotate(e) {
    const frame = this.getFrame(e.target);
    this.testDrag(e.drag);
    frame.transform.rotate = e.rotate;
  }

  setTransform(e, frame, functionName) {
    let order = 0;
    if (functionName === "rotate") {
      order = 1;
    }
    e.setTransform(
      `translate(0px,0px) rotate(${frame.transform.rotate})deg`,
      order
    );
  }
}
