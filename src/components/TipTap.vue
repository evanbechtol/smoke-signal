<template>
  <div class="editor">
    <v-card :color="cardColor" flat tile>
      <transition
        mode="out-in"
        enter-active-class="animated faster fadeIn"
        leave-active-class="animated faster fadeOut"
      >
        <editor-menu-bar v-if="editable" class="pa-0" :editor="editor">
          <div
            class="menubar"
            style="width: 100%;"
            slot-scope="{ commands, isActive }"
            :style="cardTitleColor"
          >
            <v-layout row wrap align-center justify-start>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.bold() }"
                      @click="commands.bold"
                    >
                      <v-icon>format_bold</v-icon>
                    </button>
                  </template>
                  <span>Bold</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.italic() }"
                      @click="commands.italic"
                    >
                      <v-icon>format_italic</v-icon>
                    </button>
                  </template>
                  <span>Italicize</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.strike() }"
                      @click="commands.strike"
                    >
                      <v-icon>format_strikethrough</v-icon>
                    </button>
                  </template>
                  <span>Strikethrough</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.underline() }"
                      @click="commands.underline"
                    >
                      <v-icon>format_underline</v-icon>
                    </button>
                  </template>
                  <span>Underline</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.code() }"
                      @click="commands.code"
                    >
                      <v-icon>code</v-icon>
                    </button>
                  </template>
                  <span>Code snippet</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      :class="{ 'is-active': isActive.code_block() }"
                      @click="commands.code_block"
                    >
                      <v-icon>settings_ethernet</v-icon>
                    </button>
                  </template>
                  <span>Code block</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <editor-menu-bubble
                  class="menububble"
                  :editor="editor"
                  @hide="hideLinkMenu"
                >
                  <div
                    slot-scope="{ getMarkAttrs, menu }"
                    class="menububble"
                    :class="{ 'is-active': menu.isActive }"
                    :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
                  >
                    <form
                      class="menububble__form"
                      v-if="linkMenuIsActive"
                      @submit.prevent="setLinkUrl(commands.link, linkUrl)"
                    >
                      <v-tooltip bottom>
                        <template #activator="data">
                          <label>
                            <input
                              class="menububble__input menu-link-input"
                              type="text"
                              v-model="linkUrl"
                              placeholder="https://www.yourUrl.com"
                              ref="linkInput"
                              @keydown.esc="hideLinkMenu"
                            />
                          </label>
                          <button
                            v-on="data.on"
                            type="button"
                            class="menububble__button"
                            @click="setLinkUrl(commands.link, null)"
                          >
                            <v-icon>clear</v-icon>
                          </button>
                        </template>
                        <span>{{
                          isActive.link() ? "Remove Link" : "Cancel"
                        }}</span>
                      </v-tooltip>
                    </form>

                    <template v-else>
                      <v-tooltip bottom>
                        <template #activator="data">
                          <button
                            v-on="data.on"
                            type="button"
                            class="menububble__button menu-btn"
                            @click="showLinkMenu(getMarkAttrs('link'))"
                            :class="{ 'is-active': isActive.link() }"
                          >
                            <v-icon>link</v-icon>
                          </button>
                        </template>
                        <span>{{
                          isActive.link() ? "Update Link" : "Add Link"
                        }}</span>
                      </v-tooltip>
                    </template>
                  </div>
                </editor-menu-bubble>
              </v-flex>
              <v-flex shrink py-0>
                <button
                  class="menu-btn"
                  type="button"
                  :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                  @click="commands.heading({ level: 1 })"
                >
                  H1
                </button>
              </v-flex>
              <v-flex shrink py-0>
                <button
                  class="menu-btn"
                  type="button"
                  :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                  @click="commands.heading({ level: 2 })"
                >
                  H2
                </button>
              </v-flex>
              <v-flex shrink py-0>
                <button
                  class="menu-btn"
                  type="button"
                  :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                  @click="commands.heading({ level: 3 })"
                >
                  H3
                </button>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menu-btn"
                      :class="{ 'is-active': isActive.bullet_list() }"
                      @click="commands.bullet_list"
                    >
                      <v-icon>format_list_bulleted</v-icon>
                    </button>
                  </template>
                  <span>Bulleted list</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menu-btn"
                      :class="{ 'is-active': isActive.ordered_list() }"
                      @click="commands.ordered_list"
                    >
                      <v-icon>format_list_numbered</v-icon>
                    </button>
                  </template>
                  <span>Numbered list</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menu-btn"
                      :class="{ 'is-active': isActive.paragraph() }"
                      @click="commands.paragraph"
                    >
                      <v-icon>notes</v-icon>
                    </button>
                  </template>
                  <span>Paragraph</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menu-btn"
                      :class="{ 'is-active': isActive.blockquote() }"
                      @click="commands.blockquote"
                    >
                      <v-icon>format_quote</v-icon>
                    </button>
                  </template>
                  <span>Blockquote</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      class="menubar__button menu-btn"
                      @click="commands.horizontal_rule"
                    >
                      <v-icon>border_horizontal</v-icon>
                    </button>
                  </template>
                  <span>Horizontal rule</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      style="opacity: 1;"
                      class="menubar__button menu-btn"
                      @click="commands.undo"
                    >
                      <v-icon>undo</v-icon>
                    </button>
                  </template>
                  <span>Undo</span>
                </v-tooltip>
              </v-flex>
              <v-flex shrink py-0>
                <v-tooltip bottom>
                  <template #activator="data">
                    <button
                      v-on="data.on"
                      type="button"
                      style="opacity: 1;"
                      class="menubar__button menu-btn"
                      @click="commands.redo"
                    >
                      <v-icon>redo</v-icon>
                    </button>
                  </template>
                  <span>Redo</span>
                </v-tooltip>
              </v-flex>
            </v-layout>
          </div>
        </editor-menu-bar>
      </transition>

      <v-card-text class="py-2 px-2">
        <editor-content class="editor__content" :editor="editor" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Heading,
  HorizontalRule,
  OrderedList,
  BulletList,
  ListItem,
  TodoItem,
  TodoList,
  Bold,
  Code,
  Italic,
  Link,
  Strike,
  Underline,
  History
} from "tiptap-extensions";
import { themeMixin } from "../mixins/themeMixin";
export default {
  name: "TipTap",

  mixins: [themeMixin],

  components: {
    EditorContent,
    EditorMenuBar,
    EditorMenuBubble
  },

  computed: {
    cardColor() {
      return this.editable ? "`secondary ${darken}`" : "transparent";
    },

    cardTitleColor() {
      const bgColor = this.isDark ? "#181818" : "#e0e0e0";
      return `background-color: ${bgColor}`;
    }
  },

  props: {
    content: {
      type: String,
      required: true,
      default: ""
    },

    editable: {
      type: Boolean,
      required: true,
      default: false
    }
  },

  data() {
    return {
      editor: new Editor({
        onUpdate: ({ getHTML }) => {
          this.$emit("contentChanged", getHTML());
        },

        extensions: [
          new Blockquote(),
          new BulletList(),
          new CodeBlock(),
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new HorizontalRule(),
          new ListItem(),
          new OrderedList(),
          new TodoItem(),
          new TodoList(),
          new Bold(),
          new Code(),
          new Italic(),
          new Link(),
          new Strike(),
          new Underline(),
          new History()
        ]
      }),
      styling: [],
      linkUrl: null,
      linkMenuIsActive: false,
      headings: undefined,
      formatting: undefined,
      editorActions: undefined
    };
  },

  created() {
    this.setContent();
    this.editor.setOptions({
      editable: this.editable
    });
  },

  beforeDestroy() {
    this.editor.destroy();
  },

  methods: {
    setContent() {
      this.editor.setContent(this.content);
    },
    showLinkMenu(attrs) {
      this.linkUrl = attrs.href;
      this.linkMenuIsActive = true;
      this.$nextTick(() => {
        this.$refs.linkInput.focus();
      });
    },

    hideLinkMenu() {
      this.linkUrl = null;
      this.linkMenuIsActive = false;
    },

    setLinkUrl(command, url) {
      command({ href: url });
      this.hideLinkMenu();
      this.editor.focus();
    }
  },

  watch: {
    content(value) {
      if (value.length >= 2) {
        this.$emit("contentChanged", value);
      } else {
        this.setContent(value);
      }
    },

    editable() {
      this.editor.setOptions({
        editable: this.editable
      });
    }
  }
};
</script>

<style scoped>
.menu-btn {
  width: 40px;
  height: 24px;
  opacity: 0.7;
}

.menu-link-input {
  border: 1px solid #0c0c0c;
  border-radius: 2px;
}

.is-active {
  background: rgba(0, 0, 0, 0.1);
}
</style>
