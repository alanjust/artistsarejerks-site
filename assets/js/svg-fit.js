(function () {
    const stage = document.getElementById('stage');
    const scroller = document.getElementById('svgScroller');
    const art = document.getElementById('art');

    function getViewportHeight() {
        if (window.visualViewport && window.visualViewport.height) {
            return window.visualViewport.height;
        }
        return window.innerHeight;
    }

    function getAspectRatio(svg) {
        try {
            const vb = svg.viewBox.baseVal;
            if (vb && vb.width && vb.height && vb.height > 0) {
                return vb.width / vb.height;
            }
        } catch (_) { }
        return 16 / 9;
    }

    function layout() {
        if (!scroller || !art) return;

        const headerEl = document.querySelector('header, .site-header, #site-header');
        const footerEl = document.querySelector('footer, .site-footer, #site-footer');

        const viewportH = getViewportHeight();
        const headerH = headerEl ? headerEl.offsetHeight : 0;
        const footerH = footerEl ? footerEl.offsetHeight : 0;
        const availH = Math.max(0, viewportH - headerH - footerH);

        if (stage) stage.style.height = availH + 'px';
        scroller.style.height = availH + 'px';

        // Compute width from aspect, then cap it
        const A = getAspectRatio(art);
        const H = availH;              // define before use
        const MAX_W = 1440;            // cap for wide viewports
        const naturalW = Math.ceil(A * H);
        const targetW = Math.min(MAX_W, naturalW);

        art.style.height = H + 'px';
        art.style.width = targetW + 'px';

        // If wider than viewport, center the scroll; else CSS centers via #svgRack
        const scrollerWidth = scroller.clientWidth;
        if (scrollerWidth > 0) {
            const artWidth = art.getBoundingClientRect().width || targetW;
            const excess = artWidth - scrollerWidth;
            scroller.scrollLeft = excess > 0 ? excess / 2 : 0;
        }
    }

    let rafId = null;
    function onResize() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(layout);
    }

    window.addEventListener('load', onResize, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) onResize(); });
    if (document.fonts && document.fonts.addEventListener) {
        document.fonts.addEventListener('loadingdone', onResize);
    }
    if (window.visualViewport && window.visualViewport.addEventListener) {
        window.visualViewport.addEventListener('resize', onResize, { passive: true });
    }

    onResize();
})();
