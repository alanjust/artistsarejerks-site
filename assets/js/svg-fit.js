(function () {
    const scroller = document.getElementById('svgScroller');
    const art = document.getElementById('art');

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

        // Get full viewport height - SVG should fill entire space
        const vh = window.innerHeight;

        // Set scroller height to full viewport
        scroller.style.height = vh + 'px';

        // Compute width from aspect, then cap it
        const A = getAspectRatio(art);
        const H = vh; // Use full viewport height
        const MAX_W = 1440;            // cap for wide viewports
        const naturalW = Math.ceil(A * H);
        const targetW = Math.min(MAX_W, naturalW);

        art.style.height = H + 'px';
        art.style.width = targetW + 'px';

        // Set the rack width to match the SVG width for proper scrolling
        const rack = document.getElementById('svgRack');
        if (rack) {
            rack.style.width = targetW + 'px';
        }

        // Always center the SVG horizontally on load/refresh
        const scrollerWidth = scroller.clientWidth;
        if (targetW > scrollerWidth) {
            // SVG is wider than viewport - center it by scrolling
            const centerOffset = (targetW - scrollerWidth) / 2;
            scroller.scrollLeft = centerOffset;
        } else {
            // SVG fits in viewport - center it
            const centerOffset = (scrollerWidth - targetW) / 2;
            scroller.scrollLeft = centerOffset;
        }
        
        // Ensure centering happens after a small delay for proper rendering
        setTimeout(() => {
            if (targetW > scrollerWidth) {
                const centerOffset = (targetW - scrollerWidth) / 2;
                scroller.scrollLeft = centerOffset;
            } else {
                const centerOffset = (scrollerWidth - targetW) / 2;
                scroller.scrollLeft = centerOffset;
            }
        }, 100);
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
    
    // Additional centering on DOM ready to ensure proper initial positioning
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(onResize, 100); // Small delay to ensure everything is rendered
        });
    } else {
        setTimeout(onResize, 100);
    }
})();