export default defineNuxtRouteMiddleware((to, from) => {
    // Check if the current navigation is a refresh
    if (process.client && from.path !== '/' && to.path === from.path) {

        return navigateTo('/');
    }

    // Other middleware logic can go here
});