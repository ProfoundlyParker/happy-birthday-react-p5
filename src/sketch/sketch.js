import Dot from './Dot';
import fontFile from './AvenirNextLTPro-Demi.otf';

const defaultFrameRate = 35; // low framerate to avoid too much strain on mobile phones


export default (parent, text) => (sketch) => {
  let font;
  let dots;
  let firstWordPoints;
  let secondWordPoints;
  let thirdWordPoints = [];
  let resizeTimeout;
  let lastWidth;
  let lastHeight;

  sketch.preload = () => {
    font = sketch.loadFont(fontFile);
  };

  const fillDots = (width, height) => {
    dots = [];
    let [firstWord, secondWord, thirdWord] = text.split(' ') // Assumption that text is just 3 words, no more, no less

    // A dirty hack to make it work on both desktop and mobile phones
    if (width > height) {
      // console.log('desktop view')

      // ref: https://p5js.org/reference/#/p5.Font/textToPoints
      // I just tweaked these numbers until it "looked right", mainly trial and error :D 
      // The numbers would be different for different text, any suggestions about better way to do this are welcome :) 
      firstWordPoints = font.textToPoints(`${firstWord} ${secondWord}`, width * 0.07, height * 0.33, width * 0.12, { sampleFactor: 0.15 });
      secondWordPoints = font.textToPoints(thirdWord, width * 0.05, height * 0.83, width * 0.25, { sampleFactor: 0.15 });
      thirdWordPoints = [];
    } else {
      // console.log('in mobile view')

      firstWordPoints = font.textToPoints(firstWord, width * 0.01, height * 0.3, width * 0.3, { sampleFactor: 0.2 });
      secondWordPoints = font.textToPoints(secondWord, width * 0.01, height * 0.5, width * 0.25, { sampleFactor: 0.2 });
      thirdWordPoints = font.textToPoints(thirdWord, width * 0.01, height * 0.7, width * 0.27, { sampleFactor: 0.2 });
    }

    firstWordPoints.forEach((point) => {
      dots.push(new Dot(point.x, point.y, sketch));
    });

    secondWordPoints.forEach((point) => {
      dots.push(new Dot(point.x, point.y, sketch));
    });

    thirdWordPoints.forEach((point) => {
      dots.push(new Dot(point.x, point.y, sketch));
    });
  };

  sketch.setup = () => {
    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    lastWidth = width;
    lastHeight = height;
    sketch.createCanvas(width, height);
    fillDots(width, height);
    sketch.frameRate(defaultFrameRate);
  };

  sketch.draw = () => {
    sketch.clear();
    dots.forEach((dot) => {
      dot.update();
      dot.applyAllForces();
      dot.show();
    });
  };

  sketch.windowResized = () => {
    // Debounce resize to prevent scrolling from triggering recalculation on mobile
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      // Only resize if dimensions actually changed
      if (width !== lastWidth || height !== lastHeight) {
        lastWidth = width;
        lastHeight = height;
        sketch.resizeCanvas(width, height);
        fillDots(width, height);
      }
    }, 250);
  };
};
