<template>
    <!-- 歌手页面 -->
    <div class="singer" ref="singer">
        <list-view :data="singers" ref="list" @select="selectSinger"/>
        <!-- 子路由动画 -->
        <transition name="slide">
          <router-view/>
        </transition>
    </div>
</template>

<script>
import * as types from "store/mutation-types";
import { mapMutations } from "vuex";
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import ListView from "base/list-view/list-view";
import Singer from "common/js/singer";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  data() {
    return {
      /*
        singers（歌手）数据结构：
        [
          title:String,
          items:[
            {
              id:String,
              name:String,
              avatar:String
            }
          ]
        ]
       */
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    ...mapMutations({
      setSinger: types.SET_SINGER
    }),
    //  获取歌手列表
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    // 聚合歌手列表
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      // 为了得到有序列表，我们需要处理 map
      let ret = []; // A~Z
      let hot = []; // 热门
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      // 字母排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.id}`
      });
      this.setSinger(singer);
    }
  },
  components: { ListView }
};
</script>

<style lang="stylus" scoped>
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>

