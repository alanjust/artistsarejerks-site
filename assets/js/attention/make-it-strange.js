(function(){
  function toGray(data){
    for(let i=0;i<data.length;i+=4){
      const r=data[i], g=data[i+1], b=data[i+2];
      const v = (0.2126*r + 0.7152*g + 0.0722*b)|0; // luminance
      data[i]=data[i+1]=data[i+2]=v;
    }
  }
  function posterize(data, levels){
    const step = 255/(levels-1);
    for(let i=0;i<data.length;i+=4){
      data[i]   = Math.round(data[i]/step)*step;
      data[i+1] = Math.round(data[i+1]/step)*step;
      data[i+2] = Math.round(data[i+2]/step)*step;
    }
  }
  function edges(srcData, outData){
    const w = srcData.width, h = srcData.height;
    const src = srcData.data, dst = outData.data;
    const gray = new Uint8ClampedArray(src.length);
    for(let i=0;i<src.length;i+=4){
      const v = (0.2126*src[i] + 0.7152*src[i+1] + 0.0722*src[i+2])|0;
      gray[i]=gray[i+1]=gray[i+2]=v; gray[i+3]=255;
    }
    const gxK = [-1,0,1,-2,0,2,-1,0,1];
    const gyK = [-1,-2,-1,0,0,0,1,2,1];
    function gAt(x,y){ return gray[((y*w+x)<<2)]; }
    for(let y=1;y<h-1;y++){
      for(let x=1;x<w-1;x++){
        let gx=0, gy=0, k=0;
        for(let j=-1;j<=1;j++){
          for(let i=-1;i<=1;i++){
            const v = gAt(x+i,y+j);
            gx += v*gxK[k]; gy += v*gyK[k]; k++;
          }
        }
        const m = Math.min(255, Math.hypot(gx,gy)|0);
        const idx = ((y*w+x)<<2);
        dst[idx]=dst[idx+1]=dst[idx+2]=m; dst[idx+3]=255;
      }
    }
  }
  function draw(el){
    const img = el.querySelector('.mis-img');
    const canvas = el.querySelector('.mis-canvas');
    const modeSel = el.querySelector('.mis-mode');
    const intensity = el.querySelector('.mis-int');
    const ctx = canvas.getContext('2d', { willReadFrequently:true });
    const mode = modeSel.value;

    const maxW = Math.min(1200, img.naturalWidth);
    const scale = Math.min(1, maxW / img.naturalWidth);
    canvas.width = (img.naturalWidth*scale)|0;
    canvas.height= (img.naturalHeight*scale)|0;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if(mode==='original') return;

    let imgData = ctx.getImageData(0,0,canvas.width, canvas.height);
    if(mode==='value'){
      toGray(imgData.data);
      ctx.putImageData(imgData,0,0);
    } else if(mode==='posterize'){
      const lv = Math.max(2, parseInt(intensity.value,10));
      posterize(imgData.data, lv);
      ctx.putImageData(imgData,0,0);
    } else if(mode==='edges'){
      const out = ctx.createImageData(imgData.width, imgData.height);
      edges(imgData, out);
      ctx.putImageData(out,0,0);
    }
  }
  function init(el){
    const src = el.dataset.src;
    const img = el.querySelector('.mis-img');
    img.addEventListener('load', ()=> draw(el));
    el.querySelector('.mis-mode').addEventListener('change', ()=> draw(el));
    el.querySelector('.mis-int').addEventListener('input', ()=> draw(el));
    if(img.complete) draw(el); else img.src = src;
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('.mis').forEach(init);
  });
})();
