import type { Ref } from "vue";
import { ref } from 'vue'

export function getScrollRef(offset: number): Ref<boolean> {
    let lastScrollTop = 0;
    let v = ref(true);
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY
            || document.documentElement.scrollTop
            || document.body.scrollTop;

        if (currentScroll > lastScrollTop + offset) {
            v.value = false;
        } else if (currentScroll < lastScrollTop - offset) {
            v.value = true;
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    }, false);
    return v;
}
