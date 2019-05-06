import { ApiService } from "./apiService";

const appCode = process.env.VUE_APP_EAUTH_APP_CODE;
const serviceUrl = process.env.VUE_APP_API_BASE;

const AppsService = {
  userAppsRegister(body = null, response = null) {
    return new Promise((resolve, reject) => {
      const isValid = body && !!body.project;

      if (isValid) {
        const routeApp = "users";
        const options = {
          method: "POST",
          headers: { Authorization: `Bearer ${appCode}` },
          data: {
            user: {
              _id: response.data.user._id,
              username: response.data.user.username
            },
            apps: body.project
          },
          url: `${serviceUrl}/${routeApp}`
        };
        ApiService.customRequest(options)
          .then(response => {
            if (response) {
              return resolve(response);
            }
          })
          .catch(err => {
            return reject(err);
          });
      }
    });
  }
};

export { AppsService };
