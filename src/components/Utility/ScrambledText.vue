<template>
  <span ref="text"></span>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
// ——————————————————————————————————————————————————
// TextScramble
// https://codepen.io/soulwire/pen/mErPAK
// ——————————————————————————————————————————————————

class TextScramble {
  resolve?: (value?: unknown) => void;
  chars: string;
  queue: {
    from: string;
    to: string;
    start: number;
    end: number;
    char?: string;
  }[] = [];
  frame = 0;
  frameRequest?: number;
  constructor(public el: HTMLSpanElement) {
    this.el = el;
    this.chars = '!<>-_\\/[]{}—=+*^?#________';
    // this.chars = "sjhgysfdsnxjksjdhgsdhsjkdjnbvcxsdafsjpo";
    this.update = this.update.bind(this);
  }
  setText(newText: string) {
    newText = newText || '';
    const oldText = this.el.innerText;
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || '';
      const to = newText[i] || '';
      const start = Math.floor(Math.random() * 40);
      const end = start + Math.floor(Math.random() * 40);
      this.queue.push({from, to, start, end});
    }
    cancelAnimationFrame(this.frameRequest as number);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = '';
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let {from, to, start, end, char} = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar();
          this.queue[i].char = char;
        }
        output += `<span>${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      // @ts-expect-error For TypeScript, this could be undefined
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

export default defineComponent({
  components: {},
  props: {
    text: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fx: null,
    } as {
      fx: TextScramble | null;
    };
  },
  computed: {},
  watch: {
    text: 'updateText',
  },
  mounted() {
    const el = this.$refs.text as HTMLSpanElement;
    this.fx = new TextScramble(el);
    this.updateText(this.text);
  },
  methods: {
    updateText(text: string) {
      (this.fx as TextScramble).setText(text);
    },
  },
});
</script>
