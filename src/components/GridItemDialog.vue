<template>
  <v-dialog v-model="dialog" persistent :fullscreen="$vuetify.breakpoint.name === 'xs'" >
    <v-card v-if="item" :dark="isDark" :color="`accent ${darken}`">
      <v-card-title primary-title class="hildaLight space-small dark-l0 ma-0">
        {{ item.title }}
        <v-spacer></v-spacer>
        <v-btn color="primary"
               flat
               dark
               @click="cancel">
          <v-icon color="#f2f2f2">mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      
      <v-card-text>
        <v-container grid-list-md fluid>
          <v-layout wrap row>
            <v-flex xs12 sm6 d-flex>
              <v-layout column justify-center>
                <v-flex xs12 sm4>
                  <p class="mb-0">Rescuers</p>
                  <div class="mb-3">
                    <v-item-group multiple>
                      <v-item>
                        <v-chip close color="info" dark slot-scope="{ active, toggle }" :selected="active">
                          <v-avatar>
                            <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="Claudius">
                          </v-avatar>
                          Claudius Mort
                        </v-chip>
                      </v-item>
  
                      <v-item>
                        <v-chip close color="success" dark slot-scope="{ active, toggle }" :selected="active">
                          <v-avatar>
                            <img src="https://randomuser.me/api/portraits/women/31.jpg" alt="Fifi">
                          </v-avatar>
                          Fifi Trixiebell
                        </v-chip>
                      </v-item>
  
                      <v-item>
                        <v-chip close color="purple" dark slot-scope="{ active, toggle }" :selected="active">
                          <v-avatar>
                            <img src="https://randomuser.me/api/portraits/women/5.jpg" alt="Gertrude">
                          </v-avatar>
                          Gertrude Von Winkle
                        </v-chip>
                      </v-item>
  
                      <v-item>
                        <v-chip outline color="primary" dark slot-scope="{ active, toggle }" :selected="active">
                          <v-avatar>
                            <v-icon alt="add">add</v-icon>
                          </v-avatar>
                          I'll Rescue You!
                        </v-chip>
                      </v-item>
                    </v-item-group>
                  </div>
                  <v-divider></v-divider>
                </v-flex>
  
                <v-flex xs12 sm4>
                  <v-text-field box label="Cord Pulled By" type="text" v-model="item.name" readonly color="info"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box label="Application" type="text" v-model="item.app" readonly color="info"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box label="Duration" type="text" :value="computeDuration(item.openedOn)" readonly color="info"></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field box label="Category" type="text" v-model="item.category" readonly color="info"></v-text-field>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex xs12 sm6 align-self-center grow>
              <v-layout fill-height column align-center justify-center>
                <v-flex grow>
                  <div>
                    <v-img height="240" v-if="item.img"></v-img>
                    <v-img v-else height="240">
                      <v-icon size="240">image</v-icon>
                    </v-img>
                  </div>
                </v-flex>
              </v-layout>
            </v-flex>
            
            <v-flex xs12>
              <v-textarea color="info" box label="Issue Description" v-model="item.description"></v-textarea>
            </v-flex>
            
            <v-flex xs12>
              <div class="hildaLight space-small">Discussion
                <v-tooltip right>
                  <template #activator="data">
                    <v-btn icon :color="addingToDiscussion === true ? 'error' : 'success'" v-on="data.on" @click="addingToDiscussion = !addingToDiscussion"><v-icon>{{ addingToDiscussion === true ? "clear" : "create" }}</v-icon></v-btn>
                  </template>
                  <span>{{ addingToDiscussion === true ? "Cancel adding to discussion" : "Add to discussion"}}</span>
                </v-tooltip>
              </div>
              
              <v-divider></v-divider>
              
              <v-timeline align-top dense>
                <v-timeline-item color="pink"
                                 small>
                  <v-avatar slot="icon" size="40">
                    <img src="https://randomuser.me/api/portraits/women/31.jpg" alt="Fifi">
                  </v-avatar>
                  <v-layout pt-3>
                    <v-flex xs3 sm1>
                      <strong>5pm</strong>
                    </v-flex>
                    <v-flex>
                      <strong>New Icon</strong>
                      <div class="caption">Mobile App</div>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
                
                <v-timeline-item
                        color="teal lighten-3"
                        small>
                  <v-avatar slot="icon" size="40">
                    <img src="https://randomuser.me/api/portraits/men/35.jpg" alt="Claudius">
                  </v-avatar>
                  <v-layout wrap pt-3>
                    <v-flex xs3 sm1>
                      <strong>3-4pm</strong>
                    </v-flex>
                    <v-flex>
                      <strong>Design Stand Up</strong>
                      <div class="caption mb-2">Hangouts</div>
                      <v-avatar>
                        <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairFrida&accessoriesType=Kurt&hairColor=Red&facialHairType=BeardLight&facialHairColor=BrownDark&clotheType=GraphicShirt&clotheColor=Gray01&graphicType=Skull&eyeType=Wink&eyebrowType=RaisedExcitedNatural&mouthType=Disbelief&skinColor=Brown"></v-img>
                      </v-avatar>
                      <v-avatar>
                        
                        <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Prescription02&hairColor=Black&facialHairType=MoustacheMagnum&facialHairColor=BrownDark&clotheType=BlazerSweater&clotheColor=Black&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Tanned"></v-img>
                      </v-avatar>
                      <v-avatar>
                        <v-img src="https://avataaars.io/?avatarStyle=Circle&topType=LongHairMiaWallace&accessoriesType=Sunglasses&hairColor=BlondeGolden&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=RaisedExcited&mouthType=Smile&skinColor=Pale"></v-img>
                      </v-avatar>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
                
                <v-timeline-item
                        color="pink"
                        small>
                  <v-avatar slot="icon" size="40">
                    <img src="https://randomuser.me/api/portraits/women/5.jpg" alt="Gertrude">
                  </v-avatar>
                  <v-layout pt-3>
                    <v-flex xs3 sm1>
                      <strong>12pm</strong>
                    </v-flex>
                    <v-flex>
                      <strong>Lunch break</strong>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
                
                <v-timeline-item
                        color="teal lighten-3"
                        small>
                  <v-avatar slot="icon" size="40">
                    <img src="https://randomuser.me/api/portraits/men/10.jpg" alt="Evan">
                  </v-avatar>
                  <v-layout pt-3>
                    <v-flex xs3 sm1>
                      <strong>9-11am</strong>
                    </v-flex>
                    <v-flex>
                      <strong>Finish Home Screen</strong>
                      <div class="caption">Web App</div>
                    </v-flex>
                  </v-layout>
                </v-timeline-item>
              </v-timeline>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="cancel">Cancel</v-btn>
        <v-btn color="blue darken-1" flat @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { assetMixin } from "../mixins/assetMixin.js";

export default {
  name: "GridItemDialog",
  mixins: [themeMixin, assetMixin],
  components: {},
  computed: {},
  data: function() {
    return {
      addingToDiscussion: false,
      dialog: this.initialDialog,
      localItem: this.item
    };
  },
  methods: {
    cancel() {
      this.$emit("cancelItemEdit");
    },
    computeDuration(date) {
      const now = new Date();
      const openedOn = new Date(date);
      return msToTime(parseInt((now - openedOn) / 24));
    },
    save() {
      //Todo: save the stuff
      Object.assign(this.desserts[this.editedIndex], this.editedItem);
    }
  },
  props: ["initialDialog", "item"],
  watch: {
    initialDialog: function() {
      this.dialog = this.item;
    }
  }
};

function msToTime(duration) {
  let milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
</script>

<style scoped>
</style>
