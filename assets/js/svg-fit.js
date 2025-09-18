(function () {
    const scroller = document.getElementById('svgScroller');
    const art = document.getElementById('art');

    function getAspectRatio(svg) {
        try {
            const vb = svg.viewBox.baseVal;
            if (vb && vb.height) return vb.width / vb.height;
        } catch (_) { }
        return 16 / 9;
    }

    function layout() {
        if (!scroller || !art) return;

        // Measure header/footer and flex middle
        const headerEl = document.querySelector('header, .site-header, #site-header');
        const footerEl = document.querySelector('footer, .site-footer, #site-footer');
        const container = document.querySelector('.main-content');

        const vh = window.innerHeight;
        const headerH = headerEl ? headerEl.offsetHeight : 0;
        const footerH = footerEl ? footerEl.offsetHeight : 0;

        // Use the larger of (vh - header - footer) vs. actual flex middle height
        const availH = Math.max(0, vh - headerH - footerH, container ? container.clientHeight : 0);

        // Lock the middle area height so 100% works predictably
        const stage = document.getElementById('stage');
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
        const excess = targetW - scroller.clientWidth;
        scroller.scrollLeft = excess > 0 ? excess / 2 : 0;
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
})();