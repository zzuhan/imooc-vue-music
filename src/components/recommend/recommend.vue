<template>
    <!-- 推荐页面 -->
    <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <!-- 轮播图 -->
          <div v-if="recommends.length" class="slider-wrapper">
            <div class="slider-content">
              <slider ref="slider">
                <div v-for="(item,index) in recommends" :key="index">
                  <a :href="item.linkUrl">
                    <img @load="loadImage" :src="item.picUrl"/>
                  </a>
                </div>
              </slider>
            </div>
          </div>
          <!-- 推荐列表 -->
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="(item,index) in discList" :key="index" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
          <!-- 正在加载组件 -->
          <div class="loading-container" v-show="!discList.length">
            <loading/>
          </div>
        </div>
      </scroll>
    </div>
</template>

<script type="text/ecmascript-6">
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";

export default {
  data() {
    return {
      recommends: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
  },
  methods: {
    // 加载轮播图
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    // 加载推荐列表
    _getDiscList() {
      getDiscList().then(res => {
        this.discList = res.data.list;
      });
    },
    // 图片加载完成
    loadImage() {
      if (!this.checkloaded) {
        this.checkloaded = true;
        setTimeout(() => {
          this.$refs.scroll.refresh();
        }, 20);
      }
    }
  },
  components: {
    Scroll,
    Slider,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;

  .recommend-content {
    height: 100%;
    overflow: hidden;

    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;

      .slider-content {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }

      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }

        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;

          .name {
            margin-bottom: 10px;
            color: $color-text;
          }

          .desc {
            color: $color-text-d;
          }
        }
      }
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