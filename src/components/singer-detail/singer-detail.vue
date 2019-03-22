<template>
    <!-- 歌手详情页面 -->
    <music-list :title="title" :bg-image="bgImage" :songs="songs"/>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";

export default {
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getDetail() {
      // 刷新页面时
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      // 从歌手列表等页面跳转过来时
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.data.list);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        ret.push(createSong(musicData));
      });
      return ret;
    }
  },
  components: {
    MusicList
  }
};
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
</style>
