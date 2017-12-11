// app.vue
<template>
    <div 
        :class="{ 'hive-holder': true, 'hive-holder_fixed': fixed, 'hive-holder-minimized': hidden }"
        :style="fixed ? { top: top + 'px', left: left + 'px' } : {}">
        <h4 v-on="{ dblclick: toggleWidget, mousedown: startMove, mouseup: stopMove }" v-if="hidden" class="hive-header">
            <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path stroke="#ffd700" stroke-width="7.2%" fill="#ffd700" d="M6.162 16.876c-.325.194-.45.143-.363-.22l.993-4.588c.038-.153.02-.212-.102-.315l-3.517-3.16c-.289-.243-.206-.317.173-.346l4.692-.566c.16-.012.248-.076.31-.221l1.94-4.202c.145-.344.256-.344.402 0l1.968 4.202c.061.145.15.209.31.221l4.677.566c.379.03.476.06.187.303l-3.517 3.203c-.122.103-.14.162-.102.315l1.042 4.581c.088.363-.102.442-.426.248l-4.155-2.293c-.137-.082-.206-.082-.343 0l-4.17 2.272z"></path></svg>
        <div class="hive-counter">0</div>
        </h4>
        <div v-if="!hidden">
            <h4 v-on="{ dblclick: toggleWidget, mousedown: startMove, mouseup: stopMove }" class="hive-header">
                 <div class="hive-no-events">
                    Добавить в избранное
                 </div>
            </h4>
            <div class="hive-controls">
                <div @click="addToFavorites">
                    <svg width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path stroke="#0AF" stroke-width="7.2%" :fill="currentIsFavorited" d="M6.162 16.876c-.325.194-.45.143-.363-.22l.993-4.588c.038-.153.02-.212-.102-.315l-3.517-3.16c-.289-.243-.206-.317.173-.346l4.692-.566c.16-.012.248-.076.31-.221l1.94-4.202c.145-.344.256-.344.402 0l1.968 4.202c.061.145.15.209.31.221l4.677.566c.379.03.476.06.187.303l-3.517 3.203c-.122.103-.14.162-.102.315l1.042 4.581c.088.363-.102.442-.426.248l-4.155-2.293c-.137-.082-.206-.082-.343 0l-4.17 2.272z"></path></svg>
                </div>
                <button type="button" @click="updateData" class="hive-control hive-reload">&#x21bb;</button>
            </div>
            <div v-if="loading" class="hive-loading"><div>Loading</div></div>

            <div v-if="!loading && !foldedfavorites.length" class="hive-loading">
                <div class="hive-no-data">
                </div>
            </div>

            <ul v-if="!loading && foldedfavorites.length" class="hive hive-list">
                <li class="hive-list-item" v-for="singleFav in foldedfavorites">
                    <div>
                        <a :href="'https://www.avito.ru/user/'+singleFav.key+'/profile'">
                            {{singleFav.name}}
                        </a>
                        {{singleFav.items.length}}
                    </div>

                    <button class="transparent-button" @click="removeFromFavorites(singleFav.key)">
                        <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>ico-trash</title><path d="M4.6 8.006v9.988c0 .225.181.406.406.406h9.988a.405.405 0 0 0 .406-.406V8.006H4.6zM17 8v9.994A2.005 2.005 0 0 1 14.994 20H5.006A2.005 2.005 0 0 1 3 17.994V8H1.993A.994.994 0 0 1 1 7V4c0-.552.445-1 .993-1h16.014c.548 0 .993.444.993 1v3c0 .552-.445 1-.993 1H17zm-4.6-6.4H7.6V3H6V1.5C6 .672 6.668 0 7.505 0h4.99C13.326 0 14 .666 14 1.5V3h-1.6V1.6zm-9.8 3v1.8h14.8V4.6H2.6zm6.886 5.26h1v6.25h-1V9.86zM7 9.876h1v6.25H7v-6.25zm5 0h1v6.25h-1v-6.25z" fill-rule="nonzero" fill="#FB6162"/></svg>
                    </button>
                </li>
            </ul>
            <div class="hive-footer">
                <small class="hive-version-info" @dblclick="toggleDebug">0.0.0</small>
                <div v-if="debug" class="hive-error-message">{{ error.message }}</div>
            </div>
        </div>
    </div>
</template>

<script>

const hivePosition = JSON.parse(localStorage.getItem('hive-position')) || {
    top: 30,
    left: 600
};

const storage = require('./storage');

let favorites = [];

export default {
    data: () => {
        return Object.assign(
            {
                showMore: true,
                loading: true,
                hidden: false,
                fixed: true,
                offsetX: 0,
                offsetY: 0,
                moving: false,
                debug: false,
                error: { message: 'В Багдаде все спокойно' },
                favorites,
                selected: [],
                sort: 'default'
            },
            hivePosition
        );
    },
    methods: {
        getLatestItems(profileUrl) {
            return fetch(`/user/${profileUrl}/profile/items?shortcut=active&limit=100`).then(res => res.json());
        },
        getProfileId() {
            const profileIdString = window.location.href.match(/\/\w+\/profile/g);
            const profileId = profileIdString ? profileIdString[0].replace('profile', '').replace(/\//g, '') : '';
            return profileId;
        },
        addToFavorites() {
            const title = document.querySelector('[data-marker="profilePublic/name"]');
            const profileId = this.getProfileId();
            storage.saveFavorite(profileId, { name: title.innerText, items: [] });
            this.updateData();
        },
        removeFromFavorites(key) {
            storage.unSaveFavorite(key);
            this.updateData();
        },
        startMove(event) {
            this.$set(this, 'moving', true);
            this.$set(this, 'offsetX', event.offsetX);
            this.$set(this, 'offsetY', event.offsetY);
        },
        stopMove() {
            this.$set(this, 'moving', false);
            localStorage.setItem(
                'hive-position',
                JSON.stringify({ top: this.top, left: this.left })
            );
        },
        toggleDebug() {
            this.$set(this, 'debug', !this.debug);
            console.log(this.error);
        },
        async updateData() {            
            const items = storage.getFavorites();
            Promise.all(items.map(async (singleItem) => {
                const updatedItems = await this.getLatestItems(singleItem.key);
                // console.log(singleItem, updatedItems.result.list);
                if (updatedItems.result.list.length !== singleItem.items) {
                    // const newItems = updatedItems.result.list.reduce((newArray, singleSearchItem) => {
                    //         if (singleSearchItem.items.some(singleSubItem => {
                    //             return singleSubItem.id !== singleItem.key
                    //         })) {
                    //             return newArray;
                    //         }
                    //         return newArray.concat(newItems);
                    //     }, [])
                    // console.log(newItems);
                }
                const newObj = { 
                    key: singleItem.key,
                    name: singleItem.name,
                    items: updatedItems.result.list
                };
                storage.saveFavorite(singleItem.key, newObj);
                return newObj;
                
            })).then((result) => {
                this.$set(this, 'favorites', result);
                this.$set(this, 'loading', false);
            });
        },
        toggleWidget() {
            this.$set(this, 'hidden', !this.hidden);
        },
        generatePosition() {
            return `top: ${this.top}; left: ${this.left}`;
        }
    },
    computed: {
        foldedfavorites() {
            return this.favorites;
        },
        currentIsFavorited() {
            const profileId = this.getProfileId();
            const exists = this.favorites.find(({ key }) => key === profileId);
            return exists ? '#0AF' : '#fff';
        }
    },
    mounted() {
        this.updateData();
        document.body.addEventListener('mousemove', event => {
            if (this.moving && this.fixed) {
                this.$set(this, 'top', event.clientY - this.offsetY);
                this.$set(this, 'left', event.clientX - this.offsetX);
            }
        });
    },
    beforeDestroy() {}
}
</script>

<style>
.hive-reviewer
{
    padding: 10px 5px;

    cursor: pointer;

    border-radius: 3px;
}

.hive-svg-logo
{
    padding: 0 10px;
}

.hive-no-events
{
    pointer-events: none;
}
.hive-list-item
{
    border-left: 3px solid transparent;
    padding: 2px;
    display: flex;
    justify-content: space-between;
}

.hive-list-item:nth-child(odd)
{
    background-color: #ecf0f1;
}
.hive-list-item_mandatory
{
    border-left: 3px solid #ff6163;
}
.hive-header
{
    display: flex;

    padding: 10px;
    margin-bottom: 0;

    cursor: move;
    text-align: center;

    justify-content: center;
    align-items: center;
}

.hive-holder
{
    font-family: PT Sans;

    position: absolute;
    z-index: 1;
    top: 0;
    right: 0;

    overflow: hidden;

    width: 250px;

    border-radius: 3px;
    background-color: white;
    box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, .2);
}

.hive-holder.hive-holder_fixed
{
    position: fixed;
    top: 30px;
    right: 30px;
}

.hive-holder-minimized
{
    width: auto;
    padding: 3px;
    position: relative;
}

.hive-counter {
    position: absolute;
    right: -12px;
    top: -12px;
    background-color: #FF6163;
    border-radius: 50%;
    color: white;
    width: 20px;
    padding: 4px;
}

.hive-holder.hive-holder-minimized.hive-holder_fixed {
    right: auto;
    overflow: visible;
}

.hive-holder-minimized .hive-header
{
    padding: 10px 0;
}

.hive-list
{
    overflow-x: hidden;
    overflow-y: scroll;

    width: 265px;
    height: 270px;
    margin: 0;
    padding: 0;

    list-style: none;
}



.hive-list-item-holder
{
    display: flex;
    overflow: visible;

    justify-content: flex-start;
    align-items: center;
}

.hive-avatar
{
    display: flex;

    width: 40px;
    height: 40px;

    justify-content: center;
    align-items: center;
}

.hive-info
{
    font-size: 1.2em;

    padding-left: 10px;

    color: black;
}
.hive-last-seen
{
    font-size: .8em;

    color: gray;
}

.hive-avatar-image
{
    overflow: hidden;

    width: 100%;

    border-radius: 50%;
}



.hive-toggle-more
{
    float: right;
}

.hive-footer
{
    padding: 4px;
}

.hive-version-info
{
    font-size: .8em;

    display: block;

    text-align: center;
}

.hive-loading
{
    display: flex;

    min-height: 270px;

    justify-content: center;
    align-items: center;
}
.hive-reload
{
    font-family: Lucida Sans Unicode;
    font-size: 20px;

    border: none;
}

.hive-controls
{

    display: flex;
    justify-content: space-evenly;
    align-items: center;
}

.hive-control
{
    color: white;
    background-color: #2c3e50;
}

.hive-control:active
{
    background-color: #95a5a6;
}

.hive-control:active,
.hive-control:focus
{
    border: none;
    outline: none;
    box-shadow: none;
}

.hive-error-message
{
    font-family: Courier New;

    padding: 10px;

    color: white;
    background-color: red;
}
.hive-no-data
{
    position: relative;

    opacity: .3;

    filter: grayscale(100%);
}
.hive-no-data:before
{
    position: absolute;
    top: 40px;
    right: 0;
    left: 0;

    content: 'no data';
    text-align: center;
}

.transparent-button {
    border: none;
    background-color: transparent;
    outline: none;
}

</style>