<template>
    <!-- 歌曲列表页面 -->
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"/>
        </div>
        <h1 class="title" v-html="title"/>
        <!-- 歌手图片 -->
        <div class="bg-image" :style="bgStyle" ref="bgImage">

        </div>
        <!-- 背景层 -->
        <div class="bg-layer" ref="layer"/>
        <!-- 歌曲列表 -->
        <scroll @scroll="scroll" :listen-scroll="listenScroll" :data="songs" :probe-type="probeType" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs"/>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";

const RESERVED_HEIGHT = 40;

export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: 0 // 在data中列出属性，才可以被watch中的方法监控
    };
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imageHeight}px`; // 计算出滚动容器的顶部位置
  },
  computed: {
    bgStyle() {
      return { backgroundImage: `url(${this.bgImage})` };
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    }
  },
  watch: {
    scrollY(newVal) {
      let translateY = Math.max(this.minTransalteY, newVal);
      this.$refs.layer.style.webkitTransform = `translate3d(0,${translateY}px,0)`;
      let zIndex = 0;
      if(newVal<this.minTransalteY){
          zIndex = 10;
          this.$refs.bgImage.style.paddingTop = 0;
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
      }else{
          this.$refs.bgImage.style.paddingTop = '70%';
          this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
      }
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    SongList
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;

    .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
            display: block;
            padding: 10px;
            font-size: $font-size-large-x;
            color: $color-theme;
        }
    }

    .title {
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        no-wrap();
        text-align: center;
        line-height: 40px;
        font-size: $font-size-large;
        color: $color-text;
    }

    .bg-image {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;

        .play-wrapper {
            position: absolute;
            bottom: 20px;
            z-index: 50;
            width: 100%;

            .play {
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid $color-theme;
                color: $color-theme;
                border-radius: 100px;
                font-size: 0;

                .icon-play {
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: $font-size-medium-x;
                }

                .text {
                    display: inline-block;
                    vertical-align: middle;
                    font-size: $font-size-small;
                }
            }
        }

        .filter {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(7, 17, 27, 0.4);
        }
    }

    .bg-layer {
        position: relative;
        height: 100%;
        background: $color-background;
    }

    .list {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        background: $color-background;

        .song-list-wrapper {
            padding: 20px 30px;
        }

        .loading-container {
            position: absolute;
            width: 100%;
            top: 50%;
            transform: translateY(-50%);
        }
    }
}
</style>


