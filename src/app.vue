<template>
    <div class="fav-seller-holder">

            <div v-if="!loading && !favorites.length" class="fav-seller-loading">
                <div class="fav-seller-no-data"></div>
            </div>

            <ul v-if="!loading" class="fav-seller-list">
                <li class="fav-seller-list-item" v-for="singleFav in favorites">
                    <div class="fav-seller-list-item-info" @click="openProfile(singleFav.key)">
                        <div class="fav-seller-list-item-avatar">
                            <div class="fav-seller-list-item-image" :style="'background-image:' + singleFav.avatar "></div>
                        </div>
                        <span class="fav-seller-list-item-name">
                            {{singleFav.name}}
                        </span>
                    </div>
                </li>
            </ul>

            <div class="fav-seller-footer" hidden>
                <small class="fav-seller-version-info" @dblclick="toggleDebug">{{package.version}}</small>
                <div v-if="debug" class="fav-seller-error-message">{{ error.message }}</div>
            </div>
    </div>
</template>

<script>
const storage = require('./storage');
const storageChrome = require('../extention/scripts/src/storageChrome.es6');
const statistics = require('../extention/scripts/src/statistics.es6');
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
        openProfile(key) {
            const mainUrl = this.$parent.url.match(/https:\/\/.+\.ru/);
            this.$parent.loadTab(`${mainUrl[0]}/user/${key}/profile`);
            statistics('openProfile');
        },
        toggleDebug() {
            this.$set(this, 'debug', !this.debug);
            console.log(this.error);
        },
        async updateData() {
            this.$parent.getCurrentUrl();
            const items = await storageChrome.getFavorites();
            this.$set(this, 'favorites', items);
            this.$set(this, 'loading', false);
        }
    },
    mounted() {
        this.updateData();
        chrome.storage.onChanged.addListener(() => {
            this.updateData();
        });

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
    cursor: pointer;
}
.fav-seller-list-item:hover .fav-seller-list-item-name {
    color: #ff6163;
}

.fav-seller-list-item-info {
    display: flex;
    padding: 2px;
    align-items: center;
}

.fav-seller-list-item-avatar {
    width: 50px;
    height: 50px;
}

.fav-seller-list-item-image {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-size: cover;
    background-repeat: no-repeat;

}

.fav-seller-list-item-name {
    padding: 5px;
    white-space: nowrap;
    text-overflow: initial;
    overflow: hidden;
    color: #0091d9;
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