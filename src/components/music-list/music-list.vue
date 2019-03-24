<template>
    <!-- 歌曲列表页面 -->
    <div class="music-list">
        <div class="back" @click="back">
            <i class="icon-back"/>
        </div>
        <h1 class="title" v-html="title"/>
        <!-- 歌手海报 -->
        <div class="bg-image" :style="bgStyle" ref="bgImage">
             <div class="play-wrapper">
                <div ref="playBtn" v-show="songs.length>0" class="play">
                <i class="icon-play"></i>
                <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter" ref="filter"/>
        </div>
        <!-- 背景层 -->
        <div class="bg-layer" ref="layer"/>
        <!-- 歌曲列表 -->
        <scroll @scroll="scroll" :listen-scroll="listenScroll" :data="songs" :probe-type="probeType" class="list" ref="list">
            <div class="song-list-wrapper">
                <song-list :songs="songs"/>
            </div>
            <div v-show="!songs.length" class="loading-container">
                <loading></loading>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import SongList from "base/song-list/song-list";
import { prefixStyle } from "common/js/dom";

const RESERVED_HEIGHT = 40;

const transform = prefixStyle("transform");
const backdropFilter = prefixStyle("backdrop-filter");

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
    this.imageHeight = this.$refs.bgImage.clientHeight; // 图片高度
    this.minTransalteY = -this.imageHeight + RESERVED_HEIGHT; // 背景层最小偏移量
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
      let zIndex = 0;
      // 遮罩层向上偏移
      let translateY = Math.max(this.minTransalteY, newVal);
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      // 背景图片模糊
      let blur = 0;
      let scale = 1;
      const percent = Math.abs(newVal / this.imageHeight);
      if (newVal < 0) {
        blur = Math.min(20, percent * 20);
      } else {
        scale = 1 + percent;
        zIndex = 10; // 海报遮盖歌曲列表
      }
      this.$refs.filter.style[backdropFilter] = `blur(${blur}px)`;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      // 背景图片尺寸、随机播放按钮显示/隐藏
      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
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


