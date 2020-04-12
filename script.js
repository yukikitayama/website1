var image = null;
var imgcanvas = null;
var grayImage = null;
var redImage = null;
var thickness = 100;
var rainbowImage = null;
var blurImage = null;
var blankImage = null;

function upload() {
  imgcanvas = document.getElementById("can1");
  var fileinput = document.getElementById("finput");
  image = new SimpleImage(fileinput);
  grayImage = new SimpleImage(fileinput);
  redImage = new SimpleImage(fileinput);
  windowImage = new SimpleImage(fileinput);
  rainbowImage = new SimpleImage(fileinput);
  blurImage = new SimpleImage(fileinput);
  image.drawTo(imgcanvas);
}

function doGrayscale() {
  if (imageIsLoaded(grayImage)) {
    filterGray();
    grayImage.drawTo(imgcanvas);
  }
}

function imageIsLoaded(thisImage) {
  if (thisImage == null || ! thisImage.complete()) {
    return false;
  }
  else {
    return true;
  }
}

function filterGray() {
  for (var pixel of grayImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    pixel.setRed(avg);
    pixel.setGreen(avg);
    pixel.setBlue(avg);
  }
}

function doRed() {
  if (imageIsLoaded(redImage)) {
    filterRed();
    redImage.drawTo(imgcanvas);
  }  
}

function filterRed() {
  for (var pixel of redImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    if (avg < 128) {
      pixel.setRed(2 * avg);
      pixel.setGreen(0);
      pixel.setBlue(0);
    }
    else {
      pixel.setRed(255);
      pixel.setGreen(2 * avg - 255);
      pixel.setBlue(2 * avg - 255);
    }
  }  
}

function resetImage() {
  if (imageIsLoaded(image)) {
    // grayImage = null;
    // blueImage = null;
    image.drawTo(imgcanvas);
  }    
}

function doWindow() {
  if (imageIsLoaded(windowImage)) {
    filterWindow();
    windowImage.drawTo(imgcanvas);
  }  
}

function filterWindow() {
  for (var px of windowImage.values()) {
    var x = px.getX();
    var y = px.getY();
    if (x < thickness) {
      px = setTiffanyBlue(px);
    }
    if (x >= image.getWidth() - thickness) {
      px = setTiffanyBlue(px);
    }
    if (x < image.getWidth()/2 + thickness/2 && x >= image.getWidth()/2 - thickness/2) {
      px = setTiffanyBlue(px);   
    }
    if (y < thickness) {
      px = setTiffanyBlue(px);
    }
    if (y >= image.getHeight() - thickness) {
      px = setTiffanyBlue(px);
    }
    if (y < image.getHeight()/2 + thickness/2 && y >= image.getHeight()/2 - thickness/2) {
      px = setTiffanyBlue(px);   
    }
  }
}

function setTiffanyBlue(px) {
  px.setRed(10);
  px.setGreen(186);
  px.setBlue(181);
  return px;
}

function doRainbow() {
  if (imageIsLoaded(rainbowImage)) {
    filterRainbow();
    rainbowImage.drawTo(imgcanvas);
  }
}

function filterRainbow() {
  for (var pixel of rainbowImage.values()) {
    var avg = (pixel.getRed() + pixel.getGreen() + pixel.getBlue()) / 3;
    var y = pixel.getY();
    var h = rainbowImage.getHeight();
    
    if (y < h / 7) {
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(2 * avg - 255);
      }
    }
    else if (y < 2 * h / 7) {
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(0.8 * avg);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(1.2 * avg - 51);
        pixel.setBlue(2 * avg - 255);
      }
    }
    else if (y < 3 * h / 7) {
      if (avg < 128) {
        pixel.setRed(2 * avg);
        pixel.setGreen(2 * avg);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);        
      }
    }
    else if (y < 4 * h / 7) {
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(2 * avg);
        pixel.setBlue(0);
      }
      else {
        pixel.setRed(2 * avg - 255);
        pixel.setGreen(255);
        pixel.setBlue(2 * avg - 255);        
      }
    }
    else if (y < 5 * h / 7) {
      if (avg < 128) {
        pixel.setRed(0);
        pixel.setGreen(0);
        pixel.setBlue(2 * avg);        
      }
      else {
        pixel.setRed(2 * avg - 255);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);        
      }
    }
    else if (y < 6 * h / 7) {
      if (avg < 128) {
        pixel.setRed(0.8 * avg);
        pixel.setGreen(0);
        pixel.setBlue(2 * avg);        
      }
      else {
        pixel.setRed(1.2 * avg - 51);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(255);        
      }
    }
    else {
      if (avg < 128) {
        pixel.setRed(1.6 * avg);
        pixel.setGreen(0);
        pixel.setBlue(1.6 * avg);        
      }
      else {
        pixel.setRed(0.4 * avg + 153);
        pixel.setGreen(2 * avg - 255);
        pixel.setBlue(0.4 * avg + 153);       
      }
    }
  }
}
  
function doBlur() {
  if (imageIsLoaded(blurImage)) {
    filterBlur();
    blurImage.drawTo(imgcanvas);
  }
}

function filterBlur() {
  for (var pixel of blurImage.values()) {
    // generate random number
    var randNum = Math.random();
    if (randNum < 0.5) {
      var randIntX = Math.floor(Math.random() * 10) + 1;
      randIntX = pixel.getX() + randIntX;
      var randIntY = Math.floor(Math.random() * 10) + 1;
      randIntY = pixel.getY() + randIntY;
      if (randIntX > 0 && randIntY > 0 && randIntX < blurImage.getWidth() && randIntY < blurImage.getHeight()) {
        var nearbyPixel = image.getPixel(randIntX, randIntY)
        }
      pixel.setRed(nearbyPixel.getRed());
      pixel.setGreen(nearbyPixel.getGreen());
      pixel.setBlue(nearbyPixel.getBlue());
    }
  }
}


