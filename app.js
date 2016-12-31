function App() {

  var colors = {
    "startUp" : [7, 84, 19],
    "startLeft" : [139, 57, 137],
    "stop": [51, 69, 169],
    "turnRight": [182, 149, 72],
    "turnLeft": [123, 131, 154]
  }

  var originalImageData;
  var drawBuffer;

  this.Start = function()
  {
    var img = new Image();

    img.onload = function () {
        
        InitCanvas(img);
        InitDrawBuffer();

        var i,x,y;
        x = y = i = 0;
        DrawNextShape();

        function UpdateIndices()
        {
          i++;
          x++;
          if (x == Width())
          {
            x = 0;
            y++;
          }
        }

        function DrawNextShape()
        {
          PutDrawBuffer();
          while (i < Width()*Height())
          {
            if (StartDrawing(x, y))
            {
              DrawFrom(x, y);
              UpdateIndices();
              setTimeout(DrawNextShape, 10);
              return;       
            } 
      
            UpdateIndices();
          }
        }
    };

    img.src = 'kuva.png';
  }

  function InitCanvas(img)
  {
    var canvas = GetCanvas();

    canvas.width = img.width;
    canvas.height = img.height;

    canvas.style.width = img.width*10;
    canvas.style.height = img.height*10;

    var ctx = GetContext();
    ctx.drawImage(img, 0, 0, img.width, img.height);

    originalImageData = ctx.getImageData(0, 0, img.width, img.height);
  }

  function InitDrawBuffer()
  {
    drawBuffer = new Uint8ClampedArray(originalImageData.data.length);
    for (var i = 3; i < drawBuffer.length; i+=4) {
      drawBuffer[i] = 255; // alpha
    }
  }

  function PutDrawBuffer()
  {
    GetContext().putImageData(new ImageData(drawBuffer, Width(), Height()), 0, 0);
  }

  function DrawFrom(x, y)
  {
    var dir = StartUp(x, y) ? [0, -1] : [-1, 0];
    while (!Stop(x, y))
    {
      SetColor(x, y, GetColor(x, y));
      
      dir = RotateIfNeeded(x, y, dir);
      x += dir[0];
      y += dir[1];
    }
    SetColor(x, y, GetColor(x, y));
  }

  function RotateIfNeeded(x, y, dir)
  {
    if (TurnLeft(x, y))
    {
      return RotateLeft(dir);
    }
      
    if (TurnRight(x, y))
    {
      return RotateRight(dir);
    }
    return dir;
  }

  function RotateLeft(dir)
  {
    return [dir[1], -dir[0]];
  }

  function RotateRight(dir)
  {
    return [-dir[1], dir[0]];
  }

  function GetColor(x, y)
  {
    var coord = Linearize(x, y);
    var data = originalImageData.data;
    return [data[coord], data[coord + 1], data[coord + 2]];
  }

  function SetColor(x, y, color)
  {
    var coord = Linearize(x, y);    
    drawBuffer[coord + 0] = color[0];
    drawBuffer[coord + 1] = color[1];
    drawBuffer[coord + 2] = color[2];
  }

  function Linearize(x, y)
  {
    return (x + Width() * y) * 4;
  }

  function StartDrawing(x, y)
  {
    return StartLeft(x, y) || StartUp(x, y);
  }

  function StartLeft(x, y)
  {
    return IsColor(x, y, "startLeft");
  }

  function StartUp(x, y)
  {
    return IsColor(x, y, "startUp");
  }

  function Stop(x, y)
  {
    return IsColor(x, y, "stop");
  }

  function TurnRight(x, y)
  {
    return IsColor(x, y, "turnRight");
  }

  function TurnLeft(x, y)
  {
    return IsColor(x, y, "turnLeft");
  }

  function IsColor(x, y, str)
  {
    return eq(GetColor(x, y), colors[str]);
  }

  function eq(color1, color2)
  {
    return color1[0] == color2[0] && color1[1] == color2[1] && color1[2] == color2[2];
  }

  function Width()
  {
    return GetCanvas().width;
  }

  function Height()
  {
    return GetCanvas().height;
  }

  function GetCanvas()
  {
    return document.getElementById("canvas");
  }

  function GetContext()
  {
    return GetCanvas().getContext("2d");
  }

  return this;
}