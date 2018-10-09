
const ac = new AudioContext();
// https://qiita.com/printf_moriken/items/8ae2f0e4651b38afb0bf
function fft(input) {
    let n = input.length, theta = 2 * Math.PI / n,
        ar = new Float32Array(n), ai = new Float32Array(n),
        m, mh, i, j, k, irev,
        wr, wi, xr, xi,
        cos = Math.cos, sin = Math.sin;

    for(i=0; i<n; ++i) {
        ar[i] = input[i];
    }

    // scrambler
    i=0;
    for(j=1; j<n-1; ++j) {
        for(k = n>>1; k>(i ^= k); k>>=1);
        if(j<i) {
            xr = ar[j];
            xi = ai[j];
            ar[j] = ar[i];
            ai[j] = ai[i];
            ar[i] = xr;
            ai[i] = xi;
        }
    }
    for(mh=1; (m = mh << 1) <= n; mh=m) {
        irev = 0;
        for(i=0; i<n; i+=m) {
            wr = cos(theta * irev);
            wi = sin(theta * irev);
            for(k=n>>2; k > (irev ^= k); k>>=1);
            for(j=i; j<mh+i; ++j) {
                k = j + mh;
                xr = ar[j] - ar[k];
                xi = ai[j] - ai[k];
                ar[j] += ar[k];
                ai[j] += ai[k];
                ar[k] = wr * xr - wi * xi;
                ai[k] = wr * xi + wi * xr;
            }
        }
    }

    // remove DC offset
    ar[0] = ai[0] = 0;

    return [ar, ai];
}


// analyser
const analyser = ac.createAnalyser();
analyser.fftSize = 2048;
const bufferLength = analyser.frequencyBinCount;
const arr = new Uint8Array(analyser.frequencyBinCount);
const arr2 = new Float32Array(analyser.frequencyBinCount);
analyser.getByteTimeDomainData(arr);
// analyser.connect(ac.destination);

// mic input
navigator.mediaDevices.getUserMedia({audio: true, video: false})
  .then((stream) => {
    const source = ac.createMediaStreamSource(stream);
    source.connect(analyser);
  })


const buffer = new Float32Array(2048);
for(let i=0, l=buffer.length; i<l; ++i) {
  buffer[i] = Math.sin( Math.PI * 2 * i / 2048 );
}
const fdata = fft(buffer);
const ctx = new AudioContext();
// const periodic = ctx.createPeriodicWave(fdata[0], fdata[1]);
const osc = ac.createOscillator();
const wave = ac.createPeriodicWave(fdata[0], fdata[1]);
// osc.setPeriodicWave(wave);
osc.type = 'square';
osc.frequency.value = 440;
osc.connect(ac.destination);
// osc.start();


const canvas:HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('canvas');
const canvasCtx: CanvasRenderingContext2D = canvas.getContext('2d');
const WIDTH = 400;
const HEIGHT = 200;

document.addEventListener('keydown', function(e) {
  if (e.key == 'w') {
    // btn.classList.add('active');
    setTimeout(() => {
      analyser.getFloatTimeDomainData(arr2);
      const fdata = fft(arr2);
      console.log(fdata[0], fdata[1]);
      const wave = ac.createPeriodicWave(fdata[0], fdata[1]);
      osc.setPeriodicWave(wave);
      osc.frequency.value = 440;
      osc.connect(ac.destination);
      osc.start();
    }, 2000)
  }
})

function draw() {
  requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(arr);
  // analyser.getFloatTimeDomainData(arr2);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for(var i = 0; i < bufferLength; i++) {

    var v = arr[i] / 128.0;
    var y = v * HEIGHT/2;

    if(i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height/2);
  canvasCtx.stroke();
};
draw();

