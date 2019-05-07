<template>
  <v-menu offset-y v-if="user && user.username && notifications.length">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">
        <v-badge right color="red" overlap>
          <template v-slot:badge>
            <span>{{ notificationCount }}</span>
          </template>
          <v-icon color="white lighten-1">
            notifications
          </v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-container fluid ma-0 pa-0 fill-height>
      <v-layout row>
        <v-flex xs12>
          <v-list two-line class="list-width">
            <v-subheader v-if="!notifications.length">
              No notifications
            </v-subheader>

            <template v-for="(item, index) in notifications">
              <v-list-tile
                :key="`tile-${index}`"
                avatar
                @click="callOpenItem(item)"
              >
                <v-list-tile-avatar>
                  <v-icon size="40">perm_identity</v-icon>
                </v-list-tile-avatar>

                <v-list-tile-content xs12 sm6>
                  <v-list-tile-title
                    v-html="item.subject + ' by ' + item.createdBy.username"
                  ></v-list-tile-title>
                  <v-list-tile-sub-title
                    xs12
                    sm6
                    v-html="item.cord.app + ' - ' + item.cord.title"
                  ></v-list-tile-sub-title>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-list-tile-action-text
                    >{{ computeDuration(item.createdTimeStamp) }}
                  </v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>

              <v-divider
                v-if="index + 1 < notifications.length"
                :key="`divider-${index}`"
              ></v-divider>
            </template>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
  </v-menu>
</template>
<script>
// Importing Component
import { themeMixin } from "../mixins/themeMixin.js";
import { authMixin } from "../mixins/authMixin.js";
import { notificationMixin } from "../mixins/notificationMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { socketMixin } from "../mixins/socketMixin";
import { TimeService } from "../services/timeService";

export default {
  name: "ToolNotification",
  mixins: [
    authMixin,
    themeMixin,
    notificationMixin,
    cordMixin,
    alertMixin,
    socketMixin,
    TimeService
  ],
  computed: {
    hasMultipleNotifications() {
      return this.notifications.length > 1;
    }
  },
  data() {
    return {
      notify_user: {},
      notifications: [],
      notificationCount: 0,
      limit: 50,
      skip: 0
    };
  },

  methods: {
    computeDuration: TimeService.computeDuration,
    msToTime: TimeService.msToTime,
    getNotifyList() {
      if (this.user) {
        const query = {
          notifyReceiver: { _id: this.user._id, username: this.user.username },
          readTimeStamp: null
        };
        if (this.appToken) {
          const _this = this;
          this.getNotifications(this.limit, this.skip, JSON.stringify(query))
            .then(response => {
              const data = response.data.data.map(elem => {
                elem.header = true;
                return elem;
              });

              data.forEach(elem => {
                _this.notifications.push(elem);
              });

              _this.notificationCount = _this.notifications.length;
              _this.$store.commit("cordPullNotification", false);
            })
            .catch(err => {
              this.setAlert(err, "#DC2D37", 0);
            });
        }
      }
    },
    callOpenItem(item) {
      this.openItem(item.cord);
      //update status of notification
      const query = {
        notifyReceiver: { _id: this.user._id, username: this.user.username },
        readTimeStamp: null
      };
      this.updateNotification(
        item._id,
        this.limit,
        this.skip,
        JSON.stringify(query)
      )
        .then(updateResponse => {
          this.notifications = updateResponse.data.data;
          this.notificationCount = this.notifications.length;
          this.notifications.unshift({ header: true });
        })
        .catch(err => {
          this.setAlert(err, "#DC2D37", 0);
        });
    },
    _shouldShowItem(item) {
      return item.app && item.createdBy && item.cord && item.createdTimeStamp;
    }
  },
  watch: {
    appToken: function(value) {
      if (value) {
        const _this = this;
        window.setTimeout(_this.getNotifyList, 1000);
      }
    },

    cordPullNotification: function(value) {
      if (value) {
        this.getNotifyList();
      }
    }
  }
};
</script>

<style scoped>
.list-width {
  max-width: 500px;
  min-width: 300px;
  max-height: 300px;
  overflow-y: auto;
}
</style>
