// app.vue
<template>
    <div 
        :class="{ 'hive-holder': true, 'hive-holder_fixed': fixed, 'hive-holder-minimized': hidden }"
        :style="fixed ? { top: top + 'px', left: left + 'px' } : {}">
        <h4 v-on="{ dblclick: toggleWidget, mousedown: startMove, mouseup: stopMove }" v-if="hidden" class="hive-header">
            &nbsp;&nbsp;&nbsp;<div class="hive-counter">{{ foldedReviewers.length }}</div>
        </h4>
        <div v-if="!hidden">
            <h4 v-on="{ dblclick: toggleWidget, mousedown: startMove, mouseup: stopMove }" class="hive-header">
                 <div class="hive-no-events">
                    Добавить в избранное
                    <svg @click="addToFavorites" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg"><path stroke="#0AF" stroke-width="7.2%" fill="#fff" d="M6.162 16.876c-.325.194-.45.143-.363-.22l.993-4.588c.038-.153.02-.212-.102-.315l-3.517-3.16c-.289-.243-.206-.317.173-.346l4.692-.566c.16-.012.248-.076.31-.221l1.94-4.202c.145-.344.256-.344.402 0l1.968 4.202c.061.145.15.209.31.221l4.677.566c.379.03.476.06.187.303l-3.517 3.203c-.122.103-.14.162-.102.315l1.042 4.581c.088.363-.102.442-.426.248l-4.155-2.293c-.137-.082-.206-.082-.343 0l-4.17 2.272z"></path></svg>
                 </div>
            </h4>
            <div class="hive-controls">
                <button type="button" @click="updateData" class="hive-control hive-reload">&#x21bb;</button>
            </div>
            <div v-if="loading" class="hive-loading"><div>Loading</div></div>

            <div v-if="!loading && !foldedReviewers.length" class="hive-loading">
                <div class="hive-no-data">
                </div>
            </div>

            <ul v-if="!loading && foldedReviewers.length" class="hive hive-list">
                
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
let reviewers = [];

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
                basePath: '',
                error: { message: 'В Багдаде все спокойно' },
                reviewers,
                selected: [],
                sort: 'default'
            },
            hivePosition
        );
    },
    methods: {
        toggleShowMore() {
            this.$set(this, 'showMore', !this.showMore);
        },
        addReviewer() {},
        addToFavorites() {},
        syncDataWithInput() {},
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
        updateData() {

        },
        toggleWidget() {
            // this.$set(this, 'hidden', !this.hidden);
        },
        generatePosition() {
            return `top: ${this.top}; left: ${this.left}`;
        }
    },
    computed: {
        foldedReviewers() {
            const sorted = this.reviewers;
            if (this.showMore) {
                return sorted;
            }
            return sorted.slice(0, 3);
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
    display: none;

    background-color: #c1cbd6;

    justify-content: center;
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

</style>