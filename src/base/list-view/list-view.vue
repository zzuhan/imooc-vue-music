<template>
    <scroll
          :probe-type="probeType"
          :data="data"
          class="listview"
          ref="listview"
          @scroll="scroll"
          :listen-scroll="listenScroll">
        <!-- 左侧歌手列表 -->
        <ul>
            <li v-for="(group,index) in data" class="list-group" :key="index" ref="listGroup">
                <h2 class="list-group-title">{{group.title}}</h2>
                <uL>
                <li @click="selectItem(item)" v-for="(item,index2) in group.items" :key="index2" class="list-group-item">
                    <img class="avatar" v-lazy="item.avatar">
                    <span class="name">{{item.name}}</span>
                </li>
                </uL>
            </li>
        </ul>
        <!-- 右侧字母列表 -->
        <!-- @是v-on的缩写 -->
        <!-- Vue.js 为 v-on 提供了事件修饰符（由点开头的指令后缀来表示） -->
        <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop>
            <ul>
                <li v-for="(item,index) in shortcutList" :key="index" :data-index="index" class="item" :class="{'current':currentIndex===index}">
                    {{item}}
                </li>
            </ul>
        </div>
        <!-- 固定标题 -->
        <div class="list-fixed" ref="fixed" v-show="fixedTitle">
          <div class="fixed-title">{{fixedTitle}}</div>
        </div>
        <!-- 正在加载 -->
        <div v-show="!data.length" class="loading-container">
          <loading/>
        </div>
    </scroll>
</template>

<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom";

const TITLE_HEIGHT = 30;
const ANCHOR_HEIGHT = 18;

export default {
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      currentIndex: 0,
      scrollY: 0,
      diff: 0
    };
  },
  computed: {
    // 字母列表
    shortcutList() {
      return this.data.map(group => group.title.substring(0, 1));
    },
    // 固定标题
    fixedTitle() {
      // 滚动到最顶端，再弹性下拉时，隐藏
      if (this.scrollY > 0) {
        return "";
      }
      return this.data[this.currentIndex]
        ? this.data[this.currentIndex].title
        : "";
    }
  },
  created() {
    this.probeType = 3; // 在屏幕滑动的过程中、momentum 滚动动画运行过程中实时派发 scroll 事件
    this.listHeight = [];
    this.touch = {};
    this.listenScroll = true;
  },
  methods: {
    // 计算每个分类的结束位置的纵向偏移量
    _calculateHeight() {
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    onShortcutTouchStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch = {
        anchorIndex,
        y1: firstTouch.pageY
      };
      this._scrollTo(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0; // 位运算，取整
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      // 点击li以外的区域（div的padding区域）
      if (index == null) {
        return;
      }
      // ul上部
      if (index < 0) {
        index = 0;
      } else if (index > this.data.length - 1) {
        // ul下部
        index = this.data.length - 1;
      }
      // 调用子组件的方法（this.$refs.listview是VueComponent）
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item) {
      this.$emit("select", item);
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      newY = -newY; // better-scroll返回的滚动距离是负值
      const listHeight = this.listHeight;
      // better-scroll模拟iOS风格，在两端可以弹性滚动。
      // 在最顶部弹性滚动时
      if (newY < 0) {
        this.currentIndex = 0;
        return;
      }
      // 正常滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (newY >= height1 && newY < height2) {
          this.currentIndex = i;
          this.diff = height2 - newY; // 下一个标题距离滚动视口顶部的距离
          return;
        }
      }
      // 在最底部弹性滚动时
      this.currentIndex = this.data.length - 1;
    },
    diff(newVal) {
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      // 当下一个标题不把固定标题往上顶时，fixedTop始终是0。防止频繁渲染DOM。
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0`; // 使用GPU加速
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';

.listview {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;

  .list-group {
    padding-bottom: 30px;

    .list-group-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }

    .list-group-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;

      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }

      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }

  .list-shortcut {
    position: absolute;
    z-index: 30;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;

    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;

      &.current {
        color: $color-theme;
      }
    }
  }

  .list-fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }

  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>


