<template>
  <div class="editor">
    <v-card :color="cardColor" flat tile>
      <transition
        mode="out-in"
        enter-active-class="animated faster fadeIn"
        leave-active-class="animated faster fadeOut"
      >
        <editor-menu-bar v-if="editable" class="pa-0" :editor="editor">
          <v-card-title
            class="menubar"
            slot-scope="{ commands, isActive }"
            :style="cardTitleColor"
          >
            <v-layout row wrap align-start justify-start pt-1>
              <v-flex shrink px-1 mx-0 py-0>
                <v-btn-toggle v-model="styling" multiple class="transparent">
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.bold() }"
                        @click="commands.bold"
                      >
                        <v-icon>format_bold</v-icon>
                      </v-btn>
                    </template>
                    <span>Bold</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.italic() }"
                        @click="commands.italic"
                      >
                        <v-icon>format_italic</v-icon>
                      </v-btn>
                    </template>
                    <span>Italicize</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.strike() }"
                        @click="commands.strike"
                      >
                        <v-icon>format_strikethrough</v-icon>
                      </v-btn>
                    </template>
                    <span>Strikethrough</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.underline() }"
                        @click="commands.underline"
                      >
                        <v-icon>format_underline</v-icon>
                      </v-btn>
                    </template>
                    <span>Underline</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.code() }"
                        @click="commands.code"
                      >
                        <v-icon>code</v-icon>
                      </v-btn>
                    </template>
                    <span>Code snippet</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.code_block() }"
                        @click="commands.code_block"
                      >
                        <v-icon>settings_ethernet</v-icon>
                      </v-btn>
                    </template>
                    <span>Code block</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.link() }"
                        @click="commands.link"
                      >
                        <v-icon>insert_link</v-icon>
                      </v-btn>
                    </template>
                    <span>Hyperlink</span>
                  </v-tooltip>
                  <v-divider vertical></v-divider>
                </v-btn-toggle>
              </v-flex>

              <v-flex shrink px-1 mx-0 py-0>
                <v-btn-toggle v-model="headings" class="transparent">
                  <v-btn
                    flat
                    small
                    :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                    @click="commands.heading({ level: 1 })"
                  >
                    H1
                  </v-btn>

                  <v-btn
                    flat
                    small
                    :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                    @click="commands.heading({ level: 2 })"
                  >
                    H2
                  </v-btn>

                  <v-btn
                    flat
                    small
                    :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                    @click="commands.heading({ level: 3 })"
                  >
                    H3
                  </v-btn>
                  <v-divider vertical></v-divider>
                </v-btn-toggle>
              </v-flex>

              <v-flex shrink px-1 mx-0 py-0>
                <v-btn-toggle v-model="formatting" class="transparent">
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.bullet_list() }"
                        @click="commands.bullet_list"
                      >
                        <v-icon>format_list_bulleted</v-icon>
                      </v-btn>
                    </template>
                    <span>Bulleted list</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.ordered_list() }"
                        @click="commands.ordered_list"
                      >
                        <v-icon>format_list_numbered</v-icon>
                      </v-btn>
                    </template>
                    <span>Numbered list</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.paragraph() }"
                        @click="commands.paragraph"
                      >
                        <v-icon>notes</v-icon>
                      </v-btn>
                    </template>
                    <span>Paragraph</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        :class="{ 'is-active': isActive.blockquote() }"
                        @click="commands.blockquote"
                      >
                        <v-icon>format_quote</v-icon>
                      </v-btn>
                    </template>
                    <span>Blockquote</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        class="menubar__button"
                        @click="commands.horizontal_rule"
                      >
                        <v-icon>border_horizontal</v-icon>
                      </v-btn>
                    </template>
                    <span>Horizontal rule</span>
                  </v-tooltip>
                  <v-divider vertical></v-divider>
                </v-btn-toggle>
              </v-flex>

              <v-flex shrink px-1 mx-0 py-0>
                <v-btn-toggle v-model="editorActions" class="transparent">
                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        class="menubar__button"
                        @click="commands.undo"
                      >
                        <v-icon>undo</v-icon>
                      </v-btn>
                    </template>
                    <span>Undo</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template #activator="data">
                      <v-btn
                        flat
                        small
                        v-on="data.on"
                        class="menubar__button"
                        @click="commands.redo"
                      >
                        <v-icon>redo</v-icon>
                      </v-btn>
                    </template>
                    <span>Redo</span>
                  </v-tooltip>
                </v-btn-toggle>
              </v-flex>
            </v-layout>
          </v-card-title>
        </editor-menu-bar>
      </transition>

      <v-card-text class="pt-0 px-1">
        <editor-content class="editor__content" :editor="editor" />
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { Editor, EditorContent, EditorMenuBar } from "tiptap";
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
    EditorMenuBar
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
      default: "`test`"
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
