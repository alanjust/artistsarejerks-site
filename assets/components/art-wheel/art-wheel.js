(function () {
    function polar(radius, angle) {
        const a = (angle - 90) * Math.PI / 180;
        return [180 + radius * Math.cos(a), 180 + radius * Math.sin(a)];
    }
    function arcPath(r0, r1, a0, a1) {
        const [x0, y0] = polar(r1, a0), [x1, y1] = polar(r1, a1);
        const [ix0, iy0] = polar(r0, a1), [ix1, iy1] = polar(r0, a0);
        const laf = (a1 - a0) > 180 ? 1 : 0;
        return `M ${x0} ${y0} A ${r1} ${r1} 0 ${laf} 1 ${x1} ${y1} L ${ix0} ${iy0} A ${r0} ${r0} 0 ${laf} 0 ${ix1} ${iy1} Z`;
    }
    const norm = d => (d % 360 + 360) % 360;

    function init(root) {
        const src = root.dataset.src || 'art-elements.json';
        fetch(src).then(r => r.json()).then(data => {
            const items = data.items || [];
            const svg = root.querySelector('svg.wheel');
            const g = root.querySelector('#wheel');
            const step = 360 / items.length;
            const inner = 60, outer = 170;

            g.innerHTML = '';
            items.forEach((it, i) => {
                const a0 = i * step, a1 = (i + 1) * step;
                const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                p.setAttribute('d', arcPath(inner, outer, a0, a1));
                p.setAttribute('fill', 'rgba(0,0,0,0.08)');
                p.setAttribute('stroke', '#bbb');
                p.dataset.index = i;
                p.addEventListener('click', () => spinToIndex(i));
                g.appendChild(p);

                const mid = a0 + step / 2;
                const [lx, ly] = polar((inner + outer) / 2, mid);
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', lx);
                text.setAttribute('y', ly);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('font-size', '12');
                text.textContent = it.title;
                g.appendChild(text);
            });

            const title = root.querySelector('.aw-title');
            const desc = root.querySelector('.aw-desc');
            const prompt = root.querySelector('.aw-prompt em');

            let rotation = 0;
            function setRotation(deg) {
                rotation = deg;
                g.setAttribute('transform', `rotate(${rotation} 180 180)`);
                updatePanel();
            }
            function currentIndex() {
                const idx = Math.round((-rotation) / step);
                return ((idx % items.length) + items.length) % items.length;
            }
            function updatePanel() {
                const it = items[currentIndex()];
                if (!it) return;
                title.textContent = it.title; desc.textContent = it.desc; prompt.textContent = it.prompt;
            }

            root.querySelector('.aw-left').addEventListener('click', () => spinBy(-1));
            root.querySelector('.aw-right').addEventListener('click', () => spinBy(+1));
            root.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') { e.preventDefault(); spinBy(-1); }
                if (e.key === 'ArrowRight') { e.preventDefault(); spinBy(+1); }
            });

            function spinBy(steps) { spinToRotation(rotation + steps * step); }
            function spinToIndex(i) { spinToRotation(-i * step); }

            function spinToRotation(target) {
                const start = rotation;
                let delta = norm(target) - norm(start);
                if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
                const dur = 300; let t0 = null;
                function frame(ts) {
                    if (!t0) t0 = ts;
                    const p = Math.min(1, (ts - t0) / dur);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setRotation(start + delta * ease);
                    if (p < 1) requestAnimationFrame(frame); else setRotation(Math.round(rotation / step) * step);
                }
                requestAnimationFrame(frame);
            }

            let dragging = false, cx = 0, cy = 0, lastA = 0, lastTs = 0, velocity = 0;
            function angleFromEvent(e) {
                const rect = svg.getBoundingClientRect();
                cx = rect.left + rect.width / 2; cy = rect.top + rect.height / 2;
                const a = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI + 90;
                return norm(a);
            }
            svg.addEventListener('pointerdown', (e) => {
                // Prevent default touch behaviors that cause page scrolling
                e.preventDefault();
                
                dragging = true; svg.setPointerCapture(e.pointerId);
                lastA = angleFromEvent(e); lastTs = e.timeStamp; velocity = 0;
                
                // Disable page scrolling during wheel interaction
                document.body.style.overflow = "hidden";
                document.documentElement.style.overflow = "hidden";
                document.body.style.userSelect = "none";
            });
            svg.addEventListener('pointermove', (e) => {
                if (!dragging) return;
                
                // Prevent default touch behaviors during dragging
                e.preventDefault();
                
                const a = angleFromEvent(e);
                let delta = a - lastA; if (delta > 180) delta -= 360; if (delta < -180) delta += 360;
                setRotation(rotation + delta);
                const dt = e.timeStamp - lastTs; if (dt > 0) { const v = (delta / dt) * 1000; velocity = 0.8 * velocity + 0.2 * v; }
                lastA = a; lastTs = e.timeStamp;
            });
            function endDrag(e) {
                if (!dragging) return; 
                dragging = false; 
                try { svg.releasePointerCapture(e.pointerId); } catch (_) {/*noop*/ }
                
                // Re-enable page scrolling
                document.body.style.overflow = "";
                document.documentElement.style.overflow = "";
                document.body.style.userSelect = "";
                
                let v = velocity; const friction = 0.95;
                function tick() {
                    if (Math.abs(v) < 5) { setRotation(Math.round(rotation / step) * step); return; }
                    setRotation(rotation + v / 60); v *= friction; requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            }
            svg.addEventListener('pointerup', endDrag);
            svg.addEventListener('pointercancel', endDrag);
            
            // Additional touch event prevention for better mobile support
            svg.addEventListener('touchstart', function(e) {
                e.preventDefault();
            }, { passive: false });
            
            svg.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
            
            svg.addEventListener('touchend', function(e) {
                e.preventDefault();
            }, { passive: false });

            setRotation(0);
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.artwheel').forEach(init);
    });
})();


