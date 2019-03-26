<template>
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
      <v-list two-line class="list-width">
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
              v-if="index + 2 < notifications.length"
              :key="index"
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
import notificationBell from 'vue-notification-bell'

export default {
  name: 'ToolNotification',   
  components: { notificationBell },
  mixins: [authMixin, themeMixin, notificationMixin, cordMixin, alertMixin, socketMixin, TimeService],
  data() {
    return {      
	  notify_user: {},
	  notifications: [],
	  notificationCount:0
    };
  },
  methods: {	
	computeDuration: TimeService.computeDuration,
	msToTime: TimeService.msToTime,
    getNotifyList() {
	 if(this.user!=null){
     		const query = {
			   notify_receiver: { _id: this.user._id, username: this.user.username }, read_timestamp: null
			};	
		    const limit = 5;
			const skip = 0;
			this.getNotifications(limit, skip, JSON.stringify(query))
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
	appToken: function(value) {
      if (value!=null) {
		  const _this = this; 
		  window.setTimeout(_this.getNotifyList, 1000);		
      }
    }
  }
   
}
</script>

<style scoped>
.list-width{
   max-width:500px
}
</style>
