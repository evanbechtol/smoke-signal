import { HeroService } from "../services/heroService";

export const heroMixin = {
  methods: {
    heroGetUserById(id) {
      return HeroService.heroGetUserById(id);
    },

    heroLogin(user) {
      return HeroService.heroLogin(user);
    },

    heroUpdateUser(user) {
      return HeroService.heroUpdateUser(user);
    },

    heroUpdateUserTeams(user) {
      return HeroService.heroUpdateUserTeams(user);
    }
  }
};
