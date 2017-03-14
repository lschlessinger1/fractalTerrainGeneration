/*
http://www.playfuljs.com/realistic-terrain-in-130-lines/
https://github.com/hunterloftis/playfuljs-demos/blob/gh-pages/terrain/index.html
https://gist.github.com/domitry/10023888
https://www.complexityexplorer.org/courses/62-fractals-and-scaling-winter-2017/segments/5011
https://en.wikipedia.org/wiki/Diamond-square_algorithm
http://gameprogrammer.com/
*/

// should return a dimen by dimen array of data points, where dimen is 2^n + 1 
var OUT_OF_BOUNDS = -1;

function Terrain(dimen) {
  this.dimen = dimen;
  this.data = create2DArray(dimen);
  this.max = dimen - 1;

  function create2DArray(dimen) {
    // TODO: check that dimen is = 2^n + 1
    var data = [];

    for (var x = 0; x < dimen; x++) {
      data[x] = [];

      for (var y = 0; y < dimen; y++) {
        data[x][y] = 0;
      }

    }

    return data;
  }
}

Terrain.prototype.get = function(x, y) {
  if (x < 0 || x > this.max || y < 0 || y > this.max) {
    return OUT_OF_BOUNDS;
  } else {
    return this.data[x][y];
  }  
};

Terrain.prototype.set = function(x, y, value) {
  this.data[x][y] = value;
};

Terrain.prototype.generate = function(roughness) {
    var instance = this;
    var max = this.max;
    setCorners();
    divide(this.max);

    // step 1
    function setCorners() {
        instance.set(0, 0, max / 2);
        instance.set(max, 0, max / 2);
        instance.set(max, max, max / 2);
        instance.set(0, max, max / 2);
    }

    //step 2
    function divide(size) {
      var x, y, half = size / 2;

      var scale = roughness * size;

      if (half < 1) return;

      for (y = half; y < max; y += size) {
        for (x = half; x < max; x += size) {
          square(x, y, half, Math.random() * scale * 2 - scale);
        }
      }

      for (y = 0; y <= max; y += half) {
        for (x = (y + half) % size; x <= max; x += size) {
          diamond(x, y, half, Math.random() * scale * 2 - scale);
        }
      }

      divide(size / 2);
    }

    function square(x, y, size, offset) {
      var avg = average([
        instance.get(x - size, y - size),   // upper left
        instance.get(x + size, y - size),   // upper right
        instance.get(x + size, y + size),   // lower right
        instance.get(x - size, y + size)    // lower left
      ]);

      instance.set(x, y, avg + offset);
    }

    function diamond(x, y, size, offset) {

      var avg = average([
        instance.get(x, y - size), // top
        instance.get(x + size, y), // right
        instance.get(x, y + size), // bottom
        instance.get(x - size, y) // left
      ]);

      instance.set(x, y, avg + offset);
    }

     function average(values) {
      var valid = values.filter(function(val) { 
        return val !== OUT_OF_BOUNDS; 
      });
      
      var total = valid.reduce(function(sum, val) { 
        return sum + val; 
      }, 0);

      return total / valid.length;
    }
};