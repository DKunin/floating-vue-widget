<template>
    <div 
        class="fav-seller-holder">
        <div>
            <div v-if="loading" class="fav-seller-loading"><div>Loading</div></div>

            <div v-if="!loading && !favorites.length" class="fav-seller-loading">
                <div class="fav-seller-no-data">
                </div>
            </div>

            <ul v-if="!loading" class="fav-seller-list">
                <li class="fav-seller-list-item" v-for="singleFav in favorites">
                    <div>
                        <a :class="singleFav.currentProfile ? 'current-favorite' : ''" @click="openProfile(singleFav.key)">
                            {{singleFav.name}}
                        </a>
                        {{singleFav.items.length}}
                        <span @click="openLastOne(singleFav.newItems)" class="new-items" v-if="singleFav.newItems">
                            ({{singleFav.newItems ? singleFav.newItems.length : ''}})
                        </span>
                        <span @click="addToSeen(singleFav.key)" v-if="singleFav.newItems">
                            отм.
                        </span>

                    </div>

                    <button class="fav-seller-remove-button transparent-button" @click="removeFromFavorites(singleFav.key)">
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>ico-trash</title><path d="M4.6 8.006v9.988c0 .225.181.406.406.406h9.988a.405.405 0 0 0 .406-.406V8.006H4.6zM17 8v9.994A2.005 2.005 0 0 1 14.994 20H5.006A2.005 2.005 0 0 1 3 17.994V8H1.993A.994.994 0 0 1 1 7V4c0-.552.445-1 .993-1h16.014c.548 0 .993.444.993 1v3c0 .552-.445 1-.993 1H17zm-4.6-6.4H7.6V3H6V1.5C6 .672 6.668 0 7.505 0h4.99C13.326 0 14 .666 14 1.5V3h-1.6V1.6zm-9.8 3v1.8h14.8V4.6H2.6zm6.886 5.26h1v6.25h-1V9.86zM7 9.876h1v6.25H7v-6.25zm5 0h1v6.25h-1v-6.25z" fill-rule="nonzero" fill="#FB6162"/></svg>
                    </button>
                </li>
            </ul>
            <div class="fav-seller-footer">
                <small class="fav-seller-version-info" @dblclick="toggleDebug">{{package.version}}</small>
                <div v-if="debug" class="fav-seller-error-message">{{ error.message }}</div>
            </div>
        </div>
    </div>
</template>

<script>
const storage = require('./storage');
const storageChrome = require('../extention/scripts/src/storageChrome.es6');
const packageJson = require('../package.json');

export default {
    data: () => {
        return {
            loading: true,
            debug: false,
            error: { message: 'В Багдаде все спокойно' },
            favorites: [],
            package: packageJson
        };
    },
    methods: {
        // getProfileId() {
        //     const profileIdString = this.$parent.url.match(/\/\w+\/profile/g);
        //     const profileId = profileIdString ? profileIdString[0].replace('profile', '').replace(/\//g, '') : '';
        //     return profileId;
        // },
        async removeFromFavorites(key) {
            storageChrome.unSaveFavorite(key);
            const items = await storageChrome.getFavorites();
            this.$set(this, 'favorites', items);
        },
        openLastOne(lastOne) {
            const mainUrl = this.$parent.url.match(/https:\/\/.+\.ru/);
            this.$parent.loadTab(`${mainUrl[0]}${lastOne[0].url}`);
        },
        openProfile(key) {
            const mainUrl = this.$parent.url.match(/https:\/\/.+\.ru/);
            this.$parent.loadTab(`${mainUrl[0]}/user/${key}/profile`);
        },
        toggleDebug() {
            this.$set(this, 'debug', !this.debug);
            console.log(this.error);
        }
    },
    async mounted() {
        this.$parent.getCurrentUrl();
        const items = await storageChrome.getFavorites();
        this.$set(this, 'favorites', items);
        this.$set(this, 'loading', false);
    },
    beforeDestroy() {}
}
</script>

<style>
body {
    padding: 0;
}
.fav-seller-list {
    margin: 0;
    padding: 0;
}
.fav-seller-list-item
{
    border-left: 3px solid transparent;
    padding: 2px;
    display: flex;
    justify-content: space-between;
}

.fav-seller-list-item:nth-child(odd)
{
    background-color: #ecf0f1;
}

.fav-seller-holder
{
    font-family: PT Sans;
    z-index: 15;
    overflow: hidden;
    width: 250px;
    min-height: 400px;
}

.fav-seller-footer
{
    padding: 4px;
}

.fav-seller-version-info
{
    font-size: .8em;

    display: block;

    text-align: center;
}

.fav-seller-loading
{
    display: flex;

    min-height: 270px;

    justify-content: center;
    align-items: center;
}

.fav-seller-reload
{
    font-family: Lucida Sans Unicode;
    font-size: 20px;

    border: none;
}

.fav-seller-controls
{

    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.fav-seller-control
{
    color: white;
    background-color: #2c3e50;
}

.fav-seller-control:active
{
    background-color: #95a5a6;
}

.fav-seller-control:active,
.fav-seller-control:focus
{
    border: none;
    outline: none;
    box-shadow: none;
}

.fav-seller-no-data
{
    position: relative;

    opacity: .3;

    filter: grayscale(100%);
}
.fav-seller-no-data:before
{
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;

    content: 'no data';
    text-align: center;
}

.fav-seller-remove-button {
    opacity: 0;
    cursor: pointer;
}

.fav-seller-list-item:hover .fav-seller-remove-button {
    opacity: 1;
}

.transparent-button {
    border: none;
    background-color: transparent;
    outline: none;
}

.new-items {
    color: red;
}

.current-favorite {
    font-weight: bold;
}
</style>