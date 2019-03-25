<template>
  <div>
    <v-toolbar v-bind:color="color" dark app>
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
        style="margin: 8px;"
      ></v-toolbar-side-icon>
      <v-toolbar-title class="space-base" style="margin: 8px;">
        <router-link class="link white--text" to="/">
          AnA Smoke Signals
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
	  
	  
	  <!--Bell notification-->	
	
	<v-menu offset-y v-if="user && user.username">
      <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >
		<!--<Bellnotification />-->
		<notification-bell
		:size="30"
		:count="notificationCount" 
		counterLocation="upperRight"
		counterStyle="round"
		counterBackgroundColor="#ff0000"
		counterTextColor="#FFFFFF"
		iconColor="#FFFFFF"
		:animated="true"
		/> 
        </v-btn>
      </template>
	  <v-container fluid ma-0 pa-0 fill-height>
        <v-layout row>         
		  <v-flex xs12> 
      <v-list two-line style="max-width:500px">
          <template v-for="(item, index) in notifications">
            <v-subheader
              v-if="item.header"
              :key="item.header"
            >
              Notifications
            </v-subheader>

             

            <v-list-tile
              v-else
              :key="item._id"
              avatar
              @click="openItem(item)"
            >
              <v-list-tile-avatar>
				<v-icon size="40">perm_identity</v-icon>
              </v-list-tile-avatar>
			   
              <v-list-tile-content  xs12 sm6>
                <v-list-tile-title v-html="item.subject +' by ' + item.created_by.username"></v-list-tile-title>
                <v-list-tile-sub-title  xs12 sm6  v-html="item.app + ' - ' + item.title"></v-list-tile-sub-title>
              </v-list-tile-content>
			    
			  
			  <v-list-tile-action>
                <v-list-tile-action-text>{{ computeDuration(item.created_timestamp) }} </v-list-tile-action-text>                 
              </v-list-tile-action> 
			  
			  
            </v-list-tile>
			
			<v-divider
              v-if="index + 2 < items.length"
              :key="index"
            ></v-divider>
			
          </template>
      </v-list>
	            
		  </v-flex> 
 
        </v-layout>		   
		</v-container>
    </v-menu>
	  
	  
      <v-btn
        v-if="user && user.username"
        flat
        @click.stop="rightDrawer = !rightDrawer"
        style="margin: 8px;"
        class="mr-2 px-5"
      >
        <v-icon class="mr-3">perm_identity</v-icon>
        {{ user.username }}
      </v-btn>
    </v-toolbar>

    <!-- LEFT DRAWER -->
    <v-navigation-drawer
      v-model="drawer"
      class="nav"
      :style="{ backgroundColor: '#0c0c0c' }"
      :mini-variant="mini"
      app
      dark
      temporary
    >
      <v-list class="pt-0">
        <v-list-tile-title class="ml-3 my-4">
          <p class="hildaLight">Menu</p>
        </v-list-tile-title>
        <v-divider></v-divider>
        <v-list-tile
          v-for="item in items"
          :key="item.title"
          active-class="dark-info"
          :to="{ path: item.path }"
        >
          <v-list-tile-content class="ml-1">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
	
	
    <!-- RIGHT DRAWER -->
    <v-navigation-drawer
      v-if="user"
      right
      v-model="rightDrawer"
      class="nav"
      :style="{ backgroundColor: '#0c0c0c' }"
      :mini-variant="mini"
      app
      dark
      temporary
    >
      <v-layout column fill-height align-space-around justify-center>
	  
        <v-flex xs12 mt-5 shrink>
          <v-layout column align-space-around justify-center mt-4>
            <v-flex xs12 text-xs-center>
              <v-icon size="100">perm_identity</v-icon>
            </v-flex>
            <v-flex xs12 class="hildaLight white--text" text-xs-center>
              {{ user.username }}
            </v-flex>
            <v-flex xs12>
              <jwt-expiry
                v-if="isAuthenticated && token"
                :expiry-details="expiryDetails"
              ></jwt-expiry>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>

          <v-flex xs12 ml-3 mt-3>
            <p class="hildaLight white--text">My Settings</p>
          </v-flex>

          <v-flex xs12>
            <v-layout row align-center justify-start>
              <v-flex xs6 class="white--text" ml-3>Switch Theme</v-flex>
              <v-flex xs6>
                <v-switch
                  v-model="themeSwitch"
                  :label="switchLabel"
                  :dark="isDark"
                  :color="isDark ? 'accent darken-1' : 'info'"
                ></v-switch>
              </v-flex>
            </v-layout>
            <v-divider light></v-divider>
          </v-flex>

          <v-flex xs12 ml-3 mt-3>
            <p class="hildaLight white--text mb-4">User Details</p>
            <v-layout column align-start justify-start>
              <v-flex xs12 mb-0 shrink>
                <p class="subheading">
                  Signum
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">{{ user.username }}</p>
              </v-flex>

              <v-flex xs12 mb-0 shrink>
                <p class="subheading">
                  Name
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">
                  {{ user.firstname }} {{ user.lastname }}
                </p>
              </v-flex>

              <v-flex xs12 mb-0 shrink>
                <p class="subheading">
                  Email
                </p>
              </v-flex>
              <v-flex xs12 mt-0 class="userDetail">
                <p class="white--text">{{ user.email }}</p>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs12 align-self-center mt-5>
            <v-btn block outline @click="logout">
              Sign Out
            </v-btn>
          </v-flex>
        </v-flex>
      </v-layout>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { themeMixin } from "../mixins/themeMixin.js";
import { authMixin } from "../mixins/authMixin.js";
import { notificationMixin } from "../mixins/notificationMixin.js";
import { cordMixin } from "../mixins/cordMixin.js";
import { alertMixin } from "../mixins/alertMixin.js";
import { socketMixin } from "../mixins/socketMixin";
import { TimeService } from "../services/timeService";
import JwtExpiry from "./JWTExpiry";
import notificationBell from 'vue-notification-bell'

export default {
  name: "toolbar",
  components: { JwtExpiry, notificationBell },
  mixins: [authMixin, themeMixin, notificationMixin, cordMixin, alertMixin, socketMixin, TimeService],
  props: {
    color: String
  },
  computed: {
    switchLabel: function() {
      return this.isDark ? "Dark" : "Light";
    }
  },
  data() {
    return {
      themeSwitch: true,
      rightDrawer: false,
      drawer: null,
	  notificationCount: 0,
	  notify_user: {},
      mini: false,
      right: null,	  
      items: [
        {
          title: "Dashboard",
          icon: "dashboard",
          path: "/"
        },
        {
          title: "Resolved Cords",
          icon: "assignment_turned_in",
          path: "/resolved"
        },
        { title: "Admin", icon: "settings", path: "/admin" },
        { title: "My Profile", icon: "settings", path: "/profile" }
      ],
	  notifications: [],
      themes: [
        { label: "Dark", value: "dark" },
        { label: "Light", value: "light" }
      ]
    };
  },
  created() {
    this.themeSwitch = this.theme === "light";
    if (!this.isExpiryIntervalSet) {
      const _this = this;
      setInterval(function() {
        _this.setExpiry();
      }, 60000);
      this.$store.commit("isExpiryIntervalSet", true);
    }
  },
  methods: {
	computeDuration: TimeService.computeDuration,
	msToTime: TimeService.msToTime,
    toggleTheme(value) {
      this.$store.commit("theme", value.toLowerCase());
    },
    getNotifyList() {
	 if(this.user!=null){
		  const query = {
			notify_receiver: { _id: this.user._id, username: this.user.username }, read_timestamp: null
		  };	
			this.getNotifications(5, 0, JSON.stringify(query))
			.then(response => {
			   this.notifications = response.data.data.notificationList;
			   this.notificationCount = response.data.data.notificationCount;		   
			})
			.catch(err => {
			  this.setAlert(err, "#DC2D37", 0);
			});
		}
    },
	openItem(item) {
      this.getCordById(item.cord._id)
        .then(response => {
          const cord = response.data.data;
		  
		  //update status of notification		   
		  const query = {
		    notify_receiver: { _id: this.user._id, username: this.user.username }, read_timestamp: null
		  }
		  this.updateNotification(item._id, 5, 0, JSON.stringify(query))
		  .then(updateResponse => { 
		     this.notifications = updateResponse.data.data.notificationList;
		     this.notificationCount = updateResponse.data.data.notificationCount;		   
		  })
		  .catch(err => {
		     this.setAlert(err, "#DC2D37", 0);
		  });
		   
          this.$store.commit("selectedCord", cord);
          this.$router.push({ path: `/cord/${cord._id}`, props: cord });
          this.joinSelectedCordRoom(cord._id);
		   
          return this.validateUser();
        })
        .then(validationResponse => {
          this.$store.commit("token", validationResponse.data.token || null);
          this.setExpiry();
          this.loading = false;		  
		   
        })
        .catch(err => {
          this.setAlert(err.message, "#DC2D37", 0);
        });
    }  
	
  },
  watch: {
    themeSwitch: function(value) {
      this.toggleTheme(value ? "light" : "dark");
    },
	appToken: function(value) {
      if (value!=null) {
		  const _this = this; 
		  window.setTimeout(_this.getNotifyList, 1000);		
      }
    }
  },
  mounted() {
        //..console.log('default methos');
		//this.getNotifyList();
  }
};
</script>

<style scoped>
.link {
  display: grid;
  grid-template-rows: auto;
  justify-items: center;
  align-items: center;
  text-decoration: none;
  height: 100%;
}

#select {
  width: 300px !important;
}

#selectContainer {
  padding: 0 0 !important;
}

.menuIcon {
  position: relative;
  top: 8px;
}

.userDetail {
  position: relative;
  top: -10px;
}
</style>
